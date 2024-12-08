// Hot Tub Talk - Main Entry Point
// Where all the magic begins! ✨

// Import our components and utilities
import './components/HotTubTalk.js';

// Demo initialization
document.addEventListener('DOMContentLoaded', () => {
    // Get all our controls
    const toggleNight = document.getElementById('toggleNight');
    const toggleSteam = document.getElementById('toggleSteam');
    const toggleJets = document.getElementById('toggleJets');
    const rippleIntensity = document.getElementById('rippleIntensity');

    // Get all hot tub talk instances
    const hottubs = document.querySelectorAll('htt');

    // Night mode toggle
    toggleNight?.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        hottubs.forEach(tub => {
            tub.classList.toggle('starry');
        });
    });

    // Steam effect toggle
    toggleSteam?.addEventListener('click', () => {
        hottubs.forEach(tub => {
            tub.classList.toggle('steamy');
            if (tub.classList.contains('steamy')) {
                tub.configure({ steamIntensity: 0.6 });
            } else {
                tub.configure({ steamIntensity: 0 });
            }
        });
    });

    // Jets toggle
    toggleJets?.addEventListener('click', () => {
        hottubs.forEach(tub => {
            tub.classList.toggle('jets-active');
            if (tub.classList.contains('jets-active')) {
                tub.configure({ jetsEnabled: true });
            } else {
                tub.configure({ jetsEnabled: false });
            }
        });
    });

    // Ripple intensity control
    rippleIntensity?.addEventListener('input', (e) => {
        const intensity = e.target.value / 100;
        hottubs.forEach(tub => {
            tub.configure({ rippleIntensity: intensity });
        });
    });

    // Log a friendly message
    console.log('🛁 Hot Tub Talk is ready to make waves!');
}); 