document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = modal.querySelector(".close");
  const prevBtn = modal.querySelector(".modal-prev");
  const nextBtn = modal.querySelector(".modal-next");

  let allImages = [];
  let currentIndex = 0;

  // Función para recolectar todas las imágenes de servicios
  function collectAllImages() {
    allImages = [];
    const allCarousels = document.querySelectorAll('.service-carousel-item, .carousel-item');

    
    serviceCarousels.forEach(item => {
      const img = item.querySelector('img');
      if (img) {
        allImages.push({
          src: img.src,
          alt: img.alt
        });
      }
    });
  }

  // Función para configurar botones de expandir
  function setupExpandButtons() {
    const expandButtons = document.querySelectorAll(".expand-btn");
    
    expandButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Encontrar la imagen asociada a este botón
        const parentItem = btn.closest('.service-carousel-item');
        const img = parentItem.querySelector('img');
        
        if (img) {
          // Encontrar el índice de esta imagen en el array completo
          const imgIndex = allImages.findIndex(imageObj => imageObj.src === img.src);
          if (imgIndex !== -1) {
            currentIndex = imgIndex;
            openModal(allImages[currentIndex].src);
          }
        }
      });
    });
  }

  function openModal(src) {
    if (modal && modalImg) {
      modal.style.display = "flex";
      modalImg.src = src;
      modalImg.alt = "Imagen expandida";
      // Añadir clase para animación
      modal.classList.add('modal-active');
    }
  }

  function closeModal() {
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove('modal-active');
    }
  }

  function showImage(index) {
    if (allImages.length === 0) return;
    
    if (index < 0) index = allImages.length - 1;
    if (index >= allImages.length) index = 0;
    
    currentIndex = index;
    if (modalImg) {
      modalImg.src = allImages[currentIndex].src;
      modalImg.alt = allImages[currentIndex].alt;
    }
  }

  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal();
    });
  }

  // Teclado
  document.addEventListener("keydown", e => {
    if (modal && modal.style.display === "flex") {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    }
  });

  // Inicializar
  collectAllImages();
  setupExpandButtons();
  
  // Re-configurar cuando se actualicen los carruseles
  setTimeout(() => {
    collectAllImages();
    setupExpandButtons();
  }, 1000);
});