
(function () {
    'use strict';

    /* NAV: stato scroll + toggle mobile */
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');

    if (nav) {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                nav.classList.add('is-scrolled');
            } else {
                nav.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('is-open');
        });
        nav.querySelectorAll('.nav__link').forEach((link) => {
            link.addEventListener('click', () => nav.classList.remove('is-open'));
        });
    }

    /* Counter animati nella hero */
    const counters = document.querySelectorAll('[data-count]');
    const animateCount = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const start = performance.now();

        const formatNumber = (n) => {
            if (target >= 1000) return n.toLocaleString('it-IT');
            return String(n);
        };

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = formatNumber(value);
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = formatNumber(target);
            }
        };

        requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window && counters.length) {
        const counterObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        counterObs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );
        counters.forEach((c) => counterObs.observe(c));
    } else {
        counters.forEach(animateCount);
    }

    /* Reveal on scroll */
    const revealTargets = document.querySelectorAll(
        '.tl-item, .info-card, .med-card, .arduino-spec, .future__col, .callout, .quote'
    );
    revealTargets.forEach((el) => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
                        revealObs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
        );
        revealTargets.forEach((el) => revealObs.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add('is-visible'));
    }

    /* Demo Arduino: lampeggio LED */
    const blinkBtn = document.getElementById('blinkToggle');
    const blinkLabel = document.getElementById('blinkLabel');
    const led = document.getElementById('led');
    let blinkInterval = null;
    let blinkOn = false;

    if (blinkBtn && led && blinkLabel) {
        const startBlink = () => {
            blinkInterval = setInterval(() => {
                led.classList.toggle('is-on');
            }, 500);
            blinkLabel.textContent = 'Stop';
            blinkOn = true;
        };

        const stopBlink = () => {
            clearInterval(blinkInterval);
            blinkInterval = null;
            led.classList.remove('is-on');
            blinkLabel.textContent = 'Avvia';
            blinkOn = false;
        };

        blinkBtn.addEventListener('click', () => {
            if (blinkOn) stopBlink();
            else startBlink();
        });
    }

    /* Evidenziazione link nav corrente */
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    if ('IntersectionObserver' in window && sections.length) {
        const sectionObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        navLinks.forEach((link) => {
                            link.style.color = '';
                            if (link.getAttribute('href') === `#${id}`) {
                                link.style.color = 'var(--accent)';
                            }
                        });
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );
        sections.forEach((s) => sectionObs.observe(s));
    }
})();