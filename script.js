/**
 * Katartzo Marketing & Co. - JavaScript
 * Modern, accessible and performant interactions
 */

'use strict';

// ===== GLOBAL VARIABLES =====
let currentTestimonial = 0;
let testimonialInterval;
let typingTimeout;
let scrollTimeout;

const CONFIG = {
    testimonials: {
        total: 3,
        autoAdvanceDelay: 5000,
        transitionDuration: 500
    },
    typing: {
        texts: [
            'Transformando marcas digitais',
            'Criando experiências únicas',
            'Conectando você ao seu público',
            'Inovação em cada projeto'
        ],
        typeSpeed: 100,
        deleteSpeed: 50,
        pauseDelay: 2000
    },
    animation: {
        observerOptions: {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    },
    whatsapp: {
        phoneNumber: '5511999999999',
        defaultMessage: 'Olá! Gostaria de saber mais sobre os serviços da Katartzo Marketing & Co.'
    }
};

// ===== UTILITY FUNCTIONS =====
const utils = {
    /**
     * Debounce function to limit function calls
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function to limit function calls
     */
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Get element with error handling
     */
    getElement: (selector) => {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    },

    /**
     * Get elements with error handling
     */
    getElements: (selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn(`No elements found: ${selector}`);
        }
        return elements;
    },

    /**
     * Check if user prefers reduced motion
     */
    prefersReducedMotion: () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Validate email format
     */
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Format phone number
     */
    formatPhone: (phone) => {
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    },

    /**
     * Show/hide element with animation
     */
    toggleElement: (element, show, className = 'hidden') => {
        if (show) {
            element.classList.remove(className);
            element.setAttribute('aria-hidden', 'false');
        } else {
            element.classList.add(className);
            element.setAttribute('aria-hidden', 'true');
        }
    },

    /**
     * Smooth scroll to element
     */
    smoothScrollTo: (element, offset = 80) => {
        const elementPosition = element.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = elementPosition - startPosition;
        const duration = 1000;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        if (utils.prefersReducedMotion()) {
            window.scrollTo(0, elementPosition);
        } else {
            requestAnimationFrame(animation);
        }
    }
};

// ===== LOADING SCREEN =====
class LoadingScreen {
    constructor() {
        this.element = utils.getElement('#loading-screen');
        this.minDisplayTime = 2000;
        this.startTime = Date.now();
        this.init();
    }

    init() {
        if (!this.element) return;

        // Auto-hide after page load
        window.addEventListener('load', () => {
            const elapsed = Date.now() - this.startTime;
            const remainingTime = Math.max(0, this.minDisplayTime - elapsed);
            setTimeout(() => this.hide(), remainingTime);
        });

        // Fallback: hide after 5 seconds
        setTimeout(() => this.hide(), 5000);
    }

    hide() {
        if (!this.element) return;

        this.element.classList.add('hidden');
        setTimeout(() => {
            this.element.style.display = 'none';
            document.body.classList.remove('loading');
        }, 500);
    }
}

// ===== NAVIGATION =====
class Navigation {
    constructor(options = {}) {
        this.navbar = utils.getElement(options.navbar || '#navbar');
        this.mobileMenu = utils.getElement(options.mobileMenu || '#mobile-menu');
        this.hamburgerBtn = utils.getElement(options.hamburgerBtn || '#hamburger-btn');
        this.hamburgerIcon = utils.getElement(options.hamburgerIcon || '#hamburger-icon');
        this.navLinks = utils.getElements(options.navLinks || '.nav-link');
        this.init();
    }

    init() {
        if (!this.navbar) return;

        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupKeyboardNavigation();
        this.setupActiveSection();
    }

    // ===== EFEITO NO SCROLL =====
    setupScrollEffect() {
        const handleScroll = utils.throttle(() => {
            this.navbar.classList.toggle('scrolled', window.scrollY > 100);
        }, 16);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // ===== MENU MOBILE =====
    setupMobileMenu() {
        if (!this.hamburgerBtn || !this.mobileMenu) return;

        this.hamburgerBtn.addEventListener('click', () => this.toggleMobileMenu());

        // Fechar com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.mobileMenu.contains(e.target) &&
                !this.hamburgerBtn.contains(e.target) &&
                this.mobileMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        });

        // Fechar ao clicar em qualquer link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.mobileMenu.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
        });
    }

    toggleMobileMenu() {
        const isActive = this.mobileMenu.classList.contains('active');

        this.mobileMenu.classList.toggle('active');
        this.hamburgerBtn.setAttribute('aria-expanded', String(!isActive));
        this.mobileMenu.setAttribute('aria-hidden', String(isActive));

        if (this.hamburgerIcon) {
            this.hamburgerIcon.classList.toggle('fa-bars', isActive);
            this.hamburgerIcon.classList.toggle('fa-times', !isActive);
        }

        // Bloquear scroll do body
        document.body.style.overflow = !isActive ? 'hidden' : '';

        // Foco no primeiro link
        if (!isActive) {
            const firstLink = this.mobileMenu.querySelector('a');
            if (firstLink) setTimeout(() => firstLink.focus(), 200);
        }
    }

    // ===== SCROLL SUAVE =====
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    this.scrollToSection(targetId);
                }
            });
        });
    }

    scrollToSection(sectionId) {
        const section = utils.getElement(`#${sectionId}`);
        if (!section) return;

        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Atualizar URL
        history.pushState(null, null, `#${sectionId}`);

        // Foco para acessibilidade
        setTimeout(() => {
            section.setAttribute('tabindex', '-1');
            section.focus();
        }, 600);
    }

    // ===== NAVEGAÇÃO POR TECLADO =====
    setupKeyboardNavigation() {
        const menuLinks = utils.getElements('#mobile-menu a');
        menuLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && index === 0) {
                        e.preventDefault();
                        menuLinks[menuLinks.length - 1].focus();
                    } else if (!e.shiftKey && index === menuLinks.length - 1) {
                        e.preventDefault();
                        menuLinks[0].focus();
                    }
                }
            });
        });
    }

    // ===== SEÇÃO ATIVA =====
    setupActiveSection() {
        const sections = utils.getElements('section[id]');
        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveNavLink(entry.target.id);
                }
            });
        }, {
            threshold: [0.2, 0.4, 0.6],
            rootMargin: '-80px 0px -80px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    setActiveNavLink(activeId) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${activeId}`);
        });
    }
}


// ===== TYPING EFFECT =====
class TypingEffect {
    constructor() {
        this.element = utils.getElement('#typing-text');
        this.texts = CONFIG.typing.texts;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isActive = true;
        this.init();
    }

    init() {
        if (!this.element || utils.prefersReducedMotion()) {
            if (this.element) {
                this.element.textContent = this.texts[0];
                this.element.classList.remove('typing-effect');
            }
            return;
        }

        // Pause when out of view
        this.setupVisibilityObserver();
        this.type();
    }

    setupVisibilityObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isActive = entry.isIntersecting;
            });
        }, { threshold: 0.1 });

        observer.observe(this.element);
    }

    type() {
        if (!this.isActive) {
            typingTimeout = setTimeout(() => this.type(), 100);
            return;
        }

        const currentText = this.texts[this.textIndex];
        
        if (!this.isDeleting && this.charIndex < currentText.length) {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
            typingTimeout = setTimeout(() => this.type(), CONFIG.typing.typeSpeed);
        } else if (this.isDeleting && this.charIndex > 0) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
            typingTimeout = setTimeout(() => this.type(), CONFIG.typing.deleteSpeed);
        } else {
            this.isDeleting = !this.isDeleting;
            if (!this.isDeleting) {
                this.textIndex = (this.textIndex + 1) % this.texts.length;
            }
            const delay = this.isDeleting ? 500 : CONFIG.typing.pauseDelay;
            typingTimeout = setTimeout(() => this.type(), delay);
        }
    }

    destroy() {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            this.showAllElements();
            return;
        }

        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            CONFIG.animation.observerOptions
        );

        const elements = utils.getElements('.fade-in, .stats-item');
        elements.forEach((element, index) => {
            // Add stagger delay
            element.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate counters
                if (entry.target.classList.contains('stats-item') && 
                    !entry.target.dataset.animated) {
                    const counter = entry.target.querySelector('.counter');
                    if (counter) {
                        this.animateCounter(counter);
                        entry.target.dataset.animated = 'true';
                    }
                }

                this.observer.unobserve(entry.target);
            }
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        if (isNaN(target)) return;

        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    showAllElements() {
        const elements = utils.getElements('.fade-in, .stats-item');
        elements.forEach(element => {
            element.classList.add('visible');
            
            if (element.classList.contains('stats-item')) {
                const counter = element.querySelector('.counter');
                if (counter) {
                    counter.textContent = counter.dataset.target;
                }
            }
        });
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// ===== PORTFOLIO FILTER =====
class PortfolioFilter {
    constructor() {
        this.filterBtns = utils.getElements('.filter-btn');
        this.portfolioItems = utils.getElements('.portfolio-item');
        this.grid = utils.getElement('#portfolio-grid');
        this.init();
    }

    init() {
        if (this.filterBtns.length === 0) return;

        this.setupFilters();
        this.setupKeyboardNavigation();
    }

    setupFilters() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filterItems(btn));
        });
    }

    setupKeyboardNavigation() {
        this.filterBtns.forEach((btn, index) => {
            btn.addEventListener('keydown', (e) => {
                let targetIndex;
                
                switch(e.key) {
                    case 'ArrowRight':
                        targetIndex = (index + 1) % this.filterBtns.length;
                        break;
                    case 'ArrowLeft':
                        targetIndex = (index - 1 + this.filterBtns.length) % this.filterBtns.length;
                        break;
                    case 'Home':
                        targetIndex = 0;
                        break;
                    case 'End':
                        targetIndex = this.filterBtns.length - 1;
                        break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        this.filterItems(btn);
                        return;
                    default:
                        return;
                }
                
                e.preventDefault();
                this.filterBtns[targetIndex].focus();
            });
        });
    }

    filterItems(activeBtn) {
        const filter = activeBtn.dataset.filter;
        
        // Update active button
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
        
        // Filter items with staggered animation
        let delay = 0;
        this.portfolioItems.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            setTimeout(() => {
                if (shouldShow) {
                    item.classList.remove('hidden');
                    item.setAttribute('aria-hidden', 'false');
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.classList.add('hidden');
                    item.setAttribute('aria-hidden', 'true');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                }
            }, delay);
            
            if (shouldShow) delay += 100;
        });

        // Announce filter change
        this.announceToScreenReader(`Mostrando projetos: ${filter === 'all' ? 'todos' : activeBtn.textContent}`);
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
    }
}

// ===== TESTIMONIALS CAROUSEL =====
class TestimonialsCarousel {
    constructor() {
        this.slides = utils.getElements('.testimonial-slide');
        this.indicators = utils.getElements('.indicator');
        this.prevBtn = utils.getElement('.testimonial-prev');
        this.nextBtn = utils.getElement('.testimonial-next');
        this.carousel = utils.getElement('.testimonials-carousel');
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.isPaused = false;
        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        this.setupNavigation();
        this.setupKeyboardNavigation();
        this.setupAutoAdvance();
        this.setupTouchGestures();
        this.setupAccessibility();
    }

    setupNavigation() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.changeSlide(-1));
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.changeSlide(1));
        }

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
    }

    setupKeyboardNavigation() {
        if (!this.carousel) return;

        this.carousel.setAttribute('tabindex', '0');
        this.carousel.setAttribute('role', 'region');
        this.carousel.setAttribute('aria-label', 'Carrossel de depoimentos');

        this.carousel.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.changeSlide(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.changeSlide(1);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
    }

    setupAutoAdvance() {
        if (utils.prefersReducedMotion()) return;

        this.startAutoAdvance();

        // Pause on hover/focus
        if (this.carousel) {
            this.carousel.addEventListener('mouseenter', () => this.pauseAutoAdvance());
            this.carousel.addEventListener('mouseleave', () => this.resumeAutoAdvance());
            this.carousel.addEventListener('focusin', () => this.pauseAutoAdvance());
            this.carousel.addEventListener('focusout', () => this.resumeAutoAdvance());
        }

        // Pause when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoAdvance();
            } else {
                this.resumeAutoAdvance();
            }
        });
    }

    setupTouchGestures() {
        if (!this.carousel) return;

        let startX = 0;
        let startY = 0;
        let isDragging = false;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            this.pauseAutoAdvance();
        }, { passive: true });

        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;

            // Prevent scrolling if horizontal swipe is detected
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
            }
        }, { passive: false });

        this.carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.changeSlide(1);
                } else {
                    this.changeSlide(-1);
                }
            }

            isDragging = false;
            this.resumeAutoAdvance();
        }, { passive: true });
    }

    setupAccessibility() {
        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-labelledby', `testimonial-${index}`);
            if (index === 0) {
                slide.setAttribute('aria-selected', 'true');
            }
        });

        this.indicators.forEach((indicator, index) => {
            indicator.setAttribute('role', 'tab');
            indicator.setAttribute('aria-label', `Depoimento ${index + 1}`);
            indicator.setAttribute('id', `testimonial-${index}`);
        });
    }

    changeSlide(direction) {
        if (this.isTransitioning) return;

        const prevIndex = this.currentIndex;
        this.currentIndex += direction;
        
        if (this.currentIndex >= this.slides.length) {
            this.currentIndex = 0;
        } else if (this.currentIndex < 0) {
            this.currentIndex = this.slides.length - 1;
        }
        
        this.updateDisplay();
        this.announceSlideChange();
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        
        this.currentIndex = index;
        this.updateDisplay();
        this.announceSlideChange();
    }

    updateDisplay() {
        this.isTransitioning = true;

        this.slides.forEach((slide, index) => {
            const isActive = index === this.currentIndex;
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', !isActive);
            slide.setAttribute('aria-selected', isActive);
        });

        this.indicators.forEach((indicator, index) => {
            const isActive = index === this.currentIndex;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive);
        });

        setTimeout(() => {
            this.isTransitioning = false;
        }, CONFIG.testimonials.transitionDuration);
    }

    announceSlideChange() {
        const currentSlide = this.slides[this.currentIndex];
        const testimonialText = currentSlide.querySelector('blockquote');
        if (testimonialText) {
            // Create accessible announcement
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Depoimento ${this.currentIndex + 1} de ${this.slides.length}`;
            
            document.body.appendChild(announcement);
            setTimeout(() => document.body.removeChild(announcement), 1000);
        }
    }

    togglePause() {
        if (this.isPaused) {
            this.resumeAutoAdvance();
        } else {
            this.pauseAutoAdvance();
        }
    }

    startAutoAdvance() {
        this.pauseAutoAdvance();
        testimonialInterval = setInterval(() => {
            if (!this.isPaused) {
                this.changeSlide(1);
            }
        }, CONFIG.testimonials.autoAdvanceDelay);
    }

    pauseAutoAdvance() {
        this.isPaused = true;
    }

    resumeAutoAdvance() {
        this.isPaused = false;
        if (!testimonialInterval) {
            this.startAutoAdvance();
        }
    }

    destroy() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
            testimonialInterval = null;
        }
    }
}

// ===== CONTACT FORM =====
class ContactForm {
    constructor() {
        this.form = utils.getElement('#contactForm');
        this.submitBtn = utils.getElement('#submit-btn');
        this.statusEl = utils.getElement('#form-status');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupValidation();
        this.setupSubmission();
        this.setupPhoneFormatting();
        this.setupAccessibility();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
            
            // Real-time validation for email
            if (input.type === 'email') {
                input.addEventListener('input', utils.debounce(() => {
                    if (input.value.length > 0) {
                        this.validateField(input);
                    }
                }, 500));
            }
        });
    }

    setupAccessibility() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const label = this.form.querySelector(`label[for="${input.id}"]`);
            if (label && input.hasAttribute('required')) {
                label.setAttribute('aria-required', 'true');
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} é obrigatório`;
        } else if (value) {
            // Field-specific validation
            switch (fieldName) {
                case 'email':
                    if (!utils.isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Digite um e-mail válido';
                    }
                    break;
                    
                case 'nome':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Nome deve conter apenas letras';
                    }
                    break;
                    
                case 'telefone':
                    const phoneNumbers = value.replace(/\D/g, '');
                    if (phoneNumbers.length > 0 && phoneNumbers.length < 10) {
                        isValid = false;
                        errorMessage = 'Digite um telefone válido';
                    }
                    break;
                    
                case 'mensagem':
                    if (value.length < 10) {
                        isValid = false;
                        errorMessage = 'A mensagem deve ter pelo menos 10 caracteres';
                    }
                    break;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
            field.classList.add('error');
            field.classList.remove('success');
            field.setAttribute('aria-invalid', 'true');
        } else if (value) {
            field.classList.add('success');
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
        }

        return isValid;
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        let firstInvalidField = null;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = input;
                }
            }
        });

        // Focus first invalid field
        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return isValid;
    }

    showFieldError(field, message) {
        const errorId = `${field.name}-error`;
        const errorEl = utils.getElement(`#${errorId}`);
        
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }

    clearFieldError(field) {
        const errorId = `${field.name}-error`;
        const errorEl = utils.getElement(`#${errorId}`);
        
        if (errorEl) {
            errorEl.classList.add('hidden');
            errorEl.textContent = '';
        }
        
        field.classList.remove('error', 'success');
        field.removeAttribute('aria-invalid');
    }

    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    setupSubmission() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showStatus('Por favor, corrija os erros antes de enviar', 'error');
            return;
        }

        this.setLoading(true);
        
        try {
            const formData = this.getFormData();
            await this.simulateSubmission(formData);
            
            this.showStatus('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.form.reset();
            this.clearAllErrors();
            
            // Scroll to top of form
            this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showStatus('Erro ao enviar mensagem. Tente novamente ou entre em contato via WhatsApp.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        
        return data;
    }

    async simulateSubmission(formData) {
        // Log form data for development
        console.log('Form submission data:', formData);
        
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate occasional failure for testing
                if (Math.random() > 0.9) {
                    reject(new Error('Network error'));
                } else {
                    resolve(formData);
                }
            }, 1500);
        });
    }

    setLoading(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('loading');
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>Enviando...';
            this.submitBtn.setAttribute('aria-busy', 'true');
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
            this.submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2" aria-hidden="true"></i>Enviar Mensagem';
            this.submitBtn.setAttribute('aria-busy', 'false');
        }
    }

    showStatus(message, type = 'info') {
        if (!this.statusEl) return;

        this.statusEl.textContent = message;
        this.statusEl.className = 'text-center text-sm mt-2';
        
        switch(type) {
            case 'success':
                this.statusEl.classList.add('text-green-400');
                this.statusEl.setAttribute('role', 'status');
                break;
            case 'error':
                this.statusEl.classList.add('text-red-400');
                this.statusEl.setAttribute('role', 'alert');
                break;
            default:
                this.statusEl.classList.add('text-blue-400');
                this.statusEl.setAttribute('role', 'status');
        }

        // Clear status after 8 seconds
        setTimeout(() => {
            this.statusEl.textContent = '';
            this.statusEl.className = 'text-center text-sm mt-2';
            this.statusEl.removeAttribute('role');
        }, 8000);
    }

    clearAllErrors() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => this.clearFieldError(input));
    }

    setupPhoneFormatting() {
        const phoneInput = utils.getElement('#telefone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const formatted = utils.formatPhone(value);
            e.target.value = formatted;
        });

        // Only allow numbers, spaces, parentheses and hyphens
        phoneInput.addEventListener('keypress', (e) => {
            const allowedChars = /[0-9\s\(\)\-]/;
            if (!allowedChars.test(e.key) && !e.ctrlKey && !e.metaKey && e.key.length === 1) {
                e.preventDefault();
            }
        });
    }
}

// ===== WHATSAPP INTEGRATION =====
class WhatsAppIntegration {
    constructor() {
        this.init();
    }

    init() {
        // Make functions globally available
        window.openWhatsApp = (customMessage) => this.openChat(customMessage);
        window.scrollToSection = (sectionId) => this.scrollToSection(sectionId);
        window.toggleMobileMenu = () => this.toggleMobileMenu();
        window.changeTestimonial = (direction) => this.changeTestimonial(direction);
        window.goToTestimonial = (index) => this.goToTestimonial(index);
        window.handleFormSubmit = (e) => this.handleFormSubmit(e);
    }

    openChat(customMessage = '') {
        const message = encodeURIComponent(customMessage || CONFIG.whatsapp.defaultMessage);
        const whatsappUrl = `https://wa.me/${CONFIG.whatsapp.phoneNumber}?text=${message}`;
        
        // Analytics tracking
        this.trackEvent('whatsapp_click', { source: customMessage ? 'custom' : 'default' });
        
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }

    scrollToSection(sectionId) {
        if (window.navigation) {
            window.navigation.scrollToSection(sectionId);
        }
    }

    toggleMobileMenu() {
        if (window.navigation) {
            window.navigation.toggleMobileMenu();
        }
    }

    changeTestimonial(direction) {
        if (window.testimonialsCarousel) {
            window.testimonialsCarousel.changeSlide(direction);
        }
    }

    goToTestimonial(index) {
        if (window.testimonialsCarousel) {
            window.testimonialsCarousel.goToSlide(index);
        }
    }

    handleFormSubmit(e) {
        if (window.contactForm) {
            window.contactForm.handleSubmit(e);
        }
    }

    trackEvent(eventName, data = {}) {
        // Google Analytics 4 tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Console log for development
        console.log('Event tracked:', eventName, data);
    }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        if ('PerformanceObserver' in window) {
            this.observeMetrics();
        }
        
        this.logInitialMetrics();
        this.monitorErrors();
    }

    observeMetrics() {
        // Largest Contentful Paint
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = Math.round(lastEntry.startTime);
                console.log('LCP:', this.metrics.lcp + 'ms');
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP observer not supported');
        }

        // First Input Delay
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.metrics.fid = Math.round(entry.processingStart - entry.startTime);
                    console.log('FID:', this.metrics.fid + 'ms');
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.warn('FID observer not supported');
        }

        // Cumulative Layout Shift
        try {
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.cls = Math.round(clsValue * 1000) / 1000;
                console.log('CLS:', this.metrics.cls);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('CLS observer not supported');
        }
    }

    logInitialMetrics() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    console.group('🚀 Performance Metrics');
                    console.log('DOM Content Loaded:', Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) + 'ms');
                    console.log('Load Complete:', Math.round(navigation.loadEventEnd - navigation.loadEventStart) + 'ms');
                    console.log('Total Load Time:', Math.round(navigation.loadEventEnd - navigation.fetchStart) + 'ms');
                    
                    if (this.metrics.lcp) console.log('LCP:', this.metrics.lcp + 'ms');
                    if (this.metrics.fid) console.log('FID:', this.metrics.fid + 'ms');
                    if (this.metrics.cls) console.log('CLS:', this.metrics.cls);
                    
                    console.groupEnd();
                }
            }, 1000);
        });
    }

    monitorErrors() {
        let errorCount = 0;
        
        window.addEventListener('error', (e) => {
            errorCount++;
            console.group(`❌ JavaScript Error #${errorCount}`);
            console.error('Message:', e.message);
            console.error('File:', e.filename);
            console.error('Line:', e.lineno + ':' + e.colno);
            if (e.error && e.error.stack) {
                console.error('Stack:', e.error.stack);
            }
            console.groupEnd();
        });

        window.addEventListener('unhandledrejection', (e) => {
            errorCount++;
            console.group(`❌ Unhandled Promise Rejection #${errorCount}`);
            console.error('Reason:', e.reason);
            console.groupEnd();
            e.preventDefault();
        });
    }
}

// ===== ERROR HANDLER =====
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        // Global error handling is now part of PerformanceMonitor
        this.setupFallbacks();
    }

    setupFallbacks() {
        // Fallback for browsers without IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, using fallback');
            this.polyfillIntersectionObserver();
        }

        // Fallback for browsers without smoothScrollBehavior
        if (!('scrollBehavior' in document.documentElement.style)) {
            console.warn('Smooth scroll not supported, using polyfill');
            this.polyfillSmoothScroll();
        }
    }

    polyfillIntersectionObserver() {
        // Simple fallback - show all elements immediately
        setTimeout(() => {
            const elements = utils.getElements('.fade-in');
            elements.forEach(el => el.classList.add('visible'));
        }, 100);
    }

    polyfillSmoothScroll() {
        // Use the custom smooth scroll function from utils
        const links = utils.getElements('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = utils.getElement(`#${targetId}`);
                if (target) {
                    utils.smoothScrollTo(target);
                }
            });
        });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupSkipLinks();
        this.setupFocusManagement();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.monitorColorContrast();
    }

    setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Pular para o conteúdo principal';
        
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const main = utils.getElement('main') || utils.getElement('#main') || utils.getElement('.main-content');
            if (main) {
                main.setAttribute('tabindex', '-1');
                main.focus();
            }
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupFocusManagement() {
        // Ensure all interactive elements are focusable
        const interactiveElements = utils.getElements('button, [role="button"], [tabindex="0"]');
        
        interactiveElements.forEach(el => {
            if (!el.hasAttribute('tabindex') && el.tagName !== 'BUTTON') {
                el.setAttribute('tabindex', '0');
            }
        });

        // Focus trap for modal-like elements
        this.setupFocusTraps();
    }

    setupFocusTraps() {
        const mobileMenu = utils.getElement('#mobile-menu');
        if (!mobileMenu) return;

        mobileMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = mobileMenu.querySelectorAll(
                    'a, button, [tabindex]:not([tabindex="-1"])'
                );
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for custom elements
        const customButtons = utils.getElements('[role="button"]:not(button)');
        
        customButtons.forEach(btn => {
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    }

    setupScreenReaderSupport() {
        // Add proper ARIA labels where missing
        const images = utils.getElements('img:not([alt])');
        images.forEach(img => {
            img.setAttribute('alt', '');
            img.setAttribute('role', 'presentation');
        });

        // Ensure form labels are properly associated
        const inputs = utils.getElements('input:not([aria-label]):not([id])');
        inputs.forEach((input, index) => {
            if (!input.id) {
                input.id = `input-${index}`;
            }
        });
    }

    monitorColorContrast() {
        // Log color contrast information for development
        if (window.getComputedStyle) {
            const textElements = utils.getElements('p, h1, h2, h3, h4, h5, h6, span, a');
            let lowContrastCount = 0;

            textElements.forEach(el => {
                const styles = window.getComputedStyle(el);
                const bgColor = styles.backgroundColor;
                const textColor = styles.color;
                
                // This is a simplified check - in production you'd want a proper contrast ratio calculator
                if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor) {
                    // Add your contrast checking logic here
                }
            });
        }
    }
}

