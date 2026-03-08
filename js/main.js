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

    // -------------------------
    // COTIZACIÓN INTERACTIVA
    // -------------------------
    const qProduct = document.getElementById('quote-product');
    const qTechniqueRadios = Array.from(document.querySelectorAll('.quote-technique'));
    const qSizesWrap = document.getElementById('quote-sizes');
    const qSizeRadios = () => Array.from(document.querySelectorAll('input[name=\"quote-size\"]'));
    const qQty = document.getElementById('quote-quantity');
    const qDesignType = document.getElementById('quote-design-type');
    const qDesignCode = document.getElementById('quote-design-code');
    const qDesignCodeWrap = document.getElementById('design-code-wrap');
    const qSummary = document.getElementById('quote-summary');
    const qWhats = document.getElementById('quote-whatsapp');

    function getTechnique() {
        const r = qTechniqueRadios.find(x => x.checked);
        return r ? r.value : 'DTF';
    }
    function getSize(product) {
        if (!product || product === 'Taza' || product === 'Gorra') {
            return 'Única';
        }
        const r = qSizeRadios().find(x => x.checked);
        return r ? r.value : 'M';
    }
    function autoSelectTechnique(product) {
        // Opcional: preseleccionar técnica según producto
        let desired = 'DTF';
        if (product === 'Taza') desired = 'Sublimación';
        if (product === 'Camiseta' || product === 'Gorra') desired = 'DTF';
        const t = qTechniqueRadios.find(x => x.value === desired);
        if (t) t.checked = true;
    }
    function updateSizesVisibility(product) {
        if (!qSizesWrap) return;
        if (product === 'Taza' || product === 'Gorra') {
            qSizesWrap.style.display = 'none';
        } else {
            qSizesWrap.style.display = '';
        }
    }
    function buildQuoteMessage(product, technique, size, qty, designType, code) {
        if (designType === 'personalizado') {
            return [
                'Hola TintaFina Studio, me interesa una cotización para un diseño personalizado. Detalles:',
                '- Producto: ' + product,
                '- Técnica: ' + technique,
                '- Talla: ' + size,
                '- Cantidad: ' + qty,
                '- Diseño: PERSONALIZADO',
                'Espero sus instrucciones para enviar mi archivo de diseño. Gracias.'
            ].join('\n');
        }
        const codeLabel = code && code.trim() ? code.trim().toUpperCase() : 'TF-000';
        return [
            'Hola TintaFina Studio, me interesa una cotización. Aquí están los detalles:',
            '- Producto: ' + product,
            '- Técnica: ' + technique,
            '- Talla: ' + size,
            '- Cantidad: ' + qty,
            '- Diseño: Catálogo ' + codeLabel,
            'Gracias, espero su respuesta.'
        ].join('\n');
    }
    function updateQuote() {
        if (!qSummary || !qWhats) return;
        const product = qProduct ? qProduct.value : 'Camiseta';
        const technique = getTechnique();
        updateSizesVisibility(product);
        const size = getSize(product);
        const qtyVal = qQty && qQty.value ? qQty.value : '1';
        const dType = qDesignType ? qDesignType.value : 'catalogo';
        const code = qDesignCode ? qDesignCode.value : '';

        if (qDesignCodeWrap) {
            qDesignCodeWrap.style.display = dType === 'catalogo' ? '' : 'none';
        }

        qSummary.textContent = 'Producto: ' + product + ' | Técnica: ' + technique + ' | Talla: ' + size + ' | Cantidad: ' + qtyVal + (dType === 'catalogo' ? (' | Diseño: ' + (code || 'TF-000')) : ' | Diseño: PERSONALIZADO');
        const msg = buildQuoteMessage(product, technique, size, qtyVal, dType, code);
        qWhats.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg));
        qWhats.setAttribute('target', '_blank');
        qWhats.setAttribute('rel', 'noopener');
    }
    if (qProduct || qTechniqueRadios.length || qQty || qDesignType || qDesignCode || qSummary || qWhats) {
        if (qProduct) {
            qProduct.addEventListener('change', () => {
                autoSelectTechnique(qProduct.value);
                updateQuote();
            });
        }
        qTechniqueRadios.forEach(r => r.addEventListener('change', updateQuote));
        if (qSizesWrap) {
            qSizesWrap.addEventListener('change', updateQuote);
        }
        if (qQty) qQty.addEventListener('input', updateQuote);
        if (qDesignType) qDesignType.addEventListener('change', updateQuote);
        if (qDesignCode) qDesignCode.addEventListener('input', updateQuote);
        // Inicial
        if (qProduct) autoSelectTechnique(qProduct.value);
        updateQuote();
    }
});
