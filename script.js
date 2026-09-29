document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const txt = "WELCOME ITZ FIZZ";
  const hl = document.getElementById('headline');
  const vis = document.getElementById('heroVisual');
  const rdr = document.getElementById('cardReader');
  const led = document.getElementById('readerLed');
  const mBox = document.getElementById('moneyBox');
  let isPaid = false;

  // Split headline text
  function setupText() {
    hl.innerHTML = '';
    txt.split(' ').forEach((w, wIdx, arr) => {
      const wSpan = document.createElement('span');
      wSpan.style.display = 'inline-flex';

      w.split('').forEach((c) => {
        const wrap = document.createElement('span');
        wrap.className = 'letter-wrapper';
        const l = document.createElement('span');
        l.className = 'letter';
        l.textContent = c;
        wrap.appendChild(l);
        wSpan.appendChild(wrap);
      });

      hl.appendChild(wSpan);
      if (wIdx < arr.length - 1) {
        const sp = document.createElement('span');
        sp.className = 'space';
        hl.appendChild(sp);
      }
    });
  }

  setupText();

  // 1. Intro Animation Sequence with GSAP Timeline
  const introTl = gsap.timeline();

  introTl
    .from('.letter', {
      y: '110%',
      opacity: 0,
      duration: 0.8,
      stagger: 0.03,
      ease: 'power3.out'
    })
    .from(vis, {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')
    .from('.stat-card', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
      onComplete: animateCounters
    }, '-=0.4');

  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const isX = el.getAttribute('data-target').includes('x');
      const isPerc = el.textContent.includes('%') || target % 1 !== 0;

      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: function() {
          const v = this.targets()[0].val;
          if (isX) el.textContent = v.toFixed(1) + 'x';
          else if (isPerc) el.textContent = v.toFixed(1) + '%';
          else el.textContent = Math.floor(v) + '%';
        }
      });
    });
  }

  function triggerMoneyBurst() {
    mBox.innerHTML = '';
    const items = ['💵', '💸', '💰', '💲'];

    for (let i = 0; i < 16; i++) {
      const p = document.createElement('span');
      p.className = 'cash-particle';
      p.textContent = items[Math.floor(Math.random() * items.length)];

      const tx = (Math.random() - 0.5) * 360;
      const ty = -120 - Math.random() * 180;
      const rot = (Math.random() - 0.5) * 360;

      p.style.left = `calc(50% + ${(Math.random() - 0.5) * 60}px)`;
      mBox.appendChild(p);

      gsap.fromTo(p, 
        { opacity: 1, x: 0, y: 0, scale: 0.5, rotate: 0 },
        { 
          opacity: 0, x: tx, y: ty, scale: 1.4, rotate: rot, 
          duration: 1.2, ease: 'power2.out', onComplete: () => p.remove() 
        }
      );
    }
  }

  // 2. GSAP ScrollTrigger for Card Drop Mechanics
  gsap.to(vis, {
    y: 135,
    rotateX: 18,
    scale: 0.88,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=180', // 180px scroll distance
      scrub: 0.5,   // Smooth GSAP scrubbing
      onUpdate: (self) => {
        if (self.progress >= 0.8 && !isPaid) {
          isPaid = true;
          led.classList.add('green');
          rdr.classList.add('scanned');
          triggerMoneyBurst();
        } else if (self.progress < 0.4 && isPaid) {
          isPaid = false;
          led.classList.remove('green');
          rdr.classList.remove('scanned');
        }
      }
    }
  });
});