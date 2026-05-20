/* Phase 3A controller: particles + scroll storytelling + scientific status updates */
(() => {
  const particleField = document.getElementById('particle-field');
  const sections = [...document.querySelectorAll('.panel')];
  const progressSteps = [...document.querySelectorAll('.story-progress li')];
  const metrics = {
    network: document.querySelector('[data-metric="network"]'),
    inflammation: document.querySelector('[data-metric="inflammation"]'),
    synaptic: document.querySelector('[data-metric="synaptic"]')
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const STORY_META = {
    hero: { mood: 'story-healthy', network: 'پایدار', inflammation: 'متعادل', synaptic: 'فعال' },
    'healthy-vs-alz': { mood: 'story-healthy', network: 'پایدار', inflammation: 'متعادل', synaptic: 'فعال' },
    'inside-brain': { mood: 'story-disease', network: 'مختل', inflammation: 'بالا', synaptic: 'ضعیف' },
    amyloid: { mood: 'story-disease', network: 'مختل', inflammation: 'بالا', synaptic: 'ضعیف' },
    tau: { mood: 'story-disease', network: 'مختل', inflammation: 'بالا', synaptic: 'ضعیف' },
    synapse: { mood: 'story-disease', network: 'مختل', inflammation: 'بالا', synaptic: 'ضعیف' },
    'exercise-response': { mood: 'story-recovery', network: 'در حال بازیابی', inflammation: 'کاهش‌یافته', synaptic: 'تقویت‌شده' },
    'muscle-brain': { mood: 'story-recovery', network: 'در حال بازیابی', inflammation: 'کاهش‌یافته', synaptic: 'تقویت‌شده' },
    'final-message': { mood: 'story-recovery', network: 'در حال بازیابی', inflammation: 'کاهش‌یافته', synaptic: 'تقویت‌شده' }
  };

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

  /** Smooth reveal + active state + calming previous chapters. */
  function bindStoryObserver() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible', 'is-active');
            activateStoryStep(entry.target.id);
          } else {
            entry.target.classList.remove('is-active');
          }
        });
        updatePastSections();
      },
      { threshold: 0.45 }
    );

    sections.forEach(section => {
      if (!reduceMotion) {
        section.style.transition = 'opacity 700ms ease, transform 700ms ease';
      }
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

  /** Update progress navigator + body mood class + compact scientific status. */
  function activateStoryStep(activeId) {
    progressSteps.forEach(step => {
      step.classList.toggle('is-active', step.dataset.step === activeId);
    });

    const story = STORY_META[activeId];
    if (!story) return;

    document.body.classList.remove('story-healthy', 'story-disease', 'story-recovery');
    document.body.classList.add(story.mood);
    metrics.network.textContent = story.network;
    metrics.inflammation.textContent = story.inflammation;
    metrics.synaptic.textContent = story.synaptic;
  }

  /** Make completed sections calmer for focus on current chapter. */
  function updatePastSections() {
    const activeIndex = sections.findIndex(section => section.classList.contains('is-active'));
    sections.forEach((section, index) => {
      section.classList.toggle('is-past', activeIndex > -1 && index < activeIndex);
    });
  }

  createParticles();
  bindVisibleClassUpdater();
  bindStoryObserver();
  bindScrollButtons();
  activateStoryStep('hero');
})();
