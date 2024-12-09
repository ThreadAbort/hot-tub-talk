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
            stars: true,
            steam: true,
            steamIntensity: 0.2,
            jets: true,
            jetsEnabled: true,
            jetsIntensity: 0.5,
            ripple: true,
            rippleIntensity: 0.5,
            wobbleIntensity: 0.5,
            starAnimationFrequency: 2,
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
            // Only update stars at specified frequency intervals to optimize performance
            
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
                    z-index: 2;
                    left: -22px;
                    top: 0;
                    bottom: 0;
                    width: 32px; /* Fixed width to contain controls */
                    
                    background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
                    border-radius: 12px 0px 0px 12px;
                    padding: 8px 4px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 
                        2px 0 10px rgba(0,0,0,0.3),
                        inset 1px 0 1px rgba(255,255,255,0.1);
                }

                .control {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .control-knob {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
                    border: 2px solid #333;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s ease;
                    transform-origin: center;
                }

                .control-knob[data-active="true"] {
                    border-color: #64b5f6;
                    box-shadow: 0 0 15px rgba(100, 181, 246, 0.5);
                    transform: rotate(180deg);
                }

                .control-knob.air-control {
                    background: linear-gradient(145deg, #1e88e5, #1565c0);
                }
                .air-level {
                    height: 4px;
                    width: 32px;
                    background: #333;
                    border-radius: 2px;
                    margin: 4px auto;
                    overflow: hidden;
                }

                .air-level-fill {
                    height: 100%;
                    background: #64b5f6;
                    width: var(--air-level, 50%);
                    transition: width 0.3s ease;
                    box-shadow: 0 0 5px rgba(100, 181, 246, 0.5);
                }

                .control-label {
                    font-size: 10px;
                    color: #fff;
                    text-align: center;
                    margin-top: 2px;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
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
                    <div class="control-knob" data-control="wobble" data-active="true">
                        <div class="control-label">🌊</div>
                    </div>
                </div>
                <div class="control">
                    <div class="control-knob" data-control="steam" data-active="true">
                        <div class="control-label">♨️</div>
                    </div>
                </div>
                <div class="control">
                    <div class="control-knob" data-control="jets" data-active="true">
                        <div class="control-label">💨</div>
                    </div>
                </div>
                <div class="control">
                    <div class="control-knob air-control" data-control="air" data-active="true">
                        <div class="control-label">💫</div>
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
                knob.dataset.active = (!isActive).toString();
                
                switch(knob.dataset.control) {
                    case 'wobble':
                        const wobbleValue = isActive ? 0 : 0.5;
                        this.options.wobbleIntensity = wobbleValue;
                        this.effects.jets.setWobble(wobbleValue);
                        this.effects.bubbles.setWobble(wobbleValue);
                        break;
                    case 'steam':
                        this.effects.steam.intensity = isActive ? 0 : 0.6;
                        break;
                    case 'jets':
                        this.effects.jets.jets.forEach(jet => {
                            jet.active = !isActive;
                        });
                        break;
                }
            });
        });

        // Enhanced air control with horizontal drag
        const airKnob = this.shadowRoot.querySelector('.air-control');
        const airLevel = this.shadowRoot.querySelector('.air-level-fill');
        let isDragging = false;
        let startX = 0;
        let startIntensity = this.options.rippleIntensity;

        airKnob.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startIntensity = this.options.rippleIntensity;
            document.body.style.cursor = 'ew-resize';  // Changed to horizontal cursor
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const delta = (e.clientX - startX) / 200;  // Changed to use X coordinate
            const newIntensity = Math.max(0, Math.min(1, startIntensity + delta));
            
            // Update all intensity-based effects
            this.options.rippleIntensity = newIntensity;
            this.options.steamIntensity = newIntensity * 0.6;
            this.options.jetsIntensity = newIntensity;
            
            // Update effects
            this.effects.jets.setIntensity(newIntensity);
            this.effects.steam.intensity = newIntensity * 0.6;
            
            // Update visual indicator
            airLevel.style.width = `${newIntensity * 100}%`;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.cursor = '';
        });

        // Initialize air level
        airLevel.style.width = `${this.options.rippleIntensity * 100}%`;
    }
}

// Register the custom element
customElements.define('hot-tub-talk', HotTubTalk);

export { HotTubTalk }; 