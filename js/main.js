// Espera a que todo el contenido del HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.setAttribute('aria-controls', 'main-nav');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            mobileNavToggle.classList.toggle('active');
            mobileNavToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
        document.addEventListener('click', (e) => {
            const target = e.target;
            const isInside = mainNav.contains(target) || mobileNavToggle.contains(target);
            if (!isInside && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileNavToggle.classList.remove('active');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileNavToggle.classList.remove('active');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (mobileNavToggle) {
                    mobileNavToggle.classList.remove('active');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    const WHATSAPP_NUMBER = '1234567890';
    document.querySelectorAll('.whatsapp-btn[data-message]').forEach(a => {
        const msg = a.getAttribute('data-message');
        a.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg));
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
    });

    const floating = document.getElementById('floating-whatsapp');
    if (floating) {
        const msg = 'Hola, quiero más información.';
        floating.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg));
        floating.setAttribute('target', '_blank');
        floating.setAttribute('rel', 'noopener');
    }
    const socialWhats = document.getElementById('social-whatsapp');
    if (socialWhats) {
        const msg = 'Hola, quiero más información.';
        socialWhats.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg));
    }

    const qty = document.getElementById('kit-quantity');
    const options = Array.from(document.querySelectorAll('.kit-option'));
    const typeRadios = Array.from(document.querySelectorAll('.kit-type'));
    const summaryEl = document.getElementById('kit-summary');
    const kitLink = document.getElementById('kit-whatsapp');
    function updateKit() {
        const q = qty ? qty.value : null;
        if (!q || !summaryEl || !kitLink) return;
        const type = (typeRadios.find(r => r.checked) || { value: 'Básico' }).value;
        const allowedVideo = q !== '6';
        const selected = options.filter(o => o.checked && (o.value !== 'Invitación en video' ? true : allowedVideo)).map(o => o.value);
        const base = allowedVideo ? selected : selected.filter(v => v !== 'Invitación en video');
        if (!allowedVideo) {
            const videoCheckbox = options.find(o => o.value === 'Invitación en video');
            if (videoCheckbox) videoCheckbox.checked = false;
        }
        const msg = 'Hola, quiero armar un kit ' + type + ' de ' + q + ' tarjetas con: ' + (base.length ? base.join(', ') : 'sin opciones extra') + '. (El precio puede variar según el diseño y la invitación en video agrega costo)';
        summaryEl.textContent = 'Tipo: ' + type + ' | Cantidad: ' + q + ' | Opciones: ' + (base.length ? base.join(', ') : 'Ninguna');
        kitLink.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg));
        kitLink.setAttribute('target', '_blank');
        kitLink.setAttribute('rel', 'noopener');
    }
    if (qty) {
        qty.addEventListener('change', updateKit);
        options.forEach(o => o.addEventListener('change', updateKit));
        typeRadios.forEach(r => r.addEventListener('change', updateKit));
        updateKit();
    }

    const chooserButtons = Array.from(document.querySelectorAll('.choose-kit'));
    const builderEl = document.getElementById('kit-builder');
    chooserButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const t = btn.getAttribute('data-type');
            const radio = typeRadios.find(r => r.value === t);
            if (radio) radio.checked = true;
            updateKit();
            if (builderEl) builderEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const sections = Array.from(document.querySelectorAll('section'));
    const linkMap = {};
    navLinks.forEach(a => { linkMap[a.getAttribute('href')] = a; });
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = '#' + entry.target.id;
            if (entry.isIntersecting && linkMap[id]) {
                navLinks.forEach(l => l.classList.remove('active'));
                linkMap[id].classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0.25 });
    sections.forEach(sec => observer.observe(sec));

    const containers = Array.from(document.querySelectorAll('section .container, .service-card, .step, .portfolio-item, .item-card, .faq-item'));
    containers.forEach(el => el.classList.add('reveal'));
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    containers.forEach(el => revealObserver.observe(el));

    const themeToggle = document.querySelector('.theme-toggle');
    function applyTheme(t) {
        document.body.setAttribute('data-theme', t);
        const imgs = Array.from(document.querySelectorAll('img[data-logo-light][data-logo-dark]'));
        imgs.forEach(i => {
            const src = t === 'dark' ? i.getAttribute('data-logo-dark') : i.getAttribute('data-logo-light');
            if (src) i.setAttribute('src', src);
        });
        if (themeToggle) themeToggle.textContent = t === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('yl-theme', t);
    }
    const saved = localStorage.getItem('yl-theme');
    applyTheme(saved === 'dark' ? 'dark' : 'light');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.body.getAttribute('data-theme');
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});