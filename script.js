document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // MOBILE NAVIGATION TOGGLE (Floating Panel)
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const body = document.body;

  if (mobileToggle && mobileMenu) {
    const toggleMenu = () => {
      mobileToggle.classList.toggle('active');
      
      // Toggle Tailwind transition classes
      mobileMenu.classList.toggle('opacity-100');
      mobileMenu.classList.toggle('scale-100');
      mobileMenu.classList.toggle('pointer-events-auto');
      
      mobileMenu.classList.toggle('opacity-0');
      mobileMenu.classList.toggle('scale-95');
      mobileMenu.classList.toggle('pointer-events-none');
      
      // Prevent scrolling behind mobile menu when open
      if (mobileMenu.classList.contains('opacity-100')) {
        body.classList.add('overflow-hidden');
      } else {
        body.classList.remove('overflow-hidden');
      }
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking mobile links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('opacity-100')) {
          toggleMenu();
        }
      });
    });
  }

  // ==========================================
  // NAVBAR SCROLL EFFECT (Minimal scale down/shadow)
  // ==========================================
  const header = document.querySelector('header > div');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 40) {
        header.classList.remove('py-2');
        header.classList.add('py-1', 'shadow-2xl', 'bg-white/98');
      } else {
        header.classList.remove('py-1', 'shadow-2xl', 'bg-white/98');
        header.classList.add('py-2', 'shadow-xl');
      }
    }
  });

  // ==========================================
  // ACTIVE NAVIGATION LINK ON SCROLL
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150; // Offsets floating navbar height
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`nav a[href*=${sectionId}]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', scrollActive);

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================
  // Gather elements to reveal
  const revealElements = document.querySelectorAll(
    '.problem-card, .feature-card, .step-item, #hero-content, #hero-image-wrapper, #masalah-header, #fitur-header, #cara-kerja-header'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal-el');
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
  });

  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.88;

    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;

      if (elTop < triggerBottom) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };

  // Run once initially to check for elements already in viewport
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
