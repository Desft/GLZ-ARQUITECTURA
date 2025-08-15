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
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Scroll animations using IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        observer.observe(el);
    });

    const aboutSection = document.querySelector('.about');
    let counterAnimated = false;
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                animateCounters();
                counterAnimated = true;
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    });

    if (aboutSection) {
        counterObserver.observe(aboutSection);
    }
});

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        const originalText = counter.textContent;
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + (originalText.includes('+') ? '+' : '') + (originalText.includes('%') ? '%' : '');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + (originalText.includes('+') ? '+' : '') + (originalText.includes('%') ? '%' : '');
            }
        }, 20);
    });
}

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

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


// ** Lógica para el modal de expansión de imagen con carrusel **
const imageModal = document.getElementById('image-modal');
const modalImage = imageModal.querySelector('img');
const modalClose = imageModal.querySelector('.modal-close');
const modalPrevBtn = imageModal.querySelector('.modal-prev-btn');
const modalNextBtn = imageModal.querySelector('.modal-next-btn');
const allExpandBtns = document.querySelectorAll('.expand-btn');

let currentCarouselImages = [];
let currentImageIndex = 0;

// Mostrar modal
function showModal(images, index) {
    currentCarouselImages = images;
    currentImageIndex = index;
    modalImage.src = currentCarouselImages[currentImageIndex];
    imageModal.style.display = 'flex';
}

// Ocultar modal
function hideModal() {
    imageModal.style.display = 'none';
}

// Navegar a la siguiente imagen en el modal
function nextImage() {
    currentImageIndex = (currentImageIndex < currentCarouselImages.length - 1) ? currentImageIndex + 1 : 0;
    modalImage.src = currentCarouselImages[currentImageIndex];
}

// Navegar a la imagen anterior en el modal
function prevImage() {
    currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : currentCarouselImages.length - 1;
    modalImage.src = currentCarouselImages[currentImageIndex];
}

// Asignar evento click a cada botón de expandir
allExpandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Encontrar el carrusel padre
        const parentCarousel = btn.closest('.service-carousel-container, .carousel-container');
        if (!parentCarousel) return;

        // Obtener todas las imágenes del carrusel padre
        const images = Array.from(parentCarousel.querySelectorAll('.carousel-item img, .service-carousel-item img')).map(img => img.src);
        
        // Encontrar el índice de la imagen clicada
        const currentImageSrc = btn.parentNode.querySelector('img').src;
        const currentIndex = images.indexOf(currentImageSrc);
        
        showModal(images, currentIndex);
    });
});

// Asignar eventos a los botones de navegación del modal
modalPrevBtn.addEventListener('click', prevImage);
modalNextBtn.addEventListener('click', nextImage);
modalClose.addEventListener('click', hideModal);

// Cerrar modal al hacer clic fuera de la imagen
window.addEventListener('click', (event) => {
    if (event.target == imageModal) {
        hideModal();
    }
});