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
            // Initialize twinkle state for star if not exists
            if (!star.nextTwinkle) {
                star.nextTwinkle = time + Math.random() * 4000 + 1000; // Random 1-5 seconds
                star.isTwinkling = false;
                star.twinkleStart = 0;
            }

            // Check if it's time to start twinkling
            if (time >= star.nextTwinkle && !star.isTwinkling) {
                star.isTwinkling = true;
                star.twinkleStart = time;
            }

            // Handle twinkling animation
            let opacity = 1;
            if (star.isTwinkling) {
                const twinkleTime = time - star.twinkleStart;
                if (twinkleTime <= 800) {  // 0.4 seconds twinkle duration 
                    opacity = Math.sin((twinkleTime / 800) * Math.PI) + .6;
                } else {
                    star.isTwinkling = false;
                    star.nextTwinkle = time + Math.random() * 4000 + 1000; // Set next twinkle
                }
            }

            this.ctx.globalAlpha = opacity;
            this.ctx.beginPath();
            this.ctx.arc(
                star.x * this.canvas.width,
                star.y * this.canvas.height,
                star.size * (Math.sin(time * 0.001) * 0.1 + 1) / 3, // Much slower size pulsing
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
        this.intensity = 1;  // Default intensity
        this.wobbleIntensity = 0.5;
        this.wobbleTime = 0;  // Add time tracking for wobble
    }

    setIntensity(value) {
        this.intensity = value;
    }

    setWobble(value) {
        this.wobbleIntensity = value;
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
        // Update wobble time
        this.wobbleTime += deltaTime * 0.001;  // Slower time progression

        // Update existing particles
        this.particles = this.particles.filter(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.life -= 0.001;
            return p.life > 0;
        });

        // Add new particles based on intensity
        this.jets.forEach(jet => {
            if (jet.active) {
                const particleCount = Math.floor(3 * this.intensity) + 1;
                for (let i = 0; i < particleCount; i++) {
                    // More dramatic wobble effect
                    const waveOffset = (
                        Math.sin(this.wobbleTime * 2) * 0.4 + // Slow wave
                        Math.sin(this.wobbleTime * 5) * 0.2   // Fast ripple
                    ) * this.wobbleIntensity;

                    this.particles.push({
                        x: jet.x + Math.sin(this.wobbleTime * 3) * 2 * this.wobbleIntensity, // Add horizontal wobble
                        y: jet.y,
                        speed: (Math.random() * 3 + 4) * this.intensity,
                        angle: jet.angle + waveOffset + (Math.random() - 0.8) * 0.5 * this.wobbleIntensity,
                        life: 0.12 * Math.random(),
                        size: (Math.random() * 4 + 2) * this.intensity,
                        wobblePhase: Math.random() * Math.PI * 2 // Random phase for each particle
                    });
                }
            }
        });

        // Update particle positions with additional wobble
        this.particles.forEach(p => {
            p.x += Math.sin(this.wobbleTime * 4 + p.wobblePhase) * 0.3 * this.wobbleIntensity;
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        
        this.particles.forEach(p => {
            ctx.globalAlpha = p.life * 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y + 15, p.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }
}

export class BubbleSystem {
    constructor() {
        this.bubbles = [];
        this.wobbleIntensity = 0.5;
    }

    setWobble(value) {
        this.wobbleIntensity = value;
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
            // More dramatic wobble for bubbles
            bubble.x += Math.sin(bubble.wobble) * this.wobbleIntensity * 2;  // Doubled the effect
            bubble.wobble += bubble.wobbleSpeed * deltaTime * 0.02 * this.wobbleIntensity;  // Faster wobble
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