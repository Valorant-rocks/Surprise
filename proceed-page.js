// Simple heart particle background (same vibe as other pages)
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const hearts = [];
const MAX_HEARTS = 50;

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
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.96;
        this.speedY *= 0.96;
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
        return this.life <= 0 ||
               this.x < -50 || this.x > canvas.width + 50 ||
               this.y < -50 || this.y > canvas.height + 50;
    }
}

function spawnHeart() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    if (hearts.length < MAX_HEARTS) {
        hearts.push(new Heart(x, y));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (hearts.length < MAX_HEARTS) {
        spawnHeart();
    }
    for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].update();
        hearts[i].draw();
        if (hearts[i].isDead()) {
            hearts.splice(i, 1);
        }
    }
    requestAnimationFrame(animate);
}
animate();

// Letter button -> open magical popup letter
const letterBtn = document.getElementById('letterBtn');
const letterPopup = document.getElementById('letterPopup');
const letterClose = document.getElementById('letterClose');
const letterScroll = document.getElementById('letterScroll');
const letterMusic = document.getElementById('letterMusic');

function openLetter() {
    if (!letterPopup) return;
    letterPopup.classList.add('visible');
    letterPopup.setAttribute('aria-hidden', 'false');

    if (letterMusic) {
        try {
            letterMusic.currentTime = 0;
            letterMusic.play().catch(() => {});
        } catch (e) {
            // ignore autoplay errors
        }
    }
}

function closeLetter() {
    if (!letterPopup) return;
    letterPopup.classList.remove('visible');
    letterPopup.setAttribute('aria-hidden', 'true');
    if (letterMusic) {
        try {
            letterMusic.pause();
        } catch (e) {
            // ignore
        }
    }
}

if (letterBtn) {
    letterBtn.addEventListener('click', openLetter);
}
if (letterClose) {
    letterClose.addEventListener('click', closeLetter);
}
if (letterPopup) {
    letterPopup.addEventListener('click', (e) => {
        if (e.target === letterPopup) {
            closeLetter();
        }
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLetter();
    }
});

