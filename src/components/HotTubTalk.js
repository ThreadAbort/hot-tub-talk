// HotTubTalk.js - A delightful web component for hot-tub style conversations
// Created by Hue & Aye - Making the web a more relaxing place! 🛁

import { StarField, SteamEffect, JetSystem, BubbleSystem } from '../utils/effects.js';

// Add at the top of the file
let globalStarField = null;

class HotTubTalk extends HTMLElement {
    static {
        // Create a single StarField instance for all components
        globalStarField = new StarField();
    }
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
            
            // Add multiple jets for better effect
            const { width, height } = this.getBoundingClientRect();
            this.effects.jets.addJet(width * 0.2, height * 0.9, -Math.PI / 4);
            this.effects.jets.addJet(width * 0.4, height * 0.9, -Math.PI / 3);
            this.effects.jets.addJet(width * 0.6, height * 0.9, -Math.PI * 2/3);
            this.effects.jets.addJet(width * 0.8, height * 0.9, -Math.PI * 3/4);
            
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

        // Update jets
        if (this.options.jetsEnabled || this.classList.contains('jets-active')) {
            this.effects.jets.update(deltaTime);
            this.effects.jets.draw(this.ctx);
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
                    text-shadow: 
                        0 0 5px rgba(0,0,0,0.8),
                        0 0 10px rgba(0,0,0,0.5),
                        2px 2px 2px rgba(0,0,0,0.4);
                    animation: bubblyText 3s ease-in-out infinite;
                }
                canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
                @keyframes bubblyText {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-2px) rotate(0.5deg);
                    }
                    25%, 75% {
                        transform: translateY(1px) rotate(-0.3deg);
                    }
                }
                /* Make text more readable when jets are active */
                :host(.jets-active) .content {
                    font-weight: 500;
                    animation: jetText 2s ease-in-out infinite;
                }
                @keyframes jetText {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    25% {
                        transform: translateY(-1px) rotate(0.3deg);
                    }
                    50% {
                        transform: translateY(-2px);
                    }
                    75% {
                        transform: translateY(-1px) rotate(-0.3deg);
                    }
                }
                /* Add a subtle glow effect to text */
                ::slotted(*) {
                    text-shadow: 
                        0 0 10px rgba(255,255,255,0.3),
                        0 0 20px rgba(255,255,255,0.2),
                        0 0 30px rgba(30,136,229,0.2);
                }

                /* Split words for animation */
                .word {
                    display: inline-block;
                    animation: bubblyText 3s ease-in-out infinite;
                    animation-delay: var(--delay, 0s);
                }

                /* Control panel for each hot tub */
                .controls {
                    position: absolute;
                    right: -60px;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 8px;
                    border-radius: 10px;
                    backdrop-filter: blur(5px);
                }

                .control-knob {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #444, #222);
                    border: 2px solid #666;
                    cursor: pointer;
                    position: relative;
                    transition: transform 0.3s;
                }

                .control-knob:hover {
                    transform: scale(1.1);
                }

                .control-knob[data-active="true"] {
                    border-color: #64b5f6;
                    box-shadow: 0 0 10px rgba(100, 181, 246, 0.5);
                }

                .control-knob::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 2px;
                    height: 15px;
                    background: #64b5f6;
                    transform: translate(-50%, -50%);
                    transform-origin: bottom;
                }

                .control-label {
                    font-size: 10px;
                    color: #fff;
                    text-align: center;
                    margin-top: 2px;
                }
            </style>
            <canvas></canvas>
            <div class="content">
                <slot></slot>
            </div>
            <div class="controls">
                <div>
                    <div class="control-knob" data-control="text-wave" data-active="true" title="Toggle Text Wave">
                        <div class="control-label">Wave</div>
                    </div>
                </div>
                <div>
                    <div class="control-knob" data-control="stars" data-active="true" title="Toggle Stars">
                        <div class="control-label">Stars</div>
                    </div>
                </div>
                <div>
                    <div class="control-knob" data-control="jets" data-active="true" title="Toggle Jets">
                        <div class="control-label">Jets</div>
                    </div>
                </div>
            </div>
        `;

        // Split text into words for animation
        const slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', () => {
            const nodes = slot.assignedNodes();
            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const wrapper = document.createElement('span');
                    const words = node.textContent.split(/\s+/);
                    wrapper.innerHTML = words.map((word, i) => 
                        `<span class="word" style="--delay: ${i * 0.1}s">${word}</span>`
                    ).join(' ');
                    node.parentNode.replaceChild(wrapper, node);
                }
            });
        });

        // Add control knob listeners
        const controls = this.shadowRoot.querySelectorAll('.control-knob');
        controls.forEach(knob => {
            knob.addEventListener('click', () => {
                const active = knob.dataset.active === 'true';
                knob.dataset.active = !active;
                const control = knob.dataset.control;
                
                switch(control) {
                    case 'text-wave':
                        this.shadowRoot.querySelectorAll('.word').forEach(word => {
                            word.style.animation = active ? 'none' : '';
                        });
                        break;
                    case 'stars':
                        this.classList.toggle('starry');
                        break;
                    case 'jets':
                        this.classList.toggle('jets-active');
                        break;
                }
            });
        });
    }
}

// Register the custom element
customElements.define('hot-tub-talk', HotTubTalk);

export { HotTubTalk }; 