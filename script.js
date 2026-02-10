// Heart particles that follow cursor
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Heart particles array
const hearts = [];
const maxHearts = 50;
let mouseX = 0;
let mouseY = 0;

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create new heart particles near cursor
    if (hearts.length < maxHearts) {
        for (let i = 0; i < 2; i++) {
            hearts.push(new Heart(mouseX + (Math.random() - 0.5) * 50, mouseY + (Math.random() - 0.5) * 50));
        }
    }
});

// Heart class
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
        // Move towards cursor with some randomness
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.speedX += (dx / distance) * 0.1;
            this.speedY += (dy / distance) * 0.1;
        }
        
        // Apply speed with damping
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.95;
        this.speedY *= 0.95;
        
        // Update rotation
        this.rotation += this.rotationSpeed;
        
        // Fade out
        this.life -= this.decay;
        this.opacity = this.life;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.size / 20, this.size / 20);
        
        // Draw heart shape
        ctx.fillStyle = '#ff6b9d';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0, -10, -10, -15, -10, -5);
        ctx.bezierCurveTo(-10, 5, 0, 10, 0, 10);
        ctx.bezierCurveTo(0, 10, 10, 5, 10, -5);
        ctx.bezierCurveTo(10, -15, 0, -10, 0, 0);
        ctx.fill();
        
        // Add glow effect
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

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw hearts
    for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].update();
        hearts[i].draw();
        
        if (hearts[i].isDead()) {
            hearts.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

// Start animation
animate();

// Button interactions
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

yesBtn.addEventListener('click', () => {
    window.location.href = 'yes-page.html';
});

noBtn.addEventListener('click', () => {
    window.location.href = 'no-page.html';
});

// Add extra hearts on hover
yesBtn.addEventListener('mouseenter', () => {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            hearts.push(new Heart(
                yesBtn.offsetLeft + yesBtn.offsetWidth / 2 + (Math.random() - 0.5) * 100,
                yesBtn.offsetTop + yesBtn.offsetHeight / 2 + (Math.random() - 0.5) * 100
            ));
        }, i * 100);
    }
});
