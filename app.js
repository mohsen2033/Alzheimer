/* Phase 1 interaction controller: particles + scroll-reveal + guided navigation */
(() => {
  const particleField = document.getElementById('particle-field');
  const sections = [...document.querySelectorAll('.panel')];

  /** Build glowing neural particles with varied timing. */
  function createParticles(count = 54) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDuration = `${8 + Math.random() * 18}s`;
      p.style.animationDelay = `${-Math.random() * 16}s`;
      p.style.opacity = `${0.25 + Math.random() * 0.65}`;
      frag.appendChild(p);
    }
    particleField.appendChild(frag);
  }

  /** Progressive section reveal for storytelling pacing. */
  function bindRevealObserver() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(24px)';
      section.style.transition = 'opacity 700ms ease, transform 700ms ease';
      observer.observe(section);
    });
  }

  /** Dedicated click-scroll actions for key CTA buttons. */
  function bindScrollButtons() {
    document.querySelectorAll('[data-scroll]').forEach(button => {
      button.addEventListener('click', () => {
        const target = document.querySelector(button.dataset.scroll);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /** Apply section-visible state class from JS transition staging. */
  function bindVisibleClassUpdater() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `.panel.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(styleEl);
  }

  createParticles();
  bindVisibleClassUpdater();
  bindRevealObserver();
  bindScrollButtons();
})();
