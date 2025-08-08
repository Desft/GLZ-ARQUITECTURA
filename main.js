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