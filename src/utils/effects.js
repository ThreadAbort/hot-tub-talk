// 🎨 Visual effects for Hot Tub Talk
// Making our hot tub extra fancy! ✨

export class StarField {
    constructor(canvas) {
        this.canvas = canvas;
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
    }

    addJet(x, y, angle) {
        this.jets.push({
            x, y, angle,
            active: true,
            particles: []
        });
    }

    update(deltaTime) {
        // Update existing particles
        this.particles = this.particles.filter(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.life -= 0.02;
            return p.life > 0;
        });

        // Add new particles from active jets
        this.jets.forEach(jet => {
            if (jet.active) {
                // Add multiple particles per frame for more volume
                for (let i = 0; i < 3; i++) {
                    // Add some wave motion to the jets
                    const waveOffset = Math.sin(Date.now() * 0.003) * 0.2;
                    this.particles.push({
                        x: jet.x,
                        y: jet.y,
                        speed: Math.random() * 3 + 4, // Faster particles
                        angle: jet.angle + waveOffset + (Math.random() - 0.5) * 0.3,
                        life: 1,
                        size: Math.random() * 4 + 2  // Slightly bigger particles
                    });
                }
            }
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        
        this.particles.forEach(p => {
            ctx.globalAlpha = p.life * 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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
            wobbleSpeed: Math.random() * 2 + 1,
            life: 1
        });
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