// HotTubTalk.js - A delightful web component for hot-tub style conversations
// Created by Hue & Aye - Making the web a more relaxing place! 🛁

import { StarField, SteamEffect, JetSystem, BubbleSystem } from '../utils/effects.js';

class HotTubTalk extends HTMLElement {
    constructor() {
        super();
        
        // Create shadow DOM
        this.attachShadow({ mode: 'open' });
        
        // Initialize properties
        this.options = {
            resolution: 512,
            dropRadius: 15,
            perturbance: 0.2,
            interactive: true,
            crossOrigin: '',
            useHardwareAcceleration: true,
            steamIntensity: 0,
            jetsEnabled: true,
            rippleIntensity: 0.5
        };

        // Initialize effects
        this.effects = {
            stars: new StarField(),
            steam: new SteamEffect(),
            jets: new JetSystem(),
            bubbles: new BubbleSystem()
        };

        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.animate = this.animate.bind(this);
        this.render = this.render.bind(this);
        
        // Initial render
        this.render();
    }

    // Public API
    configure(options = {}) {
        console.log('Configuring with options:', options);
        this.options = { ...this.options, ...options };
        
        // Update effects based on new options
        if ('steamIntensity' in options) {
            this.effects.steam.intensity = options.steamIntensity;
        }
        
        if ('jetsEnabled' in options) {
            this.effects.jets.jets.forEach(jet => {
                jet.active = options.jetsEnabled;
            });
        }
    }

    connectedCallback() {
        // Set up canvas
        this.canvas = this.shadowRoot.querySelector('canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.effects.stars = new StarField(this.canvas);
            
            // Add default jets
            const { width, height } = this.canvas.getBoundingClientRect();
            this.effects.jets.addJet(width * 0.2, height * 0.8, Math.PI / 4);
            this.effects.jets.addJet(width * 0.8, height * 0.8, Math.PI * 3 / 4);
            
            // Start animation
            this.handleResize();
            requestAnimationFrame(this.animate);
        }

        // Add event listeners
        this.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('resize', this.handleResize);
    }

    disconnectedCallback() {
        this.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('resize', this.handleResize);
    }

    handleMouseMove(e) {
        if (!this.canvas || !this.ctx) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Add ripple effect
        if (this.options.rippleIntensity > 0) {
            this.effects.bubbles.spawn(x, y);
        }
    }

    handleResize() {
        if (!this.canvas) return;
        
        const rect = this.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    animate(time) {
        if (!this.isConnected || !this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw effects
        const deltaTime = time - (this.lastTime || time);
        this.lastTime = time;

        if (this.effects.stars && this.classList.contains('starry')) {
            this.effects.stars.update(time);
        }

        if (this.effects.steam.intensity > 0) {
            this.effects.steam.update(deltaTime);
            this.effects.steam.draw(this.ctx);
        }

        if (this.options.jetsEnabled) {
            this.effects.jets.update(deltaTime);
        }

        this.effects.bubbles.update(deltaTime);
        this.effects.bubbles.draw(this.ctx);

        requestAnimationFrame(this.animate);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    background: var(--hot-tub-talk-background, rgba(30, 136, 229, 0.15));
                    border-radius: var(--hot-tub-talk-border-radius, 12px);
                    padding: 20px;
                    color: var(--hot-tub-talk-text-color, white);
                    min-height: 100px;
                    overflow: hidden;
                }
                .content {
                    position: relative;
                    z-index: 1;
                }
                canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
                :host(.night-mode) {
                    background: rgba(26, 35, 126, 0.9);
                }
                :host(.steamy)::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 50%;
                    background: linear-gradient(
                        to bottom,
                        rgba(255,255,255,0.2),
                        transparent
                    );
                    pointer-events: none;
                    opacity: ${this.options.steamIntensity};
                }
            </style>
            <canvas></canvas>
            <div class="content">
                <slot></slot>
            </div>
        `;
    }
}

// Register the custom element
customElements.define('hot-tub-talk', HotTubTalk);

export { HotTubTalk }; 