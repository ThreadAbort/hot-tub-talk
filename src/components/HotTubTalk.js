// HotTubTalk.js - A delightful web component for hot-tub style conversations
// Created by Hue & Aye - Making the web a more relaxing place! 🛁

import { StarField, SteamEffect, JetSystem, BubbleSystem } from '../utils/effects.js';

class HotTubTalk extends HTMLElement {
    // Define observed attributes
    static get observedAttributes() {
        return ['stars', 'steam', 'jets', 'wobble', 'intensity'];
    }

    constructor() {
        super();
        
        // Create shadow DOM
        this.attachShadow({ mode: 'open' });
        
        // Initialize properties with defaults
        this.options = {
            resolution: 512,
            dropRadius: 15,
            perturbance: 0.2,
            interactive: true,
            crossOrigin: '',
            stars: false,
            steam: false,
            steamIntensity: 0.2,
            jets: true,
            jetsEnabled: true,
            jetsIntensity: 0.5,
            ripple: true,
            rippleIntensity: 0.5,
            wobbleIntensity: 0.5,
        };

        // Initialize effects
        this.effects = {
            stars: null,
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

    // Handle attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        const isEnabled = newValue !== null && newValue !== 'false';
        
        switch(name) {
            case 'stars':
                this.options.stars = isEnabled;
                if (isEnabled) this.classList.add('starry');
                break;
            case 'steam':
                this.options.steam = isEnabled;
                this.effects.steam.intensity = isEnabled ? 0.6 : 0;
                break;
            case 'jets':
                this.options.jets = isEnabled;
                this.options.jetsEnabled = isEnabled;
                if (this.effects.jets) {
                    this.effects.jets.jets.forEach(jet => {
                        jet.active = isEnabled;
                    });
                }
                break;
            case 'wobble':
                this.options.wobbleIntensity = isEnabled ? 0.5 : 0;
                if (this.effects.jets) {
                    this.effects.jets.setWobble(this.options.wobbleIntensity);
                }
                break;
            case 'intensity':
                const intensity = parseFloat(newValue) || 0.5;
                this.options.rippleIntensity = intensity;
                this.options.jetsIntensity = intensity;
                this.options.steamIntensity = intensity * 0.6;
                break;
        }

        // Update controls if they exist
        this.updateControlStates();
    }

    // Add method to update control states
    updateControlStates() {
        if (!this.shadowRoot) return;

        const controls = {
            wobble: this.options.wobbleIntensity > 0,
            steam: this.options.steam && this.effects.steam.intensity > 0,
            jets: this.options.jetsEnabled,
            air: true // Air is always available
        };

        Object.entries(controls).forEach(([control, isActive]) => {
            const knob = this.shadowRoot.querySelector(`[data-control="${control}"]`);
            if (knob) {
                knob.dataset.active = isActive.toString();
            }
        });

        // Update air level indicator
        const airLevel = this.shadowRoot.querySelector('.air-level-fill');
        if (airLevel) {
            airLevel.style.width = `${this.options.rippleIntensity * 100}%`;
        }
    }

    connectedCallback() {
        // Set up canvas
        this.canvas = this.shadowRoot.querySelector('canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.effects.stars = new StarField(this.canvas);
            
            // Initialize jets
            const { width, height } = this.getBoundingClientRect();
            this.effects.jets.addJet(width * 0.2, height * 0.9, -Math.PI / 4);
            this.effects.jets.addJet(width * 0.4, height * 0.9, -Math.PI / 3);
            this.effects.jets.addJet(width * 0.6, height * 0.9, -Math.PI * 2/3);
            this.effects.jets.addJet(width * 0.8, height * 0.9, -Math.PI * 3/4);
            
            // Set initial jet states
            this.effects.jets.jets.forEach(jet => {
                jet.active = this.options.jetsEnabled;
            });
            
            // Start animation
            this.handleResize();
            requestAnimationFrame(this.animate);
        }

        // Add event listeners
        this.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('resize', this.handleResize);

        // Update control states
        this.updateControlStates();

        // Initialize wobble state
        this.setAttribute('data-wobble', 'true');
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
                    width: 32px;
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
                }

                .control-knob::before {
                    content: attr(data-tooltip);
                    position: absolute;
                    left: -22px;  /* Align with control panel edge */
                    top: -50px;   /* 50px above */
                    transform: translateX(-100%);  /* Move fully to the left */
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 3px 6px;
                    border-radius: 3px;
                    font-size: 10px;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s ease;
                    pointer-events: none;
                    white-space: nowrap;
                    /* Remove any rotation */
                    transform-origin: center;
                    transform: translateX(-100%) rotate(0deg) !important;
                }

                .control-knob:hover::before {
                    opacity: 1;
                    visibility: visible;
                }

                .control-knob[data-active="true"] {
                    border-color: #64b5f6;
                    box-shadow: 0 0 15px rgba(100, 181, 246, 0.5);
                }

                /* Add indicator for active state instead of rotation */
                .control-knob::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 6px;
                    height: 6px;
                    background: #64b5f6;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .control-knob[data-active="true"]::after {
                    opacity: 1;
                }

                .control-knob.air-control {
                    transition: all 0.2s ease;
                    background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
                    transform: rotate(calc(var(--intensity, 0.5) * 270deg));  /* 270 degree rotation range */
                }

                /* Remove the air level indicator and enhance the knob glow */
                .control-knob.air-control {
                    box-shadow: 0 0 calc(var(--intensity, 0.5) * 20px) 
                               rgba(100, 181, 246, calc(var(--intensity, 0.5) * 0.8));
                }

                /* Smooth dragging experience */
                .control-knob.air-control:active {
                    cursor: grab;
                    transition: transform 0.1s ease;
                }

                /* Keep tooltips upright even when knob rotates */
                .control-knob.air-control::before {
                    transform: translateX(-100%) rotate(calc(var(--intensity, 0.5) * -270deg)) !important;
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

                /* Text wobble animation */
                .content {
                    position: relative;
                    z-index: 1;
                }

                /* Only apply wobble when wave effect is active */
                :host([data-wobble="true"]) .content {
                    animation: textWobble 3s ease-in-out infinite;
                }

                @keyframes textWobble {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    25% {
                        transform: translateY(-4px) rotate(0.3deg);
                    }
                    50% {
                        transform: translateY(-2px) rotate(-0.3deg);
                    }
                    75% {
                        transform: translateY(-3px) rotate(0.2deg);
                    }
                }

                /* Disable mouse interaction when wobble is off */
                :host([data-wobble="false"]) {
                    pointer-events: none;
                }
                :host([data-wobble="false"]) .content {
                    pointer-events: auto;
                }
            </style>
            <canvas></canvas>
            <div class="content">
                <slot></slot>
            </div>
            <div class="tub-controls">
                <div class="control">
                    <div class="control-knob" data-control="wobble" data-active="true" data-tooltip="Toggle Wave Effect">
                        <div class="control-label">🌊</div>
                    </div>
                </div>
                <div class="control">
                    <div class="control-knob" data-control="steam" data-active="false" data-tooltip="Toggle Steam">
                        <div class="control-label">♨️</div>
                    </div>
                </div>
                <div class="control">
                    <div class="control-knob" data-control="jets" data-active="true" data-tooltip="Toggle Jets">
                        <div class="control-label">💨</div>
                    </div>
                </div>
                <div class="control">
                    <div class="control-knob air-control" data-control="air" data-active="true" data-tooltip="Adjust Intensity">
                        <div class="control-label">🎚️</div>
                    </div>
                </div>
            </div>
        `;

        // Enhanced air control with smooth rotation
        const airKnob = this.shadowRoot.querySelector('.air-control');
        let isDragging = false;
        let startY = 0;
        let startIntensity = this.options.rippleIntensity;
        let lastIntensity = startIntensity;

        const updateAirIntensity = (intensity) => {
            const newIntensity = Math.max(0, Math.min(1, intensity));
            airKnob.style.setProperty('--intensity', newIntensity);
            
            // Update effects
            this.options.rippleIntensity = newIntensity;
            this.options.steamIntensity = newIntensity * 0.6;
            this.options.jetsIntensity = newIntensity;
            
            if (this.effects.jets) {
                this.effects.jets.setIntensity(newIntensity);
            }
            if (this.effects.steam) {
                this.effects.steam.intensity = newIntensity * 0.6;
            }
            
            lastIntensity = newIntensity;
        };

        airKnob.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startIntensity = lastIntensity;
            document.body.style.cursor = 'grab';
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const delta = (startY - e.clientY) / 200;
            updateAirIntensity(startIntensity + delta);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.cursor = '';
        });

        // Initialize air knob position
        updateAirIntensity(this.options.rippleIntensity);

        // Fix the control functionality
        this.shadowRoot.querySelectorAll('.control-knob').forEach(knob => {
            knob.addEventListener('click', () => {
                const control = knob.dataset.control;
                const isActive = knob.dataset.active === 'true';
                const newState = !isActive;
                
                knob.dataset.active = newState.toString();
                
                switch(control) {
                    case 'wobble':
                        this.options.wobbleIntensity = newState ? 0.5 : 0;
                        if (this.effects.jets) {
                            this.effects.jets.setWobble(this.options.wobbleIntensity);
                            this.effects.bubbles.setWobble(this.options.wobbleIntensity);
                        }
                        break;
                    case 'steam':
                        this.effects.steam.intensity = newState ? 0.6 : 0;
                        break;
                    case 'jets':
                        if (this.effects.jets) {
                            this.effects.jets.jets.forEach(jet => {
                                jet.active = newState;
                            });
                        }
                        break;
                }
            });
        });

        // Initialize controls with current state
        this.updateControlStates();

        // Update the wobble toggle handler
        this.shadowRoot.querySelector('[data-control="wobble"]').addEventListener('click', () => {
            const isActive = this.getAttribute('data-wobble') === 'true';
            const newState = !isActive;
            
            // Toggle wobble state
            this.setAttribute('data-wobble', newState);
            
            // Update effects
            this.options.wobbleIntensity = newState ? 0.5 : 0;
            if (this.effects.jets) {
                this.effects.jets.setWobble(this.options.wobbleIntensity);
                this.effects.bubbles.setWobble(this.options.wobbleIntensity);
            }

            // Update interactive state
            this.options.interactive = newState;
            
            // Update control state
            this.shadowRoot.querySelector('[data-control="wobble"]').dataset.active = newState.toString();
        });
    }
}

// Register the custom element
customElements.define('hot-tub-talk', HotTubTalk);

export { HotTubTalk }; 