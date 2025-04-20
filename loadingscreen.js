// loading-screen.js
(function() {
  // Create CSS styles
  const style = document.createElement('style');
  style.textContent = `
    .loading-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      background-color: var(--light-bg, #f9f9f9);
      transition: opacity 0.5s ease, visibility 0.5s ease, background-color 0.3s ease;
    }

    .dark-mode .loading-container {
      background-color: var(--dark-bg, #121212);
    }

    .loading-logo {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--primary-color, #3a86ff);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
    }

    .loading-logo i {
      margin-right: 10px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(58, 134, 255, 0.2);
      border-radius: 50%;
      border-top-color: var(--primary-color, #3a86ff);
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      font-size: 1.2rem;
      color: var(--light-text, #333333);
      text-align: center;
      max-width: 80%;
      opacity: 0.8;
    }

    .dark-mode .loading-text {
      color: var(--dark-text, #e0e0e0);
    }

    .loading-bar-container {
      width: 300px;
      height: 6px;
      background-color: rgba(58, 134, 255, 0.2);
      border-radius: 3px;
      margin-top: 1.5rem;
      overflow: hidden;
    }

    .loading-bar {
      height: 100%;
      background-color: var(--primary-color, #3a86ff);
      border-radius: 3px;
      width: 0%;
      transition: width 0.2s ease;
    }

    .loading-percentage {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: var(--primary-color, #3a86ff);
      font-weight: 600;
    }

    .hidden {
      opacity: 0;
      visibility: hidden;
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `;
  document.head.appendChild(style);

  // Create loading overlay
  const overlay = document.createElement('div');
  overlay.id = 'loading-overlay';
  overlay.className = 'loading-container';
  
  // Check for saved theme preference right away
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  // Create HTML structure
  overlay.innerHTML = `
    <div class="loading-logo">
      <i class="fa-solid fa-cart-shopping"></i> Yonko
    </div>
    <div class="loading-spinner">
      <div class="spinner"></div>
    </div>
    <div class="loading-text animate-pulse">En cours de chargement...</div>
    <div class="loading-bar-container">
      <div id="loading-bar" class="loading-bar"></div>
    </div>
    <div id="loading-percentage" class="loading-percentage">0%</div>
  `;

  // Disable scrolling while loading
  document.body.style.overflow = 'hidden';
  
  // Insert overlay as the first element in body
  document.body.insertBefore(overlay, document.body.firstChild);

  // Get elements for manipulation
  const loadingBar = document.getElementById('loading-bar');
  const loadingPercentage = document.getElementById('loading-percentage');

  // Simulate loading progress
  let progress = 0;
  const increment = Math.random() * (3 - 0.5) + 0.5; // Random increment between 0.5 and 3
  
  const simulateLoading = setInterval(() => {
    progress += increment;
    
    // Cap progress at 90% until page is fully loaded
    if (progress > 90) {
      progress = 90;
      clearInterval(simulateLoading);
    }
    
    loadingBar.style.width = `${progress}%`;
    loadingPercentage.textContent = `${Math.round(progress)}%`;
  }, 100);
  
  // Complete loading once page is ready
  window.addEventListener('load', function() {
    // Fast forward to 100%
    progress = 100;
    loadingBar.style.width = '100%';
    loadingPercentage.textContent = '100%';
    
    // Delay hiding the loading screen for a smooth transition
    setTimeout(() => {
      overlay.classList.add('hidden');
      // Enable scrolling on body
      document.body.style.overflow = '';
      
      // After transition completes, remove the overlay entirely to clean up the DOM
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 500);
    }, 500);
  });

  // If loading takes too long, force hide after 8 seconds
  setTimeout(() => {
    if (overlay && !overlay.classList.contains('hidden')) {
      loadingBar.style.width = '100%';
      loadingPercentage.textContent = '100%';
      
      setTimeout(() => {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
        
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 500);
      }, 500);
    }
  }, 8000);
})();
