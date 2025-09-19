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
        return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
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
    }
};

// ===== LOADING SCREEN =====
class LoadingScreen {
    constructor() {
        this.element = utils.getElement('#loading-screen');
        this.init();
    }

    init() {
        if (!this.element) return;

        // Auto-hide after page load
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 2000);
        });

        // Fallback: hide after 5 seconds
        setTimeout(() => this.hide(), 5000);
    }

    hide() {
        if (!this.element) return;

        this.element.style.opacity = '0';
        setTimeout(() => {
            this.element.style.display = 'none';
            document.body.classList.remove('loading');
        }, 500);
    }
}

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.navbar = utils.getElement('#navbar');
        this.mobileMenu = utils.getElement('#mobile-menu');
        this.hamburgerBtn = utils.getElement('#hamburger-btn');
        this.hamburgerIcon = utils.getElement('#hamburger-icon');
        this.init();
    }

    init() {
        if (!this.navbar) return;

        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupKeyboardNavigation();
    }

    setupScrollEffect() {
        const handleScroll = utils.throttle(() => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    setupMobileMenu() {
        if (!this.hamburgerBtn || !this.mobileMenu) return;

        this.hamburgerBtn.addEventListener('click', () => this.toggleMobileMenu());

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileMenu.contains(e.target) && 
                !this.hamburgerBtn.contains(e.target) &&
                this.mobileMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const isActive = this.mobileMenu.classList.contains('active');
        
        this.mobileMenu.classList.toggle('active');
        this.hamburgerBtn.setAttribute('aria-expanded', !isActive);
        
        if (this.hamburgerIcon) {
            this.hamburgerIcon.classList.toggle('fa-bars');
            this.hamburgerIcon.classList.toggle('fa-times');
        }

        // Manage body scroll
        document.body.style.overflow = !isActive ? 'hidden' : '';
    }

    setupSmoothScrolling() {
        const links = utils.getElements('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    setupKeyboardNavigation() {
        // Focus management for mobile menu
        const menuLinks = utils.getElements('#mobile-menu a');
        
        menuLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    // Cycle through menu items
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

    scrollToSection(sectionId) {
        const section = utils.getElement(`#${sectionId}`);
        if (!section) return;

        section.scrollIntoView({ 
            behavior: utils.prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start'
        });

        // Close mobile menu if open
        if (this.mobileMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }

        // Update URL without triggering scroll
        history.pushState(null, null, `#${sectionId}`);
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

        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (!this.isDeleting && this.charIndex < currentText.length) {
            this.element.textContent += currentText.charAt(this.charIndex);
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
            // Fallback: show all elements immediately
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
        elements.forEach(element => this.observer.observe(element));
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

                // Stop observing this element
                this.observer.unobserve(entry.target);
            }
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000; // 2 seconds
        const frameRate = 60;
        const totalFrames = duration * frameRate / 1000;
        const increment = target / totalFrames;
        let current = 0;

        const updateCounter = () => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current < target) {
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
        
        // Filter items with animation
        this.portfolioItems.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.classList.remove('hidden');
                item.setAttribute('aria-hidden', 'false');
            } else {
                item.classList.add('hidden');
                item.setAttribute('aria-hidden', 'true');
            }
        });

        // Announce filter change to screen readers
        const announcement = `Mostrando projetos: ${filter === 'all' ? 'todos' : activeBtn.textContent}`;
        this.announceToScreenReader(announcement);
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
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        this.setupNavigation();
        this.setupKeyboardNavigation();
        this.setupAutoAdvance();
        this.setupTouchGestures();
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
        const carousel = utils.getElement('.testimonials-carousel');
        if (!carousel) return;

        carousel.addEventListener('keydown', (e) => {
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
            }
        });
    }

    setupAutoAdvance() {
        if (utils.prefersReducedMotion()) return;

        this.startAutoAdvance();

        // Pause on hover/focus
        const carousel = utils.getElement('.testimonials-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoAdvance());
            carousel.addEventListener('mouseleave', () => this.startAutoAdvance());
            carousel.addEventListener('focusin', () => this.pauseAutoAdvance());
            carousel.addEventListener('focusout', () => this.startAutoAdvance());
        }
    }

    setupTouchGestures() {
        const carousel = utils.getElement('.testimonials-carousel');
        if (!carousel) return;

        let startX = 0;
        let startY = 0;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only handle horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.changeSlide(1); // Swipe left - next slide
                } else {
                    this.changeSlide(-1); // Swipe right - previous slide
                }
            }

            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    changeSlide(direction) {
        if (this.isTransitioning) return;

        this.currentIndex += direction;
        
        if (this.currentIndex >= this.slides.length) {
            this.currentIndex = 0;
        } else if (this.currentIndex < 0) {
            this.currentIndex = this.slides.length - 1;
        }
        
        this.updateDisplay();
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        
        this.currentIndex = index;
        this.updateDisplay();
    }

    updateDisplay() {
        this.isTransitioning = true;

        this.slides.forEach((slide, index) => {
            const isActive = index === this.currentIndex;
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', !isActive);
        });

        this.indicators.forEach((indicator, index) => {
            const isActive = index === this.currentIndex;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive);
        });

        // Reset transition flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, CONFIG.testimonials.transitionDuration);
    }

    startAutoAdvance() {
        this.pauseAutoAdvance(); // Clear existing interval
        testimonialInterval = setInterval(() => {
            this.changeSlide(1);
        }, CONFIG.testimonials.autoAdvanceDelay);
    }

    pauseAutoAdvance() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
            testimonialInterval = null;
        }
    }

    destroy() {
        this.pauseAutoAdvance();
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
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} é obrigatório`;
        }

        // Email validation
        if (fieldName === 'email' && value && !utils.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Digite um e-mail válido';
        }

        // Message minimum length
        if (fieldName === 'mensagem' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'A mensagem deve ter pelo menos 10 caracteres';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
            field.classList.add('error');
            field.classList.remove('success');
        } else if (value) {
            field.classList.add('success');
            field.classList.remove('error');
        }

        return isValid;
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        const errorId = `${field.name}-error`;
        let errorEl = utils.getElement(`#${errorId}`);
        
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
        }
        
        field.classList.remove('error', 'success');
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
            // Simulate form submission
            await this.simulateSubmission();
            
            this.showStatus('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.form.reset();
            this.clearAllErrors();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showStatus('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async simulateSubmission() {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    setLoading(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('loading');
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>Enviando...';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
            this.submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2" aria-hidden="true"></i>Enviar Mensagem';
        }
    }

    showStatus(message, type) {
        if (!this.statusEl) return;

        this.statusEl.textContent = message;
        this.statusEl.className = `text-center text-sm mt-2`;
        
        switch(type) {
            case 'success':
                this.statusEl.classList.add('text-green-400');
                break;
            case 'error':
                this.statusEl.classList.add('text-red-400');
                break;
            default:
                this.statusEl.classList.add('text-blue-400');
        }

        // Clear status after 5 seconds
        setTimeout(() => {
            this.statusEl.textContent = '';
            this.statusEl.className = 'text-center text-sm mt-2';
        }, 5000);
    }

    clearAllErrors() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => this.clearFieldError(input));
    }

    setupPhoneFormatting() {
        const phoneInput = utils.getElement('#telefone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                e.target.value = utils.formatPhone(value);
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
        // Make openWhatsApp function globally available
        window.openWhatsApp = () => this.openChat();
    }

    openChat(customMessage = '') {
        const message = encodeURIComponent(customMessage || CONFIG.whatsapp.defaultMessage);
        const whatsappUrl = `https://wa.me/${CONFIG.whatsapp.phoneNumber}?text=${message}`;
        
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
    }

    observeMetrics() {
        // Observe Largest Contentful Paint
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP observer not supported');
        }

        // Observe First Input Delay
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.warn('FID observer not supported');
        }
    }

    logInitialMetrics() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    console.log('Performance Metrics:', {
                        'DOM Content Loaded': `${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`,
                        'Load Complete': `${navigation.loadEventEnd - navigation.loadEventStart}ms`,
                        'LCP': this.metrics.lcp ? `${this.metrics.lcp}ms` : 'Not measured',
                        'FID': this.metrics.fid ? `${this.metrics.fid}ms` : 'Not measured'
                    });
                }
            }, 1000);
        });
    }
}

// ===== ERROR HANDLER =====
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', (e) => this.handleError(e));
        window.addEventListener('unhandledrejection', (e) => this.handlePromiseRejection(e));
    }

    handleError(event) {
        console.error('JavaScript Error:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });

        // You could send this to an error tracking service
        // this.sendToErrorService(event);
    }

    handlePromiseRejection(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        
        // Prevent the default browser behavior
        event.preventDefault();
    }
}

// ===== MAIN APPLICATION =====
class KartartzoApp {
    constructor() {
        this.components = {};
        this.init();
    }

    async init() {
        try {
            // Initialize error handling first
            this.components.errorHandler = new ErrorHandler();
            
            // Wait for DOM to be
