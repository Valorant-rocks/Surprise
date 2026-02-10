// 🥺 emojis that follow cursor smoothly (like hearts on main page)
const emojiContainer = document.getElementById('emojiLayer');
const emojis = [];
const maxEmojis = 35;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create new emoji particles near cursor
    if (emojis.length < maxEmojis) {
        for (let i = 0; i < 2; i++) {
            emojis.push(new Emoji(mouseX + (Math.random() - 0.5) * 60, mouseY + (Math.random() - 0.5) * 60));
        }
    }
});

// Emoji class
class Emoji {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 18 + 20;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.opacity = Math.random() * 0.4 + 0.6;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.008;
        
        // Create DOM element
        this.element = document.createElement('div');
        this.element.className = 'emoji-follow';
        this.element.textContent = '🥺';
        this.element.style.fontSize = this.size + 'px';
        this.element.style.opacity = this.opacity;
        this.element.style.transform = `translate(${x}px, ${y}px) rotate(${this.rotation}deg)`;
        emojiContainer.appendChild(this.element);
    }
    
    update() {
        // Move towards cursor with some randomness
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.speedX += (dx / distance) * 0.08;
            this.speedY += (dy / distance) * 0.08;
        }
        
        // Apply speed with damping
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.96;
        this.speedY *= 0.96;
        
        // Update rotation
        this.rotation += this.rotationSpeed;
        
        // Fade out
        this.life -= this.decay;
        this.opacity = this.life;
        
        // Update DOM element
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
        this.element.style.opacity = this.opacity;
    }
    
    isDead() {
        return this.life <= 0 || this.x < -100 || this.x > window.innerWidth + 100 || 
               this.y < -100 || this.y > window.innerHeight + 100;
    }
    
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Smooth falling emojis in background
const emoji = '🥺';
const fallCount = 15;
const durationMin = 3;
const durationMax = 5;

function createFallingEmoji() {
    const el = document.createElement('div');
    el.className = 'emoji-fall';
    el.textContent = emoji;
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDuration = (Math.random() * (durationMax - durationMin) + durationMin) + 's';
    el.style.animationDelay = Math.random() * 0.3 + 's';
    el.style.fontSize = (Math.random() * 1 + 1.5) + 'rem';
    emojiContainer.appendChild(el);

    el.addEventListener('animationend', () => {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
        createFallingEmoji();
    });
}

// Start background falling emojis
for (let i = 0; i < fallCount; i++) {
    setTimeout(() => createFallingEmoji(), i * 400);
}

// Animation loop for cursor-following emojis
function animate() {
    // Update and draw emojis
    for (let i = emojis.length - 1; i >= 0; i--) {
        emojis[i].update();
        
        if (emojis[i].isDead()) {
            emojis[i].remove();
            emojis.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

// Start animation
animate();
