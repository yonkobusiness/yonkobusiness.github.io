// back-button.js
(function() {
    // Create CSS style
    const style = document.createElement('style');
    style.textContent = `
        .back-button {
            position: fixed;
            top: calc(var(--header-height) + 15px);
            right: 25px;
            background-color: #f39e21;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            z-index: 998;
            opacity: 0;
            visibility: hidden;
        }

        .back-button:hover {
            background-color: #e8911f;
            transform: scale(1.05);
        }

        .back-button:active {
            transform: scale(0.95);
        }

        .back-button.visible {
            opacity: 1;
            visibility: visible;
        }

        .back-button-arrow {
            width: 12px;
            height: 12px;
            border-left: 3px solid currentColor;
            border-top: 3px solid currentColor;
            transform: rotate(-45deg);
            margin-left: 4px;
        }

        @media (max-width: 768px) {
            .back-button {
                top: calc(var(--header-height) + 10px);
                left: 15px;
                width: 40px;
                height: 40px;
            }
        }
    `;
    document.head.appendChild(style);

    // Create the button
    const button = document.createElement('button');
    button.className = 'back-button';
    button.setAttribute('aria-label', 'Go back');
    button.setAttribute('title', 'Go back');
    
    // Add arrow icon
    const arrow = document.createElement('span');
    arrow.className = 'back-button-arrow';
    button.appendChild(arrow);

    // Add button to document
    document.body.appendChild(button);

    // Handle initial visibility
    // If this is the first entry point, hide the button
    if (window.history.length <= 1 || !document.referrer || document.referrer.indexOf(window.location.hostname) === -1) {
        // Hide the button if we're on the first page or came from external site
        button.classList.remove('visible');
    } else {
        // Show the button if we navigated from another page on the site
        button.classList.add('visible');
    }

    // Function to handle back navigation
    function goBack(e) {
        e.preventDefault();
        
        // Check if we can go back within the site
        if (window.history.length > 1 && document.referrer && document.referrer.indexOf(window.location.hostname) !== -1) {
            window.history.back();
        } else {
            // We're at the first page, hide the button
            button.classList.remove('visible');
        }
    }

    // Event listeners
    button.addEventListener('click', goBack);

    // Update button position when header height changes
    function updateButtonPosition() {
        const header = document.querySelector('header');
        if (header) {
            const headerHeight = header.offsetHeight;
            button.style.top = `${headerHeight + 15}px`;
        }
    }

    // Listen for header height changes
    window.addEventListener('resize', updateButtonPosition);
    
    // Initialize position after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateButtonPosition);
    } else {
        updateButtonPosition();
    }

    // Update button visibility when navigating with browser back/forward buttons
    window.addEventListener('popstate', function() {
        // If we can still go back within the site, keep the button visible
        if (window.history.length > 1 && document.referrer && document.referrer.indexOf(window.location.hostname) !== -1) {
            button.classList.add('visible');
        } else {
            // We're at the first page, hide the button
            button.classList.remove('visible');
        }
    });
})();
