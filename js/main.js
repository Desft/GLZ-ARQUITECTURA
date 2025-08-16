// ==========================
// 📌 Menú móvil
// ==========================
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    const links = document.querySelectorAll('.nav-links li');
    links.forEach((link, index) => {
        link.style.animation = navLinks.classList.contains('active')
            ? `fadeInRight 0.4s ease forwards ${index * 0.1 + 0.2}s`
            : '';
    });
}

// ==========================
// 📌 Scroll suave
// ==========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// ==========================
// 📌 Animaciones con IntersectionObserver
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(el => observer.observe(el));

    // Contadores en "Nosotros"
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
    }, { threshold: 0.5 });

    if (aboutSection) counterObserver.observe(aboutSection);

    // Inicializar funcionalidades
    initCarousels();
    initImageModal();
});

// ==========================
// 📌 Animación de contadores
// ==========================
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
                counter.textContent = target + 
                    (originalText.includes('+') ? '+' : '') + 
                    (originalText.includes('%') ? '%' : '');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + 
                    (originalText.includes('+') ? '+' : '') + 
                    (originalText.includes('%') ? '%' : '');
            }
        }, 20);
    });
}

// ==========================
// 📌 Header con scroll
// ==========================
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 0);
});

// ==========================
// 📌 Carruseles (servicios y proyectos)
// ==========================
function initCarousels() {
    const allCarousels = document.querySelectorAll('.carousel-container, .service-carousel-container');
    
    allCarousels.forEach(carouselContainer => {
        const prevButton = carouselContainer.querySelector('.carousel-prev, .service-carousel-prev');
        const nextButton = carouselContainer.querySelector('.carousel-next, .service-carousel-next');
        const items = carouselContainer.querySelectorAll('.carousel-item, .service-carousel-item');
        const indicatorsContainer = carouselContainer.querySelector('.carousel-indicators, .service-carousel-indicators');

        if (items.length === 0) return;

        let currentIndex = 0;
        let autoPlayInterval;

        function updateCarousel() {
            items.forEach(item => item.classList.remove('active'));
            items[currentIndex].classList.add('active');
            updateIndicators();
        }

        function updateIndicators() {
            if (!indicatorsContainer) return;
            indicatorsContainer.innerHTML = '';
            items.forEach((_, index) => {
                const indicator = document.createElement('span');
                indicator.classList.add('indicator');
                if (index === currentIndex) indicator.classList.add('active');
                indicator.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                    resetAutoPlay();
                });
                indicatorsContainer.appendChild(indicator);
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateCarousel();
        }

        function startAutoPlay() {
            if (items.length > 1) {
                const delay = carouselContainer.classList.contains('carousel-container') ? 5000 : 4000;
                autoPlayInterval = setInterval(nextSlide, delay);
            }
        }

        function stopAutoPlay() {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        if (prevButton) prevButton.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
        if (nextButton) nextButton.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);

        updateCarousel();
        startAutoPlay();
    });
}

// ==========================
// 📌 Modal de imágenes (fix aplicado)
// ==========================
function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = modal ? modal.querySelector('.close') : null;
    
    if (!modal || !modalImg) return;
    
    let currentImages = [];
    let currentImageIndex = 0;
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.expand-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            const expandBtn = e.target.closest('.expand-btn');
            const carousel = expandBtn.closest('.service-carousel, .carousel');
            const items = carousel ? carousel.querySelectorAll('.service-carousel-item, .carousel-item') : [];
            
            // ✅ Guardar solo las imágenes de este carrusel
            currentImages = Array.from(items).map(item => {
                const imgEl = item.querySelector('img');
                return imgEl ? imgEl.src : null;
            }).filter(src => src !== null);
            
            // ✅ Determinar índice según la posición del item
            const clickedItem = expandBtn.closest('.service-carousel-item, .carousel-item');
            currentImageIndex = Array.from(items).indexOf(clickedItem);
            
            showModal(currentImages[currentImageIndex]);
        }
    });
    
    function showModal(imgSrc) {
        modalImg.src = imgSrc;
        modal.style.display = 'flex';
        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal() {
        modal.style.display = 'none';
        modal.classList.remove('modal-active');
        document.body.style.overflow = 'auto';
    }
    
    function showNextImage() {
        if (currentImages.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % currentImages.length;
            modalImg.src = currentImages[currentImageIndex];
        }
    }
    
    function showPrevImage() {
        if (currentImages.length > 1) {
            currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
            modalImg.src = currentImages[currentImageIndex];
        }
    }
    
    if (closeBtn) closeBtn.addEventListener('click', hideModal);
    const nextBtn = modal.querySelector('.modal-next');
    const prevBtn = modal.querySelector('.modal-prev');
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
    
    modal.addEventListener('click', e => { if (e.target === modal) hideModal(); });
    
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') hideModal();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });
}

