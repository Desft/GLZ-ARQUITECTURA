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

// ** MODIFICACIÓN AQUÍ **
// Eliminamos el listener que previene el envío y solo mostramos la alerta.
// El envío se maneja automáticamente con el HTML.

// ** Código original que fue modificado: **
// document.querySelector('form').addEventListener('submit', function(e) {
//     e.preventDefault();
//     alert('¡Gracias por contactarnos! Te responderemos en las próximas 24 horas.');
//     this.reset();
// });

// ** Nuevo código recomendado para manejar el mensaje de éxito **
// Netlify se encarga del envío, y nosotros solo mostramos la alerta después de un envío exitoso.
// Esto se logra de forma nativa con Netlify Forms.

// ********** UNIFICAMOS LOS EVENT LISTENERS DE SCROLL Y MEJORAMOS LA CABECERA **********
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
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
// Se ha refactorizado para ser modular y compatible con múltiples carruseles.
// Elimina la lógica anterior de carrusel y reemplázala con la siguiente:

// Lógica modular para carruseles múltiples
function initCarousel(carouselElement, prevButton, nextButton, items, indicatorsContainer) {
    let currentIndex = 0;

    function updateCarousel() {
        items.forEach(item => item.classList.remove('active'));
        items[currentIndex].classList.add('active');
        updateIndicators();
    }

    function updateIndicators() {
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            items.forEach((_, index) => {
                const indicator = document.createElement('span');
                indicator.classList.add('indicator');
                if (index === currentIndex) {
                    indicator.classList.add('active');
                }
                indicator.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                indicatorsContainer.appendChild(indicator);
            });
        }
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
            updateCarousel();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
    }

    updateCarousel(); // Initialize carousel
}

// Inicializar el carrusel principal de proyectos
document.addEventListener('DOMContentLoaded', () => {
    const mainCarouselContainer = document.querySelector('.carousel-container');
    if (mainCarouselContainer) {
        const mainPrevButton = mainCarouselContainer.querySelector('.carousel-prev');
        const mainNextButton = mainCarouselContainer.querySelector('.carousel-next');
        const mainItems = mainCarouselContainer.querySelectorAll('.carousel-item');
        const mainIndicators = mainCarouselContainer.querySelector('.carousel-indicators');
        initCarousel(mainCarouselContainer, mainPrevButton, mainNextButton, mainItems, mainIndicators);
    }
});

// Inicializar todos los carruseles de servicio
const serviceCarousels = document.querySelectorAll('.service-carousel-container');
serviceCarousels.forEach(carouselContainer => {
    const prevButton = carouselContainer.querySelector('.service-carousel-prev');
    const nextButton = carouselContainer.querySelector('.service-carousel-next');
    const items = carouselContainer.querySelectorAll('.service-carousel-item');
    const indicators = carouselContainer.querySelector('.service-carousel-indicators');
    initCarousel(carouselContainer, prevButton, nextButton, items, indicators);
});