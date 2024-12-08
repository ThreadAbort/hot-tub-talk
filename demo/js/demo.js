// 🛁 Hot Tub Talk Demo Script
// Making waves and having fun!

import { HotTubTalk } from '../../src/components/HotTubTalk.js';

document.addEventListener('DOMContentLoaded', () => {
    // Make sure the component is registered
    if (!customElements.get('hot-tub-talk')) {
        customElements.define('hot-tub-talk', HotTubTalk);
    }

    // Initialize all Hot Tub Talk elements
    const hottubs = document.querySelectorAll('hot-tub-talk');
    
    // Initialize WebGL with hardware acceleration
    const initWebGL = () => {
        hottubs.forEach(tub => {
            if (tub.configure) {
                tub.configure({
                    resolution: 512,
                    dropRadius: 15,
                    perturbance: 0.02,
                    interactive: true,
                    crossOrigin: '',
                    useHardwareAcceleration: true
                });
            }
        });
    };

    // Demo controls
    const toggleNight = document.getElementById('toggleNight');
    const toggleSteam = document.getElementById('toggleSteam');
    const toggleJets = document.getElementById('toggleJets');
    const rippleIntensity = document.getElementById('rippleIntensity');

    // Night mode toggle
    toggleNight?.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        hottubs.forEach(tub => {
            if (!tub.classList.contains('starry-demo')) {
                tub.classList.toggle('starry');
            }
        });
    });

    // Steam effect toggle
    toggleSteam?.addEventListener('click', () => {
        hottubs.forEach(tub => {
            tub.classList.toggle('steamy');
            tub.configure({ 
                steamIntensity: tub.classList.contains('steamy') ? 0.6 : 0 
            });
        });
    });

    // Jets toggle
    toggleJets?.addEventListener('click', () => {
        hottubs.forEach(tub => {
            tub.classList.toggle('jets-active');
            tub.configure({ 
                jetsEnabled: tub.classList.contains('jets-active') 
            });
        });
    });

    // Ripple intensity control
    rippleIntensity?.addEventListener('input', (e) => {
        const intensity = e.target.value / 100;
        hottubs.forEach(tub => {
            tub.configure({ rippleIntensity: intensity });
        });
    });

    // FPS Counter
    const fpsCounter = document.getElementById('fpsCounter');
    let lastTime = performance.now();
    let frames = 0;

    function updateFPS() {
        frames++;
        const now = performance.now();
        if (now - lastTime > 1000) {
            if (fpsCounter) {
                fpsCounter.textContent = frames;
            }
            frames = 0;
            lastTime = now;
        }
        requestAnimationFrame(updateFPS);
    }

    updateFPS();

    // Initialize WebGL if supported
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            initWebGL();
            console.log('🎉 WebGL initialized successfully!');
        } else {
            console.warn('⚠️ WebGL not supported, falling back to CSS effects');
            hottubs.forEach(tub => tub.classList.add('fallback-mode'));
        }
    } catch (e) {
        console.error('😢 Error initializing WebGL:', e);
        hottubs.forEach(tub => tub.classList.add('fallback-mode'));
    }
});
