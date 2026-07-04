// Performance detection for low-end devices
const isLowEndDevice = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true;
    }
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
        return true;
    }
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        return true;
    }
    return false;
};

// AOS - lighter during scroll
const lowEnd = isLowEndDevice();
AOS.init({
    duration: lowEnd ? 250 : 400,
    once: true,
    disable: lowEnd ? true : 'mobile',
    offset: 72,
    throttleDelay: 200,
    debounceDelay: 80,
    anchorPlacement: 'top-bottom',
    startEvent: 'DOMContentLoaded'
});

// Typewriter Effect
var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 80;
    var deleteDelta = 50;

    if (this.isDeleting) {
        delta = deleteDelta;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 300;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};

window.onload = function () {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }

    // Inject CSS for typewriter
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = `
        .typewrite > .wrap { 
            border-right: 0.08em solid #0dcaf0;
            animation: blink 1s infinite;
            padding-right: 2px;
        }
        @keyframes blink {
            0%, 50% { border-color: #0dcaf0; }
            51%, 100% { border-color: transparent; }
        }
        .dark-theme .typewrite > .wrap {
            border-right-color: #0dcaf0;
        }
    `;
    document.body.appendChild(css);
};



// Close mobile menu after clicking a link
(function () {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    let bsCollapse = null;

document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
            if (!navbarCollapse || !navbarCollapse.classList.contains('show')) return;
            if (!bsCollapse) {
                bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            }
            bsCollapse.hide();
        });
    });
})();

// Fast smooth section navigation
(function () {
    const SCROLL_OFFSET = 96;
    let scrollAnimId = null;

    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    if (settings.autoScroll !== false) {
        document.documentElement.classList.add('smooth-scroll');
    }

    function isSmoothScrollEnabled() {
        return document.documentElement.classList.contains('smooth-scroll');
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function scrollToY(targetY, smooth) {
        if (scrollAnimId) {
            cancelAnimationFrame(scrollAnimId);
            scrollAnimId = null;
        }

        const startY = window.scrollY;
        const distance = targetY - startY;
        const useSmooth = smooth
            && isSmoothScrollEnabled()
            && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
            && Math.abs(distance) > 24;

        if (!useSmooth) {
            window.scrollTo(0, targetY);
            return;
        }

        const duration = Math.min(520, Math.max(300, Math.abs(distance) * 0.35));
        const startTime = performance.now();
        document.documentElement.classList.add('is-scrolling');

        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            window.scrollTo(0, startY + distance * easeOutCubic(progress));

            if (progress < 1) {
                scrollAnimId = requestAnimationFrame(step);
                return;
            }

            scrollAnimId = null;
            document.documentElement.classList.remove('is-scrolling');
            if (window.AOS) {
                if (typeof AOS.refreshHard === 'function') AOS.refreshHard();
                else AOS.refresh();
            }
        }

        scrollAnimId = requestAnimationFrame(step);
    }

    function scrollToSection(target) {
        if (!target) return;
        const y = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
        scrollToY(Math.max(0, y), true);
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        scrollToSection(target);
        history.pushState(null, '', href);
    });

    window.siteScrollTo = scrollToY;
})();

// Live Info Section - Weather Icons
function getWeatherIcon(code) {
    const map = {
        0: 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-day-sunny.svg',
        1: 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-day-sunny.svg',
        2: 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-day-cloudy.svg',
        3: 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-cloudy.svg',
        45: 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-fog.svg',
        48: 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-fog.svg',
        51: 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-sprinkle.svg',
        61: 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-rain.svg',
        71: 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-snow.svg',
        80: 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-showers.svg',
        95: 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-thunderstorm.svg'
    };
    return map[code] || '';
}

// Fetch visitor IP and Weather
fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => {
        const ipEl = document.getElementById('visitor-ip');
        if (ipEl) ipEl.textContent = data.ip;

        fetch(`https://ipapi.co/${data.ip}/json/`).then(r => r.json()).then(info => {
            const flagEl = document.getElementById('ip-flag');
            if (flagEl && info.country_code) {
                flagEl.src = `https://flagcdn.com/48x36/${info.country_code.toLowerCase()}.png`;
                flagEl.style.display = 'inline-block';
            }

            if (info.latitude && info.longitude) {
                const lat = info.latitude, lon = info.longitude;
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
                    .then(r => r.json()).then(w => {
                        const weatherEl = document.getElementById('visitor-weather');
                        const iconEl = document.getElementById('weather-icon');
                        if (weatherEl && w.current_weather) {
                            const temp = w.current_weather.temperature;
                            const code = w.current_weather.weathercode;
                            weatherEl.textContent = `${temp}°C`;
                            const cityEl = document.getElementById('visitor-city');
                            if (cityEl && info.city) { cityEl.textContent = info.city; }
                            const iconUrl = getWeatherIcon(code);
                            if (iconEl && iconUrl) {
                                iconEl.src = iconUrl;
                                iconEl.style.display = 'inline-block';
                            }
                        }
                    }).catch(() => {
                        const weatherEl = document.getElementById('visitor-weather');
                        if (weatherEl) weatherEl.textContent = 'Unavailable';
                    });
            }
        });
    }).catch(() => {
        const ipEl = document.getElementById('visitor-ip');
        if (ipEl) ipEl.textContent = 'Unavailable';
    });


// Navbar scroll + back to top — single throttled handler
(function () {
    let ticking = false;
    const navbar = document.querySelector('.navbar');
    const backToTopButton = document.getElementById('backToTop');

    function onScroll() {
        const scrollY = window.scrollY;

        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }

        if (backToTopButton) {
            backToTopButton.classList.toggle('show', scrollY > 300);
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.siteScrollTo) {
                window.siteScrollTo(0, true);
            } else {
                window.scrollTo({ top: 0, behavior: 'auto' });
            }
        });
    }

    onScroll();
})();

// Animated Strings Canvas Effect — optimized for performance
(function () {
    const canvas = document.getElementById('strings-canvas');
    if (!canvas) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isLowEnd = isLowEndDevice();

    function shouldRunCanvas() {
        return !isMobile
            && !isLowEnd
            && !document.body.classList.contains('no-animations');
    }

    if (!shouldRunCanvas()) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    let width, height;
    let particles = [];
    let animationId = null;
    let isVisible = true;
    let isEnabled = true;
    let mouseTicking = false;

    let mouse = { x: null, y: null };
    let isMouseInHero = false;

    const config = {
        particleCount: 22,
        connectionDistance: 130,
        connectionDistanceSq: 130 * 130,
        moveSpeed: 0.4,
        lineOpacity: 0.12,
        mouseConnectionDistance: 160,
        mouseConnectionDistanceSq: 160 * 160
    };

    function getColors() {
        const isDark = document.body.classList.contains('dark-theme');
        return {
            line: isDark ? '150, 220, 255' : '13, 202, 240',
            particle: isDark ? '0, 212, 255' : '13, 202, 240',
            mouseLine: isDark ? '0, 212, 255' : '13, 202, 240'
        };
    }

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.moveSpeed;
            this.vy = (Math.random() - 0.5) * config.moveSpeed;
            this.size = Math.random() * 1.2 + 0.8;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (isMouseInHero && mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < 40000) {
                    const distance = Math.sqrt(distSq);
                    const force = (200 - distance) / 200 * 0.08;
                    this.vx += (dx / distance) * force;
                    this.vy += (dy / distance) * force;
                }
            }

            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 1.5) {
                this.vx = (this.vx / speed) * 1.5;
                this.vy = (this.vy / speed) * 1.5;
            }

            this.vx *= 0.99;
            this.vy *= 0.99;
        }

        draw(colors) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${colors.particle}, 0.5)`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections(colors) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < config.connectionDistanceSq) {
                    const opacity = (1 - Math.sqrt(distSq) / config.connectionDistance) * config.lineOpacity;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${colors.line}, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function drawMouseConnections(colors) {
        if (!isMouseInHero || mouse.x === null || mouse.y === null) return;

        particles.forEach(particle => {
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < config.mouseConnectionDistanceSq) {
                const opacity = (1 - Math.sqrt(distSq) / config.mouseConnectionDistance) * 0.3;
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(particle.x, particle.y);
                ctx.strokeStyle = `rgba(${colors.mouseLine}, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
    }

    function animate() {
        if (!isEnabled || !isVisible) {
            animationId = null;
            return;
        }

        const colors = getColors();
        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.update();
            particle.draw(colors);
        });

        drawConnections(colors);
        drawMouseConnections(colors);

        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (!animationId && isEnabled && isVisible) {
            animate();
        }
    }

    function stopAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        ctx.clearRect(0, 0, width, height);
    }

    function setCanvasEnabled(enabled) {
        isEnabled = enabled;
        canvas.style.display = enabled ? '' : 'none';
        if (enabled) {
            startAnimation();
        } else {
            stopAnimation();
        }
    }

    function handleMouseMove(e) {
        if (mouseTicking) return;
        mouseTicking = true;
        requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
            mouseTicking = false;
        });
    }

        const hero = document.getElementById('hero');
    if (hero) {
        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    startAnimation();
                } else {
                    stopAnimation();
                }
            });
        }, { threshold: 0.05 });

        visibilityObserver.observe(hero);
        hero.addEventListener('mousemove', handleMouseMove, { passive: true });
        hero.addEventListener('mouseenter', () => { isMouseInHero = true; }, { passive: true });
        hero.addEventListener('mouseleave', () => {
            isMouseInHero = false;
            mouse.x = null;
            mouse.y = null;
        }, { passive: true });
    }

    const settingsObserver = new MutationObserver(() => {
        setCanvasEnabled(shouldRunCanvas());
    });
    settingsObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    }, { passive: true });

    resize();
    initParticles();
    startAnimation();
})();

