(function() {
  if (window.ProjectorAnimatedBackground) return;

  const STYLE_ID = 'projector-animated-background-style';
  const ROOT_ID = 'projectorAnimatedBackgroundRoot';

  function injectStyles() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = `
      #${ROOT_ID} {
        position: fixed;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
        background: #000000;
      }
      #${ROOT_ID}.is-hidden { display: none; }

      #${ROOT_ID} .grain {
        position: absolute;
        inset: 0;
        opacity: 0.035;
        pointer-events: none;
        z-index: 100;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: 256px 256px;
      }
      #${ROOT_ID} .vignette {
        display: none;
      }
      #${ROOT_ID} .ember {
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #ff8c42;
        box-shadow: 0 0 8px 3px rgba(255, 140, 66, 0.7), 0 0 16px 6px rgba(255, 80, 30, 0.4);
        opacity: 0;
        animation: pab-ember-rise linear infinite;
      }
      #${ROOT_ID} .knife-throw {
        position: absolute;
        opacity: 0;
        z-index: 10;
        filter: drop-shadow(0 0 12px rgba(255, 140, 60, 0.4));
      }
      #${ROOT_ID} .knife-throw.ltr {
        animation: pab-fly-ltr linear infinite;
      }
      #${ROOT_ID} .knife-throw.rtl {
        animation: pab-fly-rtl linear infinite;
      }
      #${ROOT_ID} .knife-throw.diag {
        animation: pab-fly-diag linear infinite;
      }
      #${ROOT_ID} .knife-spin {
        display: inline-block;
        animation: pab-spin linear infinite;
      }
      #${ROOT_ID} .target-ring {
        position: absolute;
        border-radius: 50%;
        border: 1px solid rgba(200, 80, 40, 0.15);
        animation: pab-target-pulse ease-in-out infinite;
        opacity: 0;
      }
      #${ROOT_ID} .scratch {
        position: absolute;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(180, 160, 140, 0.1), transparent);
        transform-origin: center;
        animation: pab-scratch-flash ease-in-out infinite;
        opacity: 0;
      }
      #${ROOT_ID} .wood-line {
        position: absolute;
        height: 1px;
        background: linear-gradient(90deg, transparent 0%, rgba(90, 60, 30, 0.06) 20%, rgba(90, 60, 30, 0.04) 80%, transparent 100%);
        animation: pab-wood-shift linear infinite;
      }
      #${ROOT_ID} .crosshair {
        position: absolute;
        opacity: 0.06;
        animation: pab-crosshair-rotate linear infinite;
      }
      #${ROOT_ID} .shimmer {
        position: absolute;
        width: 200px;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(200, 200, 220, 0.08), rgba(255, 255, 255, 0.12), rgba(200, 200, 220, 0.08), transparent);
        animation: pab-shimmer-slide linear infinite;
        opacity: 0;
      }
      #${ROOT_ID} .impact {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba(255, 200, 100, 0.8);
        box-shadow: 0 0 20px 8px rgba(255, 150, 50, 0.3), 0 0 40px 16px rgba(255, 100, 30, 0.1);
        opacity: 0;
        animation: pab-impact-flash ease-out infinite;
      }
      #${ROOT_ID} .center-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        height: 500px;
        border-radius: 50%;
        background: none;
        animation: pab-center-breathe ease-in-out infinite 4s;
      }
      #${ROOT_ID} .dust {
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: rgba(180, 160, 140, 0.3);
        animation: pab-dust-wander linear infinite;
        opacity: 0;
      }

      @keyframes pab-ember-rise {
        0% { opacity: 0; transform: translateY(0) translateX(0) scale(1); }
        10% { opacity: 1; }
        70% { opacity: 0.7; }
        100% { opacity: 0; transform: translateY(-100vh) translateX(var(--drift)) scale(0.3); }
      }
      @keyframes pab-fly-ltr {
        0%   { opacity: 0; left: -200px; }
        3%   { opacity: var(--k-op, 0.5); }
        47%  { opacity: var(--k-op, 0.5); }
        52%  { opacity: 0; }
        100% { opacity: 0; left: calc(100vw + 200px); }
      }
      @keyframes pab-fly-rtl {
        0%   { opacity: 0; right: -200px; }
        3%   { opacity: var(--k-op, 0.5); }
        47%  { opacity: var(--k-op, 0.5); }
        52%  { opacity: 0; }
        100% { opacity: 0; right: calc(100vw + 200px); }
      }
      @keyframes pab-fly-diag {
        0%   { opacity: 0; left: -200px; top: var(--sy); }
        3%   { opacity: var(--k-op, 0.45); }
        47%  { opacity: var(--k-op, 0.45); }
        52%  { opacity: 0; }
        100% { opacity: 0; left: calc(100vw + 200px); top: var(--ey); }
      }
      @keyframes pab-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(var(--rot, 1800deg)); }
      }
      @keyframes pab-target-pulse {
        0% { opacity: 0; transform: scale(0.5); }
        30% { opacity: 0.3; }
        70% { opacity: 0.15; }
        100% { opacity: 0; transform: scale(2.5); }
      }
      @keyframes pab-scratch-flash {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
      @keyframes pab-wood-shift {
        0% { transform: translateX(0); }
        100% { transform: translateX(30px); }
      }
      @keyframes pab-crosshair-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pab-shimmer-slide {
        0% { opacity: 0; transform: translateX(-200px) rotate(var(--angle)); }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; transform: translateX(calc(100vw + 200px)) rotate(var(--angle)); }
      }
      @keyframes pab-impact-flash {
        0% { opacity: 0; transform: scale(0); }
        5% { opacity: 1; transform: scale(1); }
        8% { opacity: 0.8; transform: scale(2); }
        15% { opacity: 0; transform: scale(3); }
        100% { opacity: 0; }
      }
      @keyframes pab-center-breathe {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
        50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
      }
      @keyframes pab-dust-wander {
        0% { opacity: 0; transform: translate(0, 0); }
        20% { opacity: 0.4; }
        80% { opacity: 0.2; }
        100% { opacity: 0; transform: translate(var(--wdx), var(--wdy)); }
      }
    `;
  }

  function standardKnifeSVG(size = 80) {
    const h = size * 0.15;
    return `<svg width="${size}" height="${h}" viewBox="0 0 120 18" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,9 58,3.5 61,9 58,14.5" fill="#b0b0b8" opacity="0.85"/>
      <polygon points="0,9 58,3.5 58,9" fill="#d0d0d8" opacity="0.4"/>
      <line x1="2" y1="9" x2="57" y2="4" stroke="rgba(255,255,255,0.28)" stroke-width="0.4"/>
      <rect x="60" y="1.5" width="2.5" height="15" rx="0.8" fill="#888" opacity="0.75"/>
      <rect x="62.5" y="4.5" width="42" height="9" rx="2" fill="#555558" opacity="0.8"/>
      <line x1="69" y1="4.5" x2="69" y2="13.5" stroke="rgba(160,140,120,0.3)" stroke-width="0.8"/>
      <line x1="75" y1="4.5" x2="75" y2="13.5" stroke="rgba(160,140,120,0.3)" stroke-width="0.8"/>
      <line x1="81" y1="4.5" x2="81" y2="13.5" stroke="rgba(160,140,120,0.3)" stroke-width="0.8"/>
      <line x1="87" y1="4.5" x2="87" y2="13.5" stroke="rgba(160,140,120,0.3)" stroke-width="0.8"/>
      <line x1="93" y1="4.5" x2="93" y2="13.5" stroke="rgba(160,140,120,0.3)" stroke-width="0.8"/>
      <line x1="99" y1="4.5" x2="99" y2="13.5" stroke="rgba(160,140,120,0.3)" stroke-width="0.8"/>
      <rect x="104.5" y="3.5" width="11" height="11" rx="3.5" fill="#2e2e32" opacity="0.7"/>
    </svg>`;
  }

  function bowieKnifeSVG(size = 90) {
    const h = size * 0.22;
    return `<svg width="${size}" height="${h}" viewBox="0 0 130 28" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,14 55,5 60,5 64,11 64,19 55,24" fill="#a0a0aa" opacity="0.8"/>
      <polygon points="0,14 55,5 40,8" fill="#c0c0ca" opacity="0.3"/>
      <path d="M 0,14 Q 8,8 25,6 L 55,5" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="0.5"/>
      <line x1="14" y1="12" x2="50" y2="8" stroke="rgba(80,80,90,0.45)" stroke-width="1.4"/>
      <line x1="14" y1="12.8" x2="50" y2="8.8" stroke="rgba(200,200,210,0.1)" stroke-width="0.4"/>
      <path d="M 2,14 Q 30,26 55,24" fill="none" stroke="rgba(200,200,210,0.08)" stroke-width="0.5"/>
      <rect x="63" y="2" width="4" height="24" rx="1.2" fill="#b09838" opacity="0.7"/>
      <rect x="63.8" y="2.8" width="2.4" height="22.4" rx="0.8" fill="#d0b848" opacity="0.25"/>
      <rect x="67" y="7" width="44" height="14" rx="3.5" fill="#6a4830" opacity="0.8"/>
      <line x1="73" y1="7" x2="73" y2="21" stroke="rgba(80,50,25,0.35)" stroke-width="0.9"/>
      <line x1="79" y1="7" x2="79" y2="21" stroke="rgba(80,50,25,0.35)" stroke-width="0.9"/>
      <line x1="85" y1="7" x2="85" y2="21" stroke="rgba(80,50,25,0.35)" stroke-width="0.9"/>
      <line x1="91" y1="7" x2="91" y2="21" stroke="rgba(80,50,25,0.35)" stroke-width="0.9"/>
      <line x1="97" y1="7" x2="97" y2="21" stroke="rgba(80,50,25,0.35)" stroke-width="0.9"/>
      <line x1="103" y1="7" x2="103" y2="21" stroke="rgba(80,50,25,0.35)" stroke-width="0.9"/>
      <rect x="111" y="6" width="13" height="16" rx="5.5" fill="#3a2818" opacity="0.7"/>
      <rect x="113.5" y="12" width="8" height="4" rx="2" fill="#8a7530" opacity="0.25"/>
    </svg>`;
  }

  function diamondKnifeSVG(size = 85) {
    const h = size * 0.19;
    return `<svg width="${size}" height="${h}" viewBox="0 0 125 24" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,12 28,2 56,8 56,16 28,22" fill="#b0b0b8" opacity="0.82"/>
      <polygon points="0,12 28,2 56,8 28,12" fill="#d0d0d8" opacity="0.32"/>
      <line x1="3" y1="12" x2="55" y2="12" stroke="rgba(255,255,255,0.1)" stroke-width="0.6"/>
      <line x1="1" y1="12" x2="28" y2="2.5" stroke="rgba(255,255,255,0.16)" stroke-width="0.4"/>
      <line x1="1" y1="12" x2="28" y2="21.5" stroke="rgba(255,255,255,0.06)" stroke-width="0.4"/>
      <rect x="55" y="7" width="2" height="10" rx="0.6" fill="#80808a" opacity="0.45"/>
      <rect x="57" y="8" width="52" height="8" rx="2.8" fill="#3a3a42" opacity="0.82"/>
      <line x1="63" y1="8" x2="63" y2="16" stroke="rgba(210,55,55,0.4)" stroke-width="0.8"/>
      <line x1="68" y1="8" x2="68" y2="16" stroke="rgba(210,55,55,0.4)" stroke-width="0.8"/>
      <line x1="73" y1="8" x2="73" y2="16" stroke="rgba(210,55,55,0.4)" stroke-width="0.8"/>
      <line x1="78" y1="8" x2="78" y2="16" stroke="rgba(210,55,55,0.4)" stroke-width="0.8"/>
      <line x1="83" y1="8" x2="83" y2="16" stroke="rgba(210,55,55,0.4)" stroke-width="0.8"/>
      <line x1="88" y1="8" x2="88" y2="16" stroke="rgba(210,55,55,0.4)" stroke-width="0.8"/>
      <line x1="93" y1="8" x2="93" y2="16" stroke="rgba(210,55,55,0.4)" stroke-width="0.8"/>
      <line x1="98" y1="8" x2="98" y2="16" stroke="rgba(210,55,55,0.4)" stroke-width="0.8"/>
      <line x1="103" y1="8" x2="103" y2="16" stroke="rgba(210,55,55,0.4)" stroke-width="0.8"/>
      <rect x="109" y="7.5" width="12" height="9" rx="3.5" fill="#222228" opacity="0.7"/>
      <line x1="115" y1="8" x2="115" y2="16" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
    </svg>`;
  }

  function crosshairSVG(size = 120) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(200,80,40,0.3)" stroke-width="0.5"/>
      <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(200,80,40,0.2)" stroke-width="0.5"/>
      <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(200,80,40,0.25)" stroke-width="0.5"/>
      <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(200,80,40,0.15)" stroke-width="0.5"/>
      <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(200,80,40,0.15)" stroke-width="0.5"/>
    </svg>`;
  }

  function createRoot() {
    let root = document.getElementById(ROOT_ID);
    if (root) return root;

    root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'is-hidden';
    root.style.background = '#000000';
    root.innerHTML = '<div class="center-glow"></div><div class="grain"></div><div class="vignette"></div>';
    document.body.insertBefore(root, document.body.firstChild || null);
    return root;
  }

  function addLayer(root, className, count, factory) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = className;
      factory(el, i);
      root.appendChild(el);
    }
  }

  function populate(root) {
    const knivesSVG = [standardKnifeSVG, bowieKnifeSVG, diamondKnifeSVG];
    const throws = [
      { type: 0, dir: 'ltr', y: 14, dur: 17, delay: 0, op: 0.70, rot: 1440, sz: 80 },
      { type: 0, dir: 'rtl', y: 78, dur: 24, delay: 14, op: 0.55, rot: -1080, sz: 70 },
      { type: 0, dir: 'diag', y: 8, dur: 20, delay: 7, op: 0.60, rot: 1800, sz: 75, ey: 60 },
      { type: 1, dir: 'rtl', y: 32, dur: 19, delay: 4, op: 0.70, rot: -1800, sz: 95 },
      { type: 1, dir: 'ltr', y: 88, dur: 26, delay: 20, op: 0.50, rot: 1440, sz: 85 },
      { type: 1, dir: 'diag', y: 70, dur: 22, delay: 11, op: 0.55, rot: -1080, sz: 90, ey: 25 },
      { type: 2, dir: 'ltr', y: 50, dur: 15, delay: 2, op: 0.75, rot: 2160, sz: 85 },
      { type: 2, dir: 'rtl', y: 22, dur: 21, delay: 16, op: 0.60, rot: -2520, sz: 78 },
      { type: 2, dir: 'diag', y: 5, dur: 18, delay: 9, op: 0.60, rot: 1800, sz: 82, ey: 75 },
      { type: 2, dir: 'ltr', y: 65, dur: 28, delay: 25, op: 0.45, rot: 1440, sz: 70 },
      { type: 1, dir: 'ltr', y: 45, dur: 30, delay: 30, op: 0.42, rot: 1080, sz: 80 },
      { type: 0, dir: 'rtl', y: 55, dur: 23, delay: 18, op: 0.50, rot: -1800, sz: 65 }
    ];

    addLayer(root, 'ember', 25, function(el) {
      el.style.left = Math.random() * 100 + '%';
      el.style.bottom = '-10px';
      el.style.setProperty('--drift', (Math.random() - 0.5) * 200 + 'px');
      el.style.animationDuration = (6 + Math.random() * 10) + 's';
      el.style.animationDelay = Math.random() * 12 + 's';
      el.style.width = (2 + Math.random() * 2) + 'px';
      el.style.height = el.style.width;
      if (Math.random() > 0.6) {
        el.style.background = '#ffaa50';
        el.style.boxShadow = '0 0 8px 3px rgba(255,170,80,0.6), 0 0 18px 6px rgba(255,120,40,0.3)';
      }
    });

    throws.forEach(function(t) {
      const wrapper = document.createElement('div');
      wrapper.className = `knife-throw ${t.dir}`;
      wrapper.style.top = t.y + '%';
      wrapper.style.setProperty('--k-op', t.op);
      wrapper.style.animationDuration = t.dur + 's';
      wrapper.style.animationDelay = t.delay + 's';

      if (t.dir === 'diag') {
        wrapper.style.setProperty('--sy', t.y + '%');
        wrapper.style.setProperty('--ey', (t.ey ?? t.y) + '%');
      }

      const spinner = document.createElement('div');
      spinner.className = 'knife-spin';
      spinner.innerHTML = knivesSVG[t.type](t.sz);
      spinner.style.animationDuration = t.dur + 's';
      spinner.style.setProperty('--rot', t.rot + 'deg');

      wrapper.appendChild(spinner);
      root.appendChild(wrapper);
    });

    addLayer(root, 'target-ring', 5, function(el) {
      const size = 80 + Math.random() * 120;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = (10 + Math.random() * 80) + '%';
      el.style.top = (10 + Math.random() * 80) + '%';
      el.style.animationDuration = (5 + Math.random() * 6) + 's';
      el.style.animationDelay = Math.random() * 10 + 's';
    });

    addLayer(root, 'scratch', 12, function(el) {
      el.style.width = (40 + Math.random() * 120) + 'px';
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.transform = `rotate(${Math.random() * 180}deg)`;
      el.style.animationDuration = (6 + Math.random() * 10) + 's';
      el.style.animationDelay = Math.random() * 15 + 's';
    });

    addLayer(root, 'wood-line', 20, function(el) {
      el.style.width = (200 + Math.random() * 600) + 'px';
      el.style.left = (Math.random() * 100 - 20) + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.transform = `rotate(${-5 + Math.random() * 10}deg)`;
      el.style.animationDuration = (20 + Math.random() * 30) + 's';
    });

    addLayer(root, 'crosshair', 3, function(el) {
      el.innerHTML = crosshairSVG(100 + Math.random() * 80);
      el.style.left = (10 + Math.random() * 80) + '%';
      el.style.top = (10 + Math.random() * 80) + '%';
      el.style.animationDuration = (30 + Math.random() * 40) + 's';
    });

    addLayer(root, 'shimmer', 6, function(el) {
      el.style.top = Math.random() * 100 + '%';
      el.style.setProperty('--angle', (-15 + Math.random() * 30) + 'deg');
      el.style.animationDuration = (10 + Math.random() * 15) + 's';
      el.style.animationDelay = Math.random() * 20 + 's';
    });

    addLayer(root, 'impact', 4, function(el, i) {
      el.style.left = (15 + Math.random() * 70) + '%';
      el.style.top = (15 + Math.random() * 70) + '%';
      el.style.animationDuration = (8 + Math.random() * 12) + 's';
      el.style.animationDelay = (i * 5 + Math.random() * 5) + 's';
    });

    addLayer(root, 'dust', 30, function(el) {
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.setProperty('--wdx', (Math.random() - 0.5) * 150 + 'px');
      el.style.setProperty('--wdy', (Math.random() - 0.5) * 150 + 'px');
      el.style.animationDuration = (8 + Math.random() * 15) + 's';
      el.style.animationDelay = Math.random() * 10 + 's';
      el.style.width = (1 + Math.random() * 2) + 'px';
      el.style.height = el.style.width;
    });
  }

  function init(options) {
    options = options || {};
    const storageKey = options.storageKey || 'projector_animated_background_enabled';
    const defaultEnabled = !!options.defaultEnabled;

    injectStyles();
    const root = createRoot();
    if (!root.dataset.populated) {
      populate(root);
      root.dataset.populated = 'true';
    }

    function readEnabled() {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw === 'true') return true;
        if (raw === 'false') return false;
      } catch (e) {}
      return defaultEnabled;
    }

    function writeEnabled(enabled) {
      try {
        localStorage.setItem(storageKey, enabled ? 'true' : 'false');
      } catch (e) {}
    }

    function apply(enabled) {
      root.classList.toggle('is-hidden', !enabled);
      document.body.classList.toggle('has-animated-background', !!enabled);
    }

    let enabled = readEnabled();
    apply(enabled);

    return {
      isEnabled: function() {
        return enabled;
      },
      setEnabled: function(next) {
        enabled = !!next;
        writeEnabled(enabled);
        apply(enabled);
        return enabled;
      },
      toggle: function() {
        return this.setEnabled(!enabled);
      }
    };
  }

  window.ProjectorAnimatedBackground = { init };
})();
