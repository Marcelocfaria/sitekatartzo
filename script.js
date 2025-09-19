// ===== VARIABLES GLOBAIS =====
let currentTestimonial = 0;
let testimonialInterval;
let isScrolling = false;

// ===== CONFIGURAÇÕES =====
const CONFIG = {
    whatsappNumber: '5511999999999', // Substitua pelo número real
    whatsappMessage: 'Olá! Gostaria de saber mais sobre os serviços da Katartzo Marketing & Co.',
    typingTexts: [
        'Transformamos marcas digitalmente',
        'Criamos experiências únicas',
        'Geramos resultados reais',
        'Conectamos marcas aos clientes'
    ],
    typingSpeed: 100,
    typingDelay: 2000
};

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// ===== INICIALIZAÇÃO DO WEBSITE =====
function initializeWebsite() {
    // Loading screen
    setTimeout(() => {
        hideLoadingScreen();
    }, 1500);

    // Inicializar funcionalidades
    initializeNavbar();
    initializeTypingEffect();
    initializeScrollAnimations();
    initializeTestimonials();
    initializePortfolioFilters();
    initializeCounters();
    initializeSmoothScroll();
    
    console.log('Katartzo Website carregado com sucesso!');
}

// ===== LOADING SCREEN =====
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===== NAVBAR =====
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
        document.body.style.overflow = 'auto';
    } else {
        mobileMenu.classList.add('active');
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-times');
        document.body.style.overflow = 'hidden';
    }
}

// ===== SCROLL SUAVE =====
function initializeSmoothScroll() {
    // Adicionar comportamento suave para todos os links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                scrollToSection(this.getAttribute('href').substring(1));
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    if (isScrolling) return;
    isScrolling = true;
    
    const navbarHeight = document.getElementById('navbar').offsetHeight;
    const targetPosition = section.offsetTop - navbarHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Fechar menu mobile se estiver aberto
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

// ===== EFEITO DE DIGITAÇÃO =====
function initializeTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = CONFIG.typingTexts[currentTextIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % CONFIG.typingTexts.length;
                setTimeout(typeText, CONFIG.typingSpeed);
            } else {
                setTimeout(typeText, CONFIG.typingSpeed / 2);
            }
        } else {
            typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            
            if (currentCharIndex === currentText.length) {
                setTimeout(() => {
                    isDeleting = true;
                    typeText();
                }, CONFIG.typingDelay);
            } else {
                setTimeout(typeText, CONFIG.typingSpeed);
            }
        }
    }
    
    typeText();
}

// ===== ANIMAÇÕES DE SCROLL =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar todos os elementos com classe fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ===== CONTADORES =====
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    const counterOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, counterOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60; // Animar por 1 segundo (60 frames)
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current);
        
        // Adicionar + no final se for 50 ou 100%
        if (target === 50 && current >= target) {
            element.textContent = '50+';
        } else if (target === 100 && current >= target) {
            element.textContent = '100';
        }
    }, 16);
}

// ===== PORTFÓLIO FILTERS =====
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Atualizar botão ativo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrar items
            filterPortfolioItems(portfolioItems, filter);
        });
    });
}

function filterPortfolioItems(items, filter) {
    items.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 100);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.classList.add('hidden');
            }, 300);
        }
    });
}

// ===== DEPOIMENTOS CAROUSEL =====
function initializeTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    // Auto-play
    startTestimonialAutoPlay();
    
    // Pausar auto-play ao hover
    const carousel = document.getElementById('testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopTestimonialAutoPlay);
        carousel.addEventListener('mouseleave', startTestimonialAutoPlay);
    }
}

function showTestimonial(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Remover classe active de todos
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Adicionar classe active ao slide e indicador atual
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentTestimonial = index;
}

function changeTestimonial(direction) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;
    
    if (direction === 1) {
        currentTestimonial = (currentTestimonial + 1) % totalSlides;
    } else {
        currentTestimonial = (currentTestimonial - 1 + totalSlides) % totalSlides;
    }
    
    showTestimonial(currentTestimonial);
}

function goToTestimonial(index) {
    showTestimonial(index);
}

function startTestimonialAutoPlay() {
    stopTestimonialAutoPlay();
    testimonialInterval = setInterval(() => {
        changeTestimonial(1);
    }, 5000);
}

function stopTestimonialAutoPlay() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
}

// ===== WHATSAPP =====
function openWhatsApp() {
    const message = encodeURIComponent(CONFIG.whatsappMessage);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// ===== FORMULÁRIO DE CONTATO =====
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validar dados
    if (!validateForm(data)) {
        return;
    }
    
    // Simular envio (substitua por integração real)
    simulateFormSubmission(form, data);
}

function validateForm(data) {
    const errors = [];
    
    if (!data.nome.trim()) {
        errors.push('Nome é obrigatório');
    }
    
    if (!data.email.trim() || !isValidEmail(data.email)) {
        errors.push('Email válido é obrigatório');
    }
    
    if (!data.mensagem.trim()) {
        errors.push('Mensagem é obrigatória');
    }
    
    if (errors.length > 0) {
        showNotification('Erro: ' + errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function simulateFormSubmission(form, data) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Mostrar loading
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
    submitButton.disabled = true;
    
    // Simular delay de envio
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Mostrar sucesso
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Opcional: redirecionar para WhatsApp
        setTimeout(() => {
            const whatsappMessage = `Olá! Enviei uma mensagem pelo site. Meu nome é ${data.nome} e meu email é ${data.email}. ${data.mensagem}`;
            const message = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        }, 2000);
        
    }, 2000);
}

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type} fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm`;
    
    // Estilos baseados no tipo
    const styles = {
        success: 'bg-green-600 text-white border-l-4 border-green-400',
        error: 'bg-red-600 text-white border-l-4 border-red-400',
        info: 'bg-blue-600 text-white border-l-4 border-blue-400'
    };
    
    notification.className += ` ${styles[type] || styles.info}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white opacity-70 hover:opacity-100">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // ESC para fechar menu mobile
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
    
    // Setas para navegar depoimentos
    if (e.key === 'ArrowLeft') {
        const carousel = document.getElementById('testimonials-carousel');
        if (carousel && isElementInViewport(carousel)) {
            changeTestimonial(-1);
        }
    }
    
    if (e.key === 'ArrowRight') {
        const carousel = document.getElementById('testimonials-carousel');
        if (carousel && isElementInViewport(carousel)) {
            changeTestimonial(1);
        }
    }
});

// ===== UTILITY FUNCTIONS =====
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy load para imagens (se houver)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sem suporte
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}



// ===== ANALYTICS TRACKING =====
function trackEvent(category, action, label) {
    // Integração com Google Analytics ou outro serviço
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Track clicks em botões importantes
document.addEventListener('click', function(e) {
    const target = e.target.closest('button, a');
    if (!target) return;
    
    if (target.classList.contains('neon-button')) {
        trackEvent('Button', 'Click', 'CTA Button');
    }
    
    if (target.classList.contains('whatsapp-float')) {
        trackEvent('WhatsApp', 'Click', 'Float Button');
    }
    
    if (target.classList.contains('filter-btn')) {
        const filter = target.getAttribute('data-filter');
        trackEvent('Portfolio', 'Filter', filter);
    }
});

// ===== CONSOLE LOG STYLIZADO =====
console.log(
    '%cKatartzo Marketing & Co.%c\n🚀 Website carregado com sucesso!\n💜 Desenvolvido com amor e tecnologia',
    'color: #8b5cf6; font-size: 20px; font-weight: bold;',
    'color: #ec4899; font-size: 14px;'
);

// ===== EXPORT FUNCTIONS (se necessário) =====
window.katartzoFunctions = {
    scrollToSection,
    toggleMobileMenu,
    changeTestimonial,
    goToTestimonial,
    openWhatsApp,
    handleFormSubmit
};

