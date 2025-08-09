// Mobile menu toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Cierra el menú móvil si está abierto al hacer clic en un enlace
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Scroll animations using IntersectionObserver (Más eficiente)
document.addEventListener('DOMContentLoaded', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% del elemento visible para activar
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Dejar de observar una vez que se hizo visible
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        observer.observe(el);
    });

    // Animate counters when about section is visible - Usando IntersectionObserver
    const aboutSection = document.querySelector('.about');
    let counterAnimated = false; // Mueve la variable para que esté accesible
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                animateCounters();
                counterAnimated = true; // Marca como animado
                counterObserver.unobserve(entry.target); // Dejar de observar una vez que se animó
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Cuando el 50% de la sección "About" es visible
    });

    if (aboutSection) {
        counterObserver.observe(aboutSection);
    }
});


// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, '')); // Limpiar para obtener solo el número
        const originalText = counter.textContent; // Guardar el texto original para '+', '%'
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                // Asegura que el texto final sea el objetivo, manteniendo '+' o '%'
                counter.textContent = target + (originalText.includes('+') ? '+' : '') + (originalText.includes('%') ? '%' : '');
                clearInterval(timer);
            } else {
                // Actualiza con el número redondeado, manteniendo '+' o '%'
                counter.textContent = Math.floor(current) + (originalText.includes('+') ? '+' : '') + (originalText.includes('%') ? '%' : '');
            }
        }, 20);
    });
}

// Form submission
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('¡Gracias por contactarnos! Te responderemos en las próximas 24 horas.');
    this.reset();
});

// ********** UNIFICAMOS LOS EVENT LISTENERS DE SCROLL Y MEJORAMOS LA CABECERA **********
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled'); // Añade la clase 'scrolled'
    } else {
        header.classList.remove('scrolled'); // Remueve la clase
    }
});

// Aseguramos que las animaciones se carguen al inicio para los elementos ya visibles
window.addEventListener('load', () => {
    // Al usar IntersectionObserver, la llamada inicial a handleScrollAnimations()
    // ya no es estrictamente necesaria aquí porque el DOMContentLoaded ya lo maneja
    // para los elementos inicialmente visibles.
    // Pero si quieres una llamada explícita, puedes mantenerla si es más fácil de depurar.
});

// ********** Nuevo código para el Carrusel de Proyectos **********
let currentSlide = 0;
let isPlaying = true;
let progressInterval;
let slideInterval;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;
const carouselInner = document.getElementById('carouselInner');
const progressBar = document.getElementById('progressBar');

// Crear indicadores
function createIndicators() {
    const indicatorsContainer = document.getElementById('indicators');
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = i === 0 ? 'indicator active' : 'indicator';
        indicator.onclick = () => goToSlide(i);
        indicatorsContainer.appendChild(indicator);
    }
}

// Actualizar indicadores
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Actualizar slides
function updateSlides() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateIndicators();
}

// Ir a slide específico
function goToSlide(index) {
    currentSlide = index;
    updateSlides();
    resetProgress();
}

// Siguiente slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlides();
    resetProgress();
}

// Slide anterior
function previousSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlides();
    resetProgress();
}

// Barra de progreso
function updateProgress() {
    let progress = 0;
    progressInterval = setInterval(() => {
        progress += 0.5;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(progressInterval);
            if (isPlaying) {
                nextSlide();
            }
        }
    }, 40); // 4 segundos total
}

// Resetear progreso
function resetProgress() {
    clearInterval(progressInterval);
    progressBar.style.width = '0%';
    if (isPlaying) {
        updateProgress();
    }
}

// Auto-play
function startAutoPlay() {
    isPlaying = true;
    resetProgress();
}

function stopAutoPlay() {
    isPlaying = false;
    clearInterval(progressInterval);
}

// Event listeners para pausar en hover
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
}


// Controles de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        previousSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Touch/Swipe support para móviles
let startX = 0;
let endX = 0;

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener('touchend', () => {
        if (startX - endX > 50) {
            nextSlide();
        } else if (endX - startX > 50) {
            previousSlide();
        }
    });
}

// Inicialización del carrusel
document.addEventListener('DOMContentLoaded', () => {
    if (slides.length > 0) {
        createIndicators();
        startAutoPlay();
        updateSlides(); // Asegura que el carrusel se muestre correctamente al cargar la página
        preloadImages();
    }
});

// Precargar imágenes
function preloadImages() {
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img && img.src) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    });
}