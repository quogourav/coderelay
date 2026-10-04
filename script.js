document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav a');
  const sections = document.querySelectorAll('main section[id]');

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

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

  // Contact form -> FormSubmit (emails contact@coderelay.in)
  const form = document.getElementById('contactForm');
  if (form) {
    const btn = document.getElementById('formBtn');
    const status = document.getElementById('formStatus');
    const show = (msg, cls, html) => {
      status.className = 'form-status ' + cls;
      if (html) status.innerHTML = msg; else status.textContent = msg;
    };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (!data.name.trim() || !/^\S+@\S+\.\S+$/.test(data.email.trim()) || !data.message.trim()) {
        show('Please add your name, a valid email and a short message.', 'err');
        return;
      }
      btn.disabled = true;
      show('Sending...', '');
      try {
        const res = await fetch('https://formsubmit.co/ajax/contact@coderelay.in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            ...data,
            _subject: 'New enquiry from coderelay.in: ' + data.service,
            _template: 'table'
          })
        });
        const out = await res.json();
        if (!res.ok || String(out.success) !== 'true') throw new Error(out.message || 'failed');
        form.reset();
        show('Thank you for getting in touch. A member of our team will respond within one working day.', 'ok');
      } catch (err) {
        console.error('Contact form failed:', err.message);
        show('Sorry, something went wrong. Please email us at <a href="mailto:contact@coderelay.in">contact@coderelay.in</a>.', 'err', true);
      } finally {
        btn.disabled = false;
      }
    });
  }
});