// ===== MAIN APPLICATION =====
class KatartzoApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Show loading message
            console.log('🎨 Initializing Katartzo Marketing & Co. website...');

            // Initialize error handling first
            this.components.errorHandler = new ErrorHandler();
            this.components.performanceMonitor = new PerformanceMonitor();

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                });
            }

            // Initialize core components
            this.initializeComponents();
            
            // Setup global event listeners
            this.setupGlobalListeners();
            
            // Initialize accessibility enhancements
            this.components.accessibility = new AccessibilityEnhancements();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✅ Katartzo website initialized successfully!');
            
            // Dispatch custom event for other scripts
            window.dispatchEvent(new CustomEvent('katartzoInitialized', {
                detail: { app: this }
            }));

        } catch (error) {
            console.error('❌ Failed to initialize Katartzo website:', error);
        }
    }

    initializeComponents() {
        // Loading screen
        this.components.loadingScreen = new LoadingScreen();
        
        // Core functionality
        this.components.navigation = new Navigation();
        this.components.typingEffect = new TypingEffect();
        this.components.scrollAnimations = new ScrollAnimations();
        this.components.portfolioFilter = new PortfolioFilter();
        this.components.testimonialsCarousel = new TestimonialsCarousel();
        this.components.contactForm = new ContactForm();
        this.components.whatsapp = new WhatsAppIntegration();

        // Make components globally available for HTML onclick handlers
        window.navigation = this.components.navigation;
        window.testimonialsCarousel = this.components.testimonialsCarousel;
        window.contactForm = this.components.contactForm;
    }

    setupGlobalListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // Handle window resize
        const handleResize = utils.debounce(() => {
            this.handleResize();
        }, 250);
        
        window.addEventListener('resize', handleResize, { passive: true });

        // Handle orientation change on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 250);
        });

        // Handle back/forward navigation
        window.addEventListener('popstate', (e) => {
            if (window.location.hash) {
                const sectionId = window.location.hash.substring(1);
                this.components.navigation?.scrollToSection(sectionId);
            }
        });
    }

    pauseAnimations() {
        // Pause resource-intensive animations when tab is not visible
        this.components.testimonialsCarousel?.pauseAutoAdvance();
        this.components.typingEffect?.destroy();
    }

    resumeAnimations() {
        // Resume animations when tab becomes visible
        this.components.testimonialsCarousel?.resumeAutoAdvance();
        
        // Reinitialize typing effect if needed
        if (this.components.typingEffect && !utils.prefersReducedMotion()) {
            this.components.typingEffect = new TypingEffect();
        }
    }

    handleResize() {
        // Handle responsive behavior
        const isMobile = window.innerWidth < 768;
        
        // Update mobile menu if open on resize
        if (!isMobile && this.components.navigation?.mobileMenu?.classList.contains('active')) {
            this.components.navigation.toggleMobileMenu();
        }

        // Recalculate positions for fixed elements
        this.updateFixedElements();
    }

    updateFixedElements() {
        // Update any calculations that depend on window size
        const whatsappButton = utils.getElement('.whatsapp-float');
        if (whatsappButton) {
            // Ensure WhatsApp button doesn't interfere with other elements
            const footerHeight = utils.getElement('footer')?.offsetHeight || 0;
            const minBottom = Math.max(25, footerHeight - window.scrollY + 25);
            whatsappButton.style.bottom = `${Math.min(25, minBottom)}px`;
        }
    }

    destroy() {
        // Cleanup method for SPA navigation or page unload
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });

        // Clear timeouts
        if (typingTimeout) clearTimeout(typingTimeout);
        if (testimonialInterval) clearInterval(testimonialInterval);
        if (scrollTimeout) clearTimeout(scrollTimeout);

        this.isInitialized = false;
        console.log('🧹 Katartzo website components destroyed');
    }

    // Public API methods
    scrollTo(sectionId) {
        return this.components.navigation?.scrollToSection(sectionId);
    }

    openWhatsApp(message) {
        return this.components.whatsapp?.openChat(message);
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// ===== INITIALIZATION =====
// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.katartzoApp = new KatartzoApp();
    });
} else {
    window.katartzoApp = new KatartzoApp();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KatartzoApp;
}

