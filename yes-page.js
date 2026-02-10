// Heart particles that follow cursor (always visible)
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const hearts = [];
const maxHearts = 50;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (hearts.length < maxHearts) {
        for (let i = 0; i < 2; i++) {
            hearts.push(new Heart(mouseX + (Math.random() - 0.5) * 50, mouseY + (Math.random() - 0.5) * 50));
        }
    }
});

class Heart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 10;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }
    update() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            this.speedX += (dx / distance) * 0.1;
            this.speedY += (dy / distance) * 0.1;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.95;
        this.speedY *= 0.95;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
        this.opacity = this.life;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.size / 20, this.size / 20);
        ctx.fillStyle = '#ff6b9d';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0, -10, -10, -15, -10, -5);
        ctx.bezierCurveTo(-10, 5, 0, 10, 0, 10);
        ctx.bezierCurveTo(0, 10, 10, 5, 10, -5);
        ctx.bezierCurveTo(10, -15, 0, -10, 0, 0);
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff6b9d';
        ctx.fill();
        ctx.restore();
    }
    isDead() {
        return this.life <= 0 || this.x < -50 || this.x > canvas.width + 50 ||
               this.y < -50 || this.y > canvas.height + 50;
    }
}

// Falling hearts (behind carousel when carousel is visible)
const fallingHearts = [];
const MAX_FALLING_HEARTS = 25;
let fallingHeartSpawnCounter = 0;

class FallingHeart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 1.5 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.08;
        this.opacity = Math.random() * 0.4 + 0.4;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.size / 20, this.size / 20);
        ctx.fillStyle = '#ff6b9d';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0, -10, -10, -15, -10, -5);
        ctx.bezierCurveTo(-10, 5, 0, 10, 0, 10);
        ctx.bezierCurveTo(0, 10, 10, 5, 10, -5);
        ctx.bezierCurveTo(10, -15, 0, -10, 0, 0);
        ctx.fill();
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff6b9d';
        ctx.fill();
        ctx.restore();
    }
    isOffScreen() {
        return this.y > canvas.height + 50 || this.x < -50 || this.x > canvas.width + 50;
    }
}

function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const carouselVisible = document.getElementById('carouselView')?.classList.contains('visible');
    if (carouselVisible) {
        fallingHeartSpawnCounter++;
        if (fallingHeartSpawnCounter % 8 === 0 && fallingHearts.length < MAX_FALLING_HEARTS) {
            fallingHearts.push(new FallingHeart(
                Math.random() * canvas.width,
                -30
            ));
        }
        for (let i = fallingHearts.length - 1; i >= 0; i--) {
            fallingHearts[i].update();
            fallingHearts[i].draw();
            if (fallingHearts[i].isOffScreen()) fallingHearts.splice(i, 1);
        }
    } else {
        fallingHearts.length = 0;
        fallingHeartSpawnCounter = 0;
    }

    for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].update();
        hearts[i].draw();
        if (hearts[i].isDead()) hearts.splice(i, 1);
    }
    requestAnimationFrame(animateHearts);
}
animateHearts();

// Background music (plays when carousel is shown)
const backgroundMusic = document.getElementById('backgroundMusic');

function startBackgroundMusic() {
    if (!backgroundMusic) return;
    try {
        backgroundMusic.loop = true;
        backgroundMusic.play().catch(function() { /* autoplay blocked */ });
    } catch (e) { /* ignore */ }
}

// Gift click: transition from intro to carousel + start background music
const introView = document.getElementById('introView');
const carouselView = document.getElementById('carouselView');
const giftBtn = document.getElementById('giftBtn');

giftBtn.addEventListener('click', () => {
    introView.classList.add('hidden');
    carouselView.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
        carouselView.classList.add('visible');
    }, 200);
    startBackgroundMusic();
});

// Carousel: assets from assets/her/ (updated to match folder)
const CAROUSEL_ASSETS = [
    { name: 'Agyakari WIFE.jpg', type: 'image' },
    { name: 'Best Part of BNKS FRFR.jpg', type: 'image' },
    { name: 'Everything I could ever want.png', type: 'image' },
    { name: 'Great ASS BTW.png', type: 'image' },
    { name: 'OG moment with OG PFP.png', type: 'image' },
    { name: 'Running with supersonic speed to my heart.png', type: 'image' },
    { name: 'The only thing you have bigger is FOREHEAD.webp', type: 'image' },
    { name: 'This will Forever be My Fav moment.mp4', type: 'video' },
    { name: 'Thulo Manxe Bannu.jpg', type: 'image' },
    { name: 'Why so surprised.jpg', type: 'image' }
];

const PHOTO_DURATION_MS = 5000;
const track = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('carouselDots');
const captionEl = document.getElementById('carouselCaption');
const proceedBtn = document.getElementById('carouselProceed');

let currentIndex = 0;
let photoTimer = null;
let carouselAutoStarted = false;

function assetSrc(name) {
    return 'assets/her/' + encodeURIComponent(name);
}

/** Display name: filename without extension (e.g. "Best Part of BNKS FRFR.jpg" → "Best Part of BNKS FRFR") */
function displayName(name) {
    if (!name) return '';
    const lastDot = name.lastIndexOf('.');
    return lastDot > 0 ? name.slice(0, lastDot) : name;
}

function isVideo(index) {
    return CAROUSEL_ASSETS[index] && CAROUSEL_ASSETS[index].type === 'video';
}

function buildSlides() {
    track.innerHTML = '';
    CAROUSEL_ASSETS.forEach((asset, i) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.dataset.index = i;
        slide.dataset.filename = asset.name;
        const content = document.createElement('div');
        content.className = 'slide-content';
        if (asset.type === 'video') {
            const video = document.createElement('video');
            video.src = assetSrc(asset.name);
            video.preload = 'auto';
            video.playsInline = true;
            video.muted = false;
            video.controls = false;
            video.setAttribute('data-slide-index', i);
            content.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = assetSrc(asset.name);
            img.alt = asset.name;
            img.loading = 'lazy';
            content.appendChild(img);
        }
        slide.appendChild(content);
        track.appendChild(slide);
    });
}

function getAllVideos() {
    return track.querySelectorAll('video');
}

function pauseAllVideos() {
    getAllVideos().forEach(v => {
        v.pause();
        v.currentTime = 0;
    });
}

function goNext() {
    clearTimeout(photoTimer);
    photoTimer = null;
    pauseAllVideos();
    currentIndex = (currentIndex + 1) % CAROUSEL_ASSETS.length;
    updateCarousel();
    startAutoForCurrentSlide();
}

function startAutoForCurrentSlide() {
    if (!carouselView.classList.contains('visible')) return;
    const slide = track.querySelector(`.carousel-slide[data-index="${currentIndex}"]`);
    if (!slide) return;
    if (isVideo(currentIndex)) {
        const video = slide.querySelector('video');
        if (video) {
            video.currentTime = 0;
            video.play().catch(() => {});
            video.onended = goNext;
        }
    } else {
        photoTimer = setTimeout(goNext, PHOTO_DURATION_MS);
    }
}

function updateCarousel() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
    const name = CAROUSEL_ASSETS[currentIndex] ? CAROUSEL_ASSETS[currentIndex].name : '';
    captionEl.textContent = displayName(name);
    const isLastSlide = currentIndex === CAROUSEL_ASSETS.length - 1;
    if (proceedBtn) {
        proceedBtn.classList.toggle('visible', isLastSlide);
        proceedBtn.setAttribute('aria-hidden', !isLastSlide);
    }
}

function buildDots() {
    dotsContainer.innerHTML = '';
    CAROUSEL_ASSETS.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
            clearTimeout(photoTimer);
            photoTimer = null;
            pauseAllVideos();
            currentIndex = i;
            updateCarousel();
            startAutoForCurrentSlide();
        });
        dotsContainer.appendChild(dot);
    });
}

buildSlides();
buildDots();
updateCarousel();

// Start auto-advance when carousel becomes visible (carouselView from gift-click block above)
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && carouselView.classList.contains('visible')) {
            if (!carouselAutoStarted) {
                carouselAutoStarted = true;
                startAutoForCurrentSlide();
            }
        }
    });
});
observer.observe(carouselView, { attributes: true });
