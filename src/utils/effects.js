// 🎨 Visual effects for Hot Tub Talk
// Making our hot tub extra fancy! ✨

export class StarField {
    constructor(canvas) {
        this.canvas = canvas;
        if (canvas) {
            this.ctx = canvas.getContext('2d');
        }
        this.stars = [];
        this.initStars();
    }

    initStars() {
        const numStars = 50;
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 2 + 1,
                twinkleSpeed: Math.random() * 2 + 1
            });
        }
    }

    update(time) {
        if (!this.ctx || !this.canvas) return;  // Guard clause
        
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        this.stars.forEach(star => {
            const opacity = (Math.sin(time * 0.001 * star.twinkleSpeed) + 1) / 2;
            this.ctx.globalAlpha = opacity;
            this.ctx.beginPath();
            this.ctx.arc(
                star.x * this.canvas.width,
                star.y * this.canvas.height,
                star.size,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
        
        this.ctx.restore();
    }
}

export class SteamEffect {
    constructor() {
        this.particles = [];
        this.intensity = 0;
    }

    update(deltaTime) {
        if (this.intensity <= 0) return;

        // Add new particles
        if (Math.random() < this.intensity) {
            this.particles.push({
                x: Math.random(),
                y: 1,
                size: Math.random() * 20 + 10,
                speed: (Math.random() * 0.2 + 0.1) * this.intensity,
                life: 1
            });
        }

        // Update existing particles
        this.particles = this.particles.filter(p => {
            p.y -= p.speed * deltaTime * 0.01;
            p.life -= 0.01;
            return p.life > 0;
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        
        this.particles.forEach(p => {
            ctx.globalAlpha = p.life * this.intensity;
            ctx.beginPath();
            ctx.arc(
                p.x * ctx.canvas.width,
                p.y * ctx.canvas.height,
                p.size,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });
        
        ctx.restore();
    }
}

export class JetSystem {
    constructor() {
        this.jets = [];
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.followJet = null;
        this.intensity = 0.999;  // Default intensity
    }

    setIntensity(value) {
        this.intensity = value;
    }

    addJet(x, y, angle, follow = false) {
        const jet = {
            x, y, angle,
            active: true,
            follow
        };
        if (follow) {
            this.followJet = jet;
        }
        this.jets.push(jet);
    }

    updateMousePosition(x, y) {
        this.mouseX = x;
        this.mouseY = y;
        
        if (this.followJet) {
            // Calculate angle from jet to mouse
            const dx = this.mouseX - this.followJet.x;
            const dy = this.mouseY - this.followJet.y;
            this.followJet.angle = Math.atan2(dy, dx);
        }
    }

    update(deltaTime) {
        // Update existing particles
        this.particles = this.particles.filter(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.life -= 0.02;
            return p.life > 0;
        });

        // Add new particles based on intensity
        this.jets.forEach(jet => {
            if (jet.active) {
                // Number of particles scales with intensity
                const particleCount = Math.floor(3 * this.intensity) + 1;
                for (let i = 0; i < particleCount; i++) {
                    const waveOffset = Math.sin(Date.now() * 0.003) * 0.2;
                    this.particles.push({
                        x: jet.x,
                        y: jet.y,
                        speed: (Math.random() * 3 + 4) * this.intensity,
                        angle: jet.angle + waveOffset + (Math.random() - 0.5) * 0.3,
                        life: 1,
                        size: (Math.random() * 4 + 2) * this.intensity
                    });
                }
            }
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(75 , 25, 255, 0.6)';
        
        this.particles.forEach(p => {
            ctx.globalAlpha = p.life * 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y + 20, p.size * 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }
}

export class BubbleSystem {
    constructor() {
        this.bubbles = [];
    }

    spawn(x, y) {
        this.bubbles.push({
            x, y,
            size: Math.random() * 8 + 4,
            speed: Math.random() * 2 + 1,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 2 + 1 ,
            life: 1
        });
        console.log(this.intensity);
    }
    
    update(deltaTime) {
        this.bubbles = this.bubbles.filter(bubble => {
            bubble.y -= bubble.speed * deltaTime * 0.05;
            bubble.x += Math.sin(bubble.wobble) * 0.5;
            bubble.wobble += bubble.wobbleSpeed * deltaTime * 0.01;
            bubble.life -= 0.01;
            return bubble.life > 0;
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        
        this.bubbles.forEach(bubble => {
            ctx.globalAlpha = bubble.life;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        ctx.restore();
    }
} 