// script.js

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as funcionalidades
    initLoadingScreen();
    initNavigation();
    initTypingEffect();
    initCounters();
    initPortfolioFilter();
    initTestimonials();
    initFormValidation();
    initScrollAnimations();
    initParticles();
});

// ===== FUNÇÕES DE INICIALIZAÇÃO =====

// Tela de carregamento
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simula tempo de carregamento (2 segundos)
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// Navegação e scroll
function initNavigation() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    // Controle da navbar no scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            
            // Esconde a navbar ao rolar para baixo, mostra ao rolar para cima
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = window.scrollY;
        
        // Ativa links da navegação conforme a seção visível
        activateNavLinks();
    });
    
    // Fecha menu mobile ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                toggleMobileMenu();
            }
        });
    });
}

// Efeito de digitação no hero
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    const texts = [
        "Transformando Marcas.",
        "Criando Experiências.",
        "Conectando Pessoas.",
        "Inovando Sempre."
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Remove caracteres
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Adiciona caracteres
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // Controla a transição entre textos
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1000; // Pausa no texto completo
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pausa antes de começar novo texto
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Inicia o efeito
    setTimeout(type, 1000);
}

// Contadores animados
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Quanto menor, mais rápido
    
    function animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = Math.ceil(target / speed);
        
        if (count < target) {
            counter.innerText = Math.min(count + increment, target);
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    }
    
    // Observador de interseção para iniciar animação quando visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Filtro do portfólio
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe active ao botão clicado
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filtra os itens do portfólio
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Carrossel de depoimentos
function initTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    
    // Função para mostrar um slide específico
    function showSlide(index) {
        // Oculta todos os slides
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Mostra o slide selecionado
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Configura os indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto-avanço dos depoimentos
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
}

// Validação de formulário
function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            // Simula envio bem-sucedido
            const submitBtn = document.getElementById('submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                document.getElementById('form-status').textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                document.getElementById('form-status').style.color = '#10B981';
                form.reset();
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Limpa a mensagem após 5 segundos
                setTimeout(() => {
                    document.getElementById('form-status').textContent = '';
                }, 5000);
            }, 2000);
        }
    });
    
    // Validação em tempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            clearError(input);
        });
    });
}

// Animações de scroll
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Partículas de fundo (simplificado)
function initParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    
    // Cria partículas simples
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Posição e tamanho aleatórios
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// ===== FUNÇÕES GLOBAIS =====

// Função para rolar suavemente para uma seção
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Ajuste para a navbar fixa
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Alternar menu mobile
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-times');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    } else {
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
    }
}

// Navegar entre depoimentos
function changeTestimonial(direction) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    
    currentIndex = (currentIndex + direction + slides.length) % slides.length;
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[currentIndex].classList.add('active');
    indicators[currentIndex].classList.add('active');
}

// Ir para um depoimento específico
function goToTestimonial(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
}

// Abrir WhatsApp
function openWhatsApp() {
    window.open('https://wa.me/5511999999999', '_blank');
}

// Ativar links de navegação conforme a seção visível
function activateNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== VALIDAÇÃO DE FORMULÁRIO =====

function validateForm() {
    const form = document.getElementById('contactForm');
    let isValid = true;
    
    // Valida nome
    const nome = form.querySelector('#nome');
    if (!validateField(nome)) isValid = false;
    
    // Valida email
    const email = form.querySelector('#email');
    if (!validateField(email)) isValid = false;
    
    // Valida mensagem
    const mensagem = form.querySelector('#mensagem');
    if (!validateField(mensagem)) isValid = false;
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}-error`);
    
    // Limpa erro anterior
    clearError(field);
    
    // Validações específicas por campo
    if (field.hasAttribute('required') && !value) {
        showError(field, 'Este campo é obrigatório');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, 'Por favor, insira um email válido');
            return false;
        }
    }
    
    if (field.id === 'mensagem' && value.length < 10) {
        showError(field, 'A mensagem deve ter pelo menos 10 caracteres');
        return false;
    }
    
    return true;
}

function showError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);
    field.classList.add('error');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    field.classList.remove('error');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// ===== MANIPULAÇÃO DE EVENTOS GLOBAIS =====

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (validateForm()) {
        // Simula envio bem-sucedido
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            document.getElementById('form-status').textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
            document.getElementById('form-status').style.color = '#10B981';
            event.target.reset();
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Limpa a mensagem após 5 segundos
            setTimeout(() => {
                document.getElementById('form-status').textContent = '';
            }, 5000);
        }, 2000);
    }
}
