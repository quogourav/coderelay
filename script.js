document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav a');
  const sections = document.querySelectorAll('main section[id]');

  // Header shadow + active nav link + back-to-top visibility on scroll
  const onScroll = () => {
    const scrollY = window.scrollY;

    header.classList.toggle('scrolled', scrollY > 40);
    backToTop.classList.toggle('visible', scrollY > 400);

    let current = sections[0] ? sections[0].id : '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 140) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // Scroll reveal animations
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }
});
