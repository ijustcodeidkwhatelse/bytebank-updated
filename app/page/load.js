import { updatePlayerInfo } from '../script.js';

export function onLoad() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Show loading screen immediately
    if (loadingScreen) {
        loadingScreen.style.opacity = '1';
    }

    // Wait for window load and a minimum time
    const minimumLoadTime = 1500; // 1.5 seconds minimum loading time
    const startTime = Date.now();

    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumLoadTime - elapsedTime);

        // Wait for minimum time before hiding loading screen
        setTimeout(() => {
            updatePlayerInfo();
            
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500); // Wait for fade out animation
            }
        }, remainingTime);
    });
}