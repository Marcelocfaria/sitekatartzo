/* ===== KATARTZO MARKETING & CO. - JAVASCRIPT COMPLETO ===== */

// === VARIÁVEIS GLOBAIS ===
let currentTestimonial = 0;
let isTyping = true;
let currentPortfolioFilter = 'all';

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', function() {
    initializeAllFeatures();
});

// Função principal de inicialização
function initializeAllFeatures() {
    // Navegação
    initializeNavigation();
    
    // Seção Hero
    createFloatingParticles();
    initializeTypingEffect();
    
    // Animações de scroll
    initializeScrollAnimations();
    
    // Portfólio
    initializePortfolioFilters();
    
    // Depoimentos
    initializeTestimonialsCarousel();
    
    // Formulário
    initializeContactForm();
    
    // Botões flutuantes
    initializeFloatingButtons();
    
    // Efeitos gerais
    initializeGeneralEffects();
}

// === NAVEGAÇÃO ===
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    
    // Efeito de scroll no navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Scroll suave para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Fechar menu mobile se estiver aberto
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// Toggle do menu mobile
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        hamburgerIcon.className = 'fas fa-times';
        document.body.style.overflow = 'hidden';
    } else {
        hamburgerIcon.className = 'fas fa-bars';
        document.body.style.overflow = 'auto';
    }
}

// === PARTÍCULAS FLUTUANTES ===
function createFloatingParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Tamanho aleatório (2px a 6px)
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Posição aleatória
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Delay e duração aleatórios
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        
        // Opacidade aleatória
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        particlesContainer.appendChild(particle);
    }
}

// === EFEITO DE DIGITAÇÃO ===
function initializeTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    const phrases = [
        "Transformando ideias em experiências que conectam",
        "Criatividade que gera resultados reais",
        "Sua marca no próximo nível digital",
        "Estratégias inovadoras para o seu sucesso"
    ];
    
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseTime = 2000;
    
    function type() {
        if (!isTyping) return;
        
        const current = phrases[currentPhrase];
        
        if (isDeleting) {
            typingElement.textContent = current.substring(0, currentChar - 1);
            currentChar--;
        } else {
            typingElement.textContent = current.substring(0, currentChar + 1);
            currentChar++;
        }
        
        let speed = isDeleting ? deleteSpeed : typeSpeed;
        
        if (!isDeleting && currentChar === current.length) {
            speed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentPhrase = (currentPhrase + 1) % phrases.length;
        }
        
        setTimeout(type, speed);
    }
    
    // Iniciar após 1 segundo
    setTimeout(type, 1000);
}

// === ANIMAÇÕES DE SCROLL ===
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar todos os elementos com fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Animação especial para as estatísticas
    const statsCards = document.querySelectorAll('.stats-card');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsCards.forEach(card => {
        statsObserver.observe(card);
    });
}

// Animação de contador para estatísticas
function animateCounter(element) {
    const target = element.querySelector('h4');
    const text = target.textContent;
    const number = parseInt(text);
    
    if (isNaN(number)) return;
    
    let current = 0;
    const increment = number / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        target.textContent = Math.floor(current) + (text.includes('+') ? '+' : '') + (text.includes('%') ? '%' : '');
    }, 50);
}

// === FILTROS DO PORTFÓLIO ===
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Atualizar botão ativo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar itens
            filterPortfolioItems(filter);
        });
    });
    
    // Adicionar evento de clique nos itens do portfólio
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            openPortfolioLightbox(this);
        });
    });
}

function filterPortfolioItems(filter) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filter === 'all' || itemCategory === filter) {
            item.style.display = 'block';
            setTimeout(() => {
                item.classList.remove('hide');
            }, 10);
        } else {
            item.classList.add('hide');
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

function openPortfolioLightbox(item) {
    // Simular abertura de lightbox
    const title = item.querySelector('h4').textContent;
    const description = item.querySelector('p').textContent;
    
    // Criar modal simples
    const modal = document.createElement('div');
    modal.className = 'portfolio-modal fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 p-8 rounded-lg max-w-lg mx-4">
            <h3 class="text-2xl font-bold mb-4">${title}</h3>
            <p class="text-gray-300 mb-6">${description}</p>
            <button onclick="closePortfolioModal()" class="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded transition-colors">
                Fechar
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePortfolioModal();
        }
    });
}

function closePortfolioModal() {
    const modal = document.querySelector('.portfolio-modal');
    if (modal) {
        modal.remove();
    }
}

// === CARROSSEL DE DEPOIMENTOS ===
function initializeTestimonialsCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (slides.length === 0) return;
    
    // Eventos dos botões
    if (prevBtn) prevBtn.addEventListener('click', () => changeTestimonial(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeTestimonial(1));
    
    // Eventos dos indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToTestimonial(index));
    });
    
    // Auto-play (opcional)
    setInterval(() => {
        if (document.querySelector('.testimonials-section').matches(':hover')) return;
        changeTestimonial(1);
    }, 5000);
    
    // Suporte a touch para mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                changeTestimonial(1); // Swipe left - próximo
            } else {
                changeTestimonial(-1); // Swipe right - anterior
            }
        }
    }
}

function changeTestimonial(direction) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Remover classe active do slide atual
    slides[currentTestimonial].classList.remove('active');
    indicators[currentTestimonial].classList.remove('active');
    
    // Calcular próximo slide
    currentTestimonial += direction;
    
    if (currentTestimonial >= slides.length) {
        currentTestimonial = 0;
    } else if (currentTestimonial < 0) {
        currentTestimonial = slides.length - 1;
    }
    
    // Ativar novo slide
    slides[currentTestimonial].classList.add('active');
    indicators[currentTestimonial].classList.add('active');
}

function goToTestimonial(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Remover classe active do slide atual
    slides[currentTestimonial].classList.remove('active');
    indicators[currentTestimonial].classList.remove('active');
    
    // Ir para o slide especificado
    currentTestimonial = index;
    
    // Ativar novo slide
    slides[currentTestimonial].classList.add('active');
    indicators[currentTestimonial].classList.add('active');
}

// === FORMULÁRIO DE CONTATO ===
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos
        if (validateForm(form)) {
            submitContactForm(form);
        }
    });
    
    // Validação em tempo real
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const formData = new FormData(form);
    
    // Validar nome
    const nome = formData.get('nome').trim();
    if (nome.length < 2) {
        showFieldError('nome', 'Nome deve ter pelo menos 2 caracteres');
        isValid = false;
    }
    
    // Validar email
    const email = formData.get('email').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Email inválido');
        isValid = false;
    }
    
    // Validar serviço
    const servico = formData.get('servico');
    if (!servico) {
        showFieldError('servico', 'Selecione um serviço');
        isValid = false;
    }
    
    // Validar mensagem
    const mensagem = formData.get('mensagem').trim();
    if (mensagem.length < 10) {
        showFieldError('mensagem', 'Mensagem deve ter pelo menos 10 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    switch (fieldName) {
        case 'nome':
            if (value.length < 2) {
                showFieldError(fieldName, 'Nome deve ter pelo menos 2 caracteres');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldName, 'Email inválido');
                return false;
            }
            break;
        case 'mensagem':
            if (value.length < 10) {
                showFieldError(fieldName, 'Mensagem deve ter pelo menos 10 caracteres');
                return false;
            }
            break;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const existingError = field.parentNode.querySelector('.field-error');
    
    if (existingError) {
        existingError.textContent = message;
    } else {
        const error = document.createElement('div');
        error.className = 'field-error text-red-400 text-sm mt-1';
        error.textContent = message;
        field.parentNode.appendChild(error);
    }
    
    field.classList.add('border-red-500');
}

function clearFieldError(field) {
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
    field.classList.remove('border-red-500');
}

function submitContactForm(form) {
    const submitBtn = form.querySelector('.submit-button');
    const originalText = submitBtn.innerHTML;
    
    // Mostrar loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
    submitBtn.disabled = true;
    
    // Simular envio (substitua pela integração real)
    setTimeout(() => {
        // Sucesso
        showFormSuccess();
        form.reset();
        
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showFormSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-20 right-6 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50';
    successMessage.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>Mensagem enviada com sucesso!</span>
        </div>
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// === BOTÕES FLUTUANTES ===
function initializeFloatingButtons() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Mostrar/esconder botão "voltar ao topo"
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
}

// === FUNÇÕES UTILITÁRIAS ===

// Scroll para seção específica
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Voltar ao topo
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// === EFEITOS GERAIS ===
function initializeGeneralEffects() {
    // Paralaxe simples para hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const speed = scrolled * 0.5;
            hero.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Efeito de hover nos cards de serviço
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Lazy loading para imagens (quando forem adicionadas)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('loading-placeholder');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// === PERFORMANCE E OTIMIZAÇÃO ===

// Debounce para eventos de scroll
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

// Throttle para eventos frequentes
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Aplicar debounce ao scroll
window.addEventListener('scroll', debounce(function() {
    // Funções que devem ser executadas com debounce
    updateScrollProgress();
}, 10));

function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Você pode usar isso para uma barra de progresso
    document.documentElement.style.setProperty('--scroll-progress', scrolled + '%');
}

// === TRATAMENTO DE ERROS ===
window.addEventListener('error', function(e) {
    console.warn('Erro capturado:', e.error);
    // Aqui você poderia enviar erros para um serviço de monitoramento
});

// === RECURSOS DE ACESSIBILIDADE ===
function initializeAccessibility() {
    // Navegação por teclado
    document.addEventListener('keydown', function(e) {
        // ESC fecha modais e menus
        if (e.key === 'Escape') {
            const modal = document.querySelector('.portfolio-modal');
            const mobileMenu = document.querySelector('.mobile-menu.active');
            
            if (modal) closePortfolioModal();
            if (mobileMenu) toggleMobileMenu();
        }
        
        // Enter/Space ativam botões
        if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.classList.contains('filter-btn')) {
                e.preventDefault();
                e.target.click();
            }
        }
    });
    
    // Foco visível para navegação por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Inicializar recursos de acessibilidade
initializeAccessibility();

// === ANALYTICS E TRACKING (Opcional) ===
function trackEvent(category, action, label) {
    // Integração com Google Analytics ou outro serviço
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Exemplos de tracking
document.addEventListener('click', function(e) {
    // Trackear cliques em botões importantes
    if (e.target.classList.contains('neon-button')) {
        trackEvent('Button', 'Click', 'CTA Button');
    }
    
    if (e.target.classList.contains('filter-btn')) {
        const filter = e.target.getAttribute('data-filter');
        trackEvent('Portfolio', 'Filter', filter);
    }
});

// === LOG DE INICIALIZAÇÃO ===
console.log('🚀 Katartzo Marketing & Co. - Site inicializado com sucesso!');
console.log('✨ Todas as funcionalidades JavaScript foram carregadas.');

// === EXPORTS (SE USANDO MÓDULOS) ===
// export { scrollToSection, toggleMobileMenu, scrollToTop };
