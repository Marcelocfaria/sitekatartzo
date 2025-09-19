// ====== CONFIGURAÇÕES GLOBAIS (melhor manter em um único lugar) ======
const CONFIG = {
    // Info de Contato e Mensagens
    contact: {
        whatsappNumber: '5511999999999', // Substitua pelo número real
        whatsappMessage: 'Olá! Gostaria de saber mais sobre os serviços da Katartzo Marketing & Co.',
        whatsappSuccessMessage: (name, email, message) => `Olá! Enviei uma mensagem pelo site. Meu nome é ${name} e meu email é ${email}. ${message}`
    },
    // Efeito de Digitação
    typing: {
        texts: [
            'Transformamos marcas digitalmente',
            'Criamos experiências únicas',
            'Geramos resultados reais',
            'Conectamos marcas aos clientes'
        ],
        speed: 100,
        delay: 2000
    },
    // Animações
    animation: {
        scrollOffset: 50, // Ajuste para a altura da barra de navegação, se necessário
        fadeInThreshold: 0.1,
        counterInterval: 16 // ~60fps
    }
};

// ====== MÓDULO PRINCIPAL: Otimização e Organização ======
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos os módulos
    const app = new KatartzoApp();
    app.init();
});

class KatartzoApp {
    constructor() {
        this.dom = {
            loadingScreen: document.getElementById('loading-screen'),
            navbar: document.getElementById('navbar'),
            mobileMenu: document.getElementById('mobile-menu'),
            hamburgerIcon: document.getElementById('hamburger-icon'),
            typingText: document.getElementById('typing-text'),
            testimonialsCarousel: document.getElementById('testimonials-carousel'),
            portfolioItems: document.querySelectorAll('.portfolio-item'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            counters: document.querySelectorAll('.counter')
        };

        this.state = {
            currentTestimonial: 0,
            testimonialInterval: null,
            isScrolling: false
        };
    }

    init() {
        this.hideLoadingScreen();
        this.initializeNavbar();
        this.initializeMobileMenu();
        this.initializeTypingEffect();
        this.initializeScrollAnimations();
        this.initializeTestimonials();
        this.initializePortfolioFilters();
        this.initializeCounters();
        this.initializeSmoothScroll();
        this.initializeBanner();
        this.initializeFormSubmission();
        this.initializeWhatsAppButtons();
        this.initializeGlobalEvents();
        this.initializeResizeHandler();

        this.logStyledMessage();
    }

    // ====== MÓDULOS DE FUNCIONALIDADES (separados por responsabilidade) ======
    hideLoadingScreen() {
        if (this.dom.loadingScreen) {
            setTimeout(() => {
                this.dom.loadingScreen.classList.add('hidden');
            }, 1000); // Reduzido para 1s para uma experiência mais ágil
        }
    }

    initializeNavbar() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > CONFIG.animation.scrollOffset) {
                this.dom.navbar?.classList.add('scrolled');
            } else {
                this.dom.navbar?.classList.remove('scrolled');
            }
        });
    }

    initializeMobileMenu() {
        this.dom.hamburgerIcon?.addEventListener('click', () => this.toggleMobileMenu());
    }

    toggleMobileMenu() {
        const { mobileMenu, hamburgerIcon } = this.dom;
        if (!mobileMenu || !hamburgerIcon) return;

        const isActive = mobileMenu.classList.toggle('active');
        hamburgerIcon.classList.toggle('fa-times', isActive);
        hamburgerIcon.classList.toggle('fa-bars', !isActive);
        document.body.style.overflow = isActive ? 'hidden' : 'auto';
    }

    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = anchor.getAttribute('href').substring(1);
                this.scrollToSection(sectionId);
            });
        });
    }

    scrollToSection(sectionId) {
        if (this.state.isScrolling) return;

        const section = document.getElementById(sectionId);
        if (!section) return;

        this.state.isScrolling = true;
        
        // Calcular a altura da navbar dinamicamente
        const navbarHeight = this.dom.navbar?.offsetHeight || 0;
        const targetPosition = section.offsetTop - navbarHeight;

        window.scrollTo({ top: targetPosition, behavior: 'smooth' });

        if (this.dom.mobileMenu?.classList.contains('active')) {
            this.toggleMobileMenu();
        }
        
        // Resetar o estado de scroll
        setTimeout(() => this.state.isScrolling = false, 1000);
    }
    
    // ... [Outras funções como initializeTypingEffect, initializeTestimonials, etc. seguem o mesmo padrão de classe] ...

    initializeTypingEffect() {
        if (!this.dom.typingText) return;
        const { texts, speed, delay } = CONFIG.typing;
        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;

        const typeText = () => {
            const currentText = texts[currentTextIndex];
            if (isDeleting) {
                this.dom.typingText.textContent = currentText.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                if (currentCharIndex === 0) {
                    isDeleting = false;
                    currentTextIndex = (currentTextIndex + 1) % texts.length;
                    setTimeout(typeText, speed);
                } else {
                    setTimeout(typeText, speed / 2);
                }
            } else {
                this.dom.typingText.textContent = currentText.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                if (currentCharIndex === currentText.length) {
                    setTimeout(() => {
                        isDeleting = true;
                        typeText();
                    }, delay);
                } else {
                    setTimeout(typeText, speed);
                }
            }
        };

        typeText();
    }

    initializeScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Melhora de performance: para de observar após a primeira visualização
                }
            });
        }, { threshold: CONFIG.animation.fadeInThreshold });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }

    initializeTestimonials() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const indicators = document.querySelectorAll('.indicator');
        if (slides.length === 0) return;
        
        this.showTestimonial(this.state.currentTestimonial);
        this.startTestimonialAutoPlay();
        
        this.dom.testimonialsCarousel?.addEventListener('mouseenter', () => this.stopTestimonialAutoPlay());
        this.dom.testimonialsCarousel?.addEventListener('mouseleave', () => this.startTestimonialAutoPlay());
        
        // Adicionar listeners para os indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToTestimonial(index);
                this.startTestimonialAutoPlay(); // Reinicia o autoplay
            });
        });
    }

    showTestimonial(index) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const indicators = document.querySelectorAll('.indicator');

        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        slides[index]?.classList.add('active');
        indicators[index]?.classList.add('active');

        this.state.currentTestimonial = index;
    }

    changeTestimonial(direction) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const totalSlides = slides.length;
        this.state.currentTestimonial = (this.state.currentTestimonial + direction + totalSlides) % totalSlides;
        this.showTestimonial(this.state.currentTestimonial);
    }
    
    goToTestimonial(index) {
        this.showTestimonial(index);
    }

    startTestimonialAutoPlay() {
        this.stopTestimonialAutoPlay();
        this.state.testimonialInterval = setInterval(() => this.changeTestimonial(1), 5000);
    }

    stopTestimonialAutoPlay() {
        clearInterval(this.state.testimonialInterval);
    }

    initializePortfolioFilters() {
        this.dom.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.dom.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.filterPortfolioItems(filter);
            });
        });
    }

    filterPortfolioItems(filter) {
        this.dom.portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const isVisible = filter === 'all' || category === filter;
            
            // Usar classes CSS para transições mais eficientes
            item.classList.toggle('hidden', !isVisible);
            item.style.opacity = isVisible ? '1' : '0';
            item.style.transform = isVisible ? 'scale(1)' : 'scale(0.8)';
        });
    }

    // ... [Implementar initializeCounters e outras funções internas da mesma forma] ...
    
    initializeCounters() {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.dom.counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        let current = 0;
        const target = parseInt(element.getAttribute('data-target'));
        const increment = target / (1000 / CONFIG.animation.counterInterval); // Animar em 1s
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            element.textContent = `${Math.floor(current)}${target === 50 ? '+' : ''}`;
        }, CONFIG.animation.counterInterval);
    }

    initializeBanner() {
        const bannerImage = document.querySelector('.banner-image');
        if (!bannerImage) return;

        bannerImage.addEventListener('error', (e) => {
            console.warn('Banner image not found. Trying local fallback.');
            e.target.src = 'assets/banner-katartzo.png';
            e.target.addEventListener('error', () => {
                console.error('Fallback banner image not found. Showing placeholder.');
                const bannerContainer = e.target.closest('.banner-container');
                if (bannerContainer) {
                    bannerContainer.innerHTML = `
                        <div class="banner-placeholder">
                            <i class="fas fa-image"></i>
                            <p>Espaço para Banner da Marca</p>
                            <span>Adicione: banner.jpeg no repositório GitHub</span>
                        </div>
                    `;
                }
            }, { once: true });
        }, { once: true });
        
        this.initializeLazyLoading(bannerImage);
    }

    initializeLazyLoading(element = null) {
        const lazyElements = element ? [element] : document.querySelectorAll('[data-src]');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, self) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        if (target.tagName === 'IMG') {
                            target.src = target.dataset.src;
                            target.removeAttribute('data-src');
                        } else {
                            target.style.backgroundImage = `url(${target.dataset.src})`;
                            target.removeAttribute('data-src');
                        }
                        self.unobserve(target);
                    }
                });
            });
            lazyElements.forEach(el => observer.observe(el));
        } else {
            // Fallback para navegadores sem suporte
            lazyElements.forEach(el => {
                if (el.tagName === 'IMG') {
                    el.src = el.dataset.src;
                } else {
                    el.style.backgroundImage = `url(${el.dataset.src})`;
                }
            });
        }
    }

    initializeFormSubmission() {
        const form = document.getElementById('contact-form');
        form?.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const errors = this.validateForm(data);
        if (errors.length > 0) {
            this.showNotification(`Erro: ${errors.join(', ')}`, 'error');
            return;
        }

        this.simulateFormSubmission(form, data);
    }

    validateForm({ nome, email, mensagem }) {
        const errors = [];
        if (!nome?.trim()) errors.push('Nome é obrigatório');
        if (!email?.trim() || !this.isValidEmail(email)) errors.push('Email válido é obrigatório');
        if (!mensagem?.trim()) errors.push('Mensagem é obrigatória');
        return errors;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    simulateFormSubmission(form, { nome, email, mensagem }) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
        submitButton.disabled = true;

        setTimeout(() => {
            form.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            this.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            
            setTimeout(() => {
                const message = CONFIG.contact.whatsappSuccessMessage(nome, email, mensagem);
                const whatsappUrl = `https://wa.me/${CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            }, 2000);
        }, 2000);
    }
    
    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        const styles = {
            success: 'bg-green-600 border-l-4 border-green-400',
            error: 'bg-red-600 border-l-4 border-red-400',
            info: 'bg-blue-600 border-l-4 border-blue-400'
        };

        notification.className = `notification fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg text-white ${styles[type] || styles.info}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="flex-1">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white opacity-70 hover:opacity-100">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    initializeWhatsAppButtons() {
        document.querySelectorAll('.whatsapp-button').forEach(button => {
            button.addEventListener('click', () => {
                const message = encodeURIComponent(CONFIG.contact.whatsappMessage);
                const url = `https://wa.me/${CONFIG.contact.whatsappNumber}?text=${message}`;
                window.open(url, '_blank');
            });
        });
    }

    initializeGlobalEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        document.addEventListener('click', (e) => this.trackImportantClicks(e));
    }

    handleKeyboardNavigation(e) {
        if (e.key === 'Escape' && this.dom.mobileMenu?.classList.contains('active')) {
            this.toggleMobileMenu();
        }
        
        if (e.key === 'ArrowLeft' && this.isElementInViewport(this.dom.testimonialsCarousel)) {
            this.changeTestimonial(-1);
        }
        
        if (e.key === 'ArrowRight' && this.isElementInViewport(this.dom.testimonialsCarousel)) {
            this.changeTestimonial(1);
        }
    }

    trackImportantClicks(e) {
        const target = e.target.closest('button, a');
        if (!target) return;

        const { trackEvent } = window.katartzoFunctions; // Usar função exportada

        if (target.classList.contains('neon-button')) {
            trackEvent('Button', 'Click', 'CTA Button');
        } else if (target.classList.contains('whatsapp-float')) {
            trackEvent('WhatsApp', 'Click', 'Float Button');
        } else if (target.classList.contains('filter-btn')) {
            trackEvent('Portfolio', 'Filter', target.getAttribute('data-filter'));
        }
    }

    logStyledMessage() {
        console.log(
            '%cKatartzo Marketing & Co.%c\n🚀 Website carregado com sucesso!\n💜 Desenvolvido com amor e tecnologia',
            'color: #8b5cf6; font-size: 20px; font-weight: bold;',
            'color: #ec4899; font-size: 14px;'
        );
    }
    
    // ====== UTILITY FUNCTIONS (podem ser estáticas ou helper methods) ======
    isElementInViewport(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
    }

    initializeResizeHandler() {
        window.addEventListener('resize', this.debounce(() => {
            if (this.dom.mobileMenu) {
                this.dom.mobileMenu.style.height = `${window.innerHeight}px`;
            }
        }, 250));
    }
    
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
}

// ====== EXPORTAÇÃO DE FUNÇÕES GLOBAIS (se necessário) ======
window.katartzoFunctions = {
    toggleMobileMenu: () => new KatartzoApp().toggleMobileMenu(), // Exemplo: instanciar ou buscar a instância
    changeTestimonial: (direction) => new KatartzoApp().changeTestimonial(direction),
    goToTestimonial: (index) => new KatartzoApp().goToTestimonial(index),
    openWhatsApp: () => {
        const { whatsappNumber, whatsappMessage } = CONFIG.contact;
        const message = encodeURIComponent(whatsappMessage);
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    },
    trackEvent: (category, action, label) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, { event_category: category, event_label: label });
        }
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
    }
};
