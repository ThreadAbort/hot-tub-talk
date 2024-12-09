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
            
            // Create StarField with the canvas
            this.effects.stars = new StarField(this.canvas);
            
            // Add multiple jets for better effect
            const { width, height } = this.getBoundingClientRect();
            this.effects.jets.addJet(width * 0.2, height * 0.9, -Math.PI / 4);
            this.effects.jets.addJet(width * 0.4, height * 0.9, -Math.PI / 3);
            this.effects.jets.addJet(width * 0.6, height * 0.9, -Math.PI * 2/3);
            this.effects.jets.addJet(width * 0.8, height * 0.9, -Math.PI * 3/4);
            this.effects.jets.addJet(width * 0.5, height * 0.9, -Math.PI/2, true); // Following jet
            
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
        
        // Update jet direction
        this.effects.jets.updateMousePosition(x, y);
        
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
                    margin-right: 70px; /* Space for controls */
                    color: var(--hot-tub-talk-text-color, white);
                    min-height: 100px;
                }

                /* Control panel */
                .tub-controls {
                    position: absolute;
                    right: -70px;  /* Attach to the right side */
                    top: 0;
                    bottom: 0;
                    width: 60px;
                    background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
                    border-radius: 0 12px 12px 0;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    box-shadow: 
                        2px 0 10px rgba(0,0,0,0.3),
                        inset 1px 0 1px rgba(255,255,255,0.1);
                }

                .control {
                    text-align: center;
                }

                .control-knob {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
                    border: 2px solid #333;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s ease;
                    box-shadow: 
                        0 2px 5px rgba(0,0,0,0.2),
                        inset 0 1px 1px rgba(255,255,255,0.1);
                }

                .control-knob.air-control {
                    background: linear-gradient(145deg, #1e88e5, #1565c0);
                }

                .control-knob:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 15px rgba(100, 181, 246, 0.3);
                }

                .control-knob[data-active="true"] {
                    border-color: #64b5f6;
                    box-shadow: 0 0 15px rgba(100, 181, 246, 0.5);
                }

                .control-knob::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 3px;
                    height: 18px;
                    background: #64b5f6;
                    transform: translate(-50%, -50%);
                    transform-origin: bottom;
                    transition: transform 0.3s ease;
                }

                .air-control::after {
                    background: white;
                }

                .control-knob[data-active="true"]::after {
                    transform: translate(-50%, -50%) rotate(180deg);
                }

                .control-label {
                    font-size: 11px;
                    color: #fff;
                    text-align: center;
                    margin-top: 5px;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                }

                /* Air intensity indicator */
                .air-level {
                    width: 100%;
                    height: 4px;
                    background: #333;
                    border-radius: 2px;
                    margin-top: 5px;
                    overflow: hidden;
                }

                .air-level-fill {
                    height: 100%;
                    background: #64b5f6;
                    width: var(--air-level, 50%);
                    transition: width 0.3s ease;
                }

                canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .content {
                    position: relative;
                    z-index: 1;
                }
            </style>
            <canvas></canvas>
            <div class="content">
                <slot></slot>
            </div>
            <div class="tub-controls">
                <div class="control">
                    <div class="control-knob" data-control="stars" data-active="true">
                        <div class="control-label">✨ Stars</div>
                    </div>
                </div>
                <div class="control">
                    <div class="control-knob" data-control="jets" data-active="true">
                        <div class="control-label">🌊 Jets</div>
                    </div>
                </div>
                <div class="control">
                    <div class="control-knob" data-control="steam" data-active="false">
                        <div class="control-label">💨 Steam</div>
                    </div>
                </div>
                <div class="control">
                    <div class="control-knob air-control" data-control="air" data-active="true">
                        <div class="control-label">💨 Air</div>
                    </div>
                    <div class="air-level">
                        <div class="air-level-fill"></div>
                    </div>
                </div>
            </div>
        `;

        // Add control knob listeners with proper functionality
        this.shadowRoot.querySelectorAll('.control-knob').forEach(knob => {
            knob.addEventListener('click', () => {
                const isActive = knob.dataset.active === 'true';
                knob.dataset.active = !isActive;
                
                switch(knob.dataset.control) {
                    case 'stars':
                        this.classList.toggle('starry');
                        break;
                    case 'jets':
                        this.classList.toggle('jets-active');
                        this.configure({ 
                            jetsEnabled: !isActive 
                        });
                        break;
                    case 'steam':
                        this.configure({ 
                            steamIntensity: isActive ? 0 : 0.6 
                        });
                        break;
                    case 'air':
                        // Air control is handled by drag events
                        break;
                }
            });
        });

        // Enhanced air control
        const airKnob = this.shadowRoot.querySelector('[data-control="air"]');
        const airLevel = this.shadowRoot.querySelector('.air-level-fill');
        let isDragging = false;
        let startY = 0;
        let startIntensity = this.options.rippleIntensity;

        airKnob.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startIntensity = this.options.rippleIntensity;
            document.body.style.cursor = 'ns-resize';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const delta = (startY - e.clientY) / 100;
            const newIntensity = Math.max(0, Math.min(1, startIntensity + delta));
            this.configure({ rippleIntensity: newIntensity });
            airLevel.style.setProperty('--air-level', `${newIntensity * 100}%`);
            
            // Update bubble and jet intensity
            if (this.effects.jets) {
                this.effects.jets.setIntensity(newIntensity);
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.cursor = '';
        });

        // Initialize air level
        airLevel.style.setProperty('--air-level', `${this.options.rippleIntensity * 100}%`);
    }
}

// Register the custom element
customElements.define('hot-tub-talk', HotTubTalk);

export { HotTubTalk }; 