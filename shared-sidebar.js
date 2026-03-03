// Modular Sidebar System - Triple Nickel Lite
// This creates the sidebar navigation dynamically and handles all functionality

// Navigation configuration - UPDATE THIS TO CHANGE ALL PAGES
const NAVIGATION_CONFIG = {
    title: 'TRIPLE NICKEL',
    subtitle: 'Lite',
    items: [
        { href: 'index.html', icon: '🏠', text: 'Home' },
        { href: 'walkbackspec.html', icon: '📏', text: 'Walkback', matchPages: ['walkbackspec.html', 'walkback.html'] },
        { href: 'side-games.html', icon: '🎲', text: 'Side Games' },
        { href: 'training.html', icon: '🎯', text: 'Training' },
        { href: 'resources.html', icon: '📚', text: 'Resources' }
    ]
};

// Returns true if the saved walkback game state is just the default auto-initialized state
// (only the auto-added "Player 1" with no scores and no name change)
function isWalkbackDefaultState(saved) {
    if (!saved || !saved.gameState) return true;
    const gs = saved.gameState;
    if (!gs.players || gs.players.length === 0) return true;
    if (gs.players.length === 1 && gs.players[0].name === 'Player 1') {
        const hasScores = gs.players[0].scores && gs.players[0].scores.some(function(round) {
            return round && round.some(function(dist) {
                return dist && dist.some(function(score) { return score !== null; });
            });
        });
        return !hasScores;
    }
    return false;
}

// Handles the Walkback nav click from within walkback.html.
// Checks game state at click-time so the decision is always current.
function handleWalkbackNavClick(e) {
    try {
        const saved = JSON.parse(localStorage.getItem('walkbackGameState') || 'null');
        if (isWalkbackDefaultState(saved)) {
            // No real game in progress — clear state and go to spec page clean
            localStorage.removeItem('walkbackGameState');
            window.location.href = 'walkbackspec.html';
        }
        // Otherwise do nothing: stay on walkback.html (active game in progress)
    } catch (err) {
        window.location.href = 'walkbackspec.html';
    }
    e.preventDefault();
}

// Generate sidebar HTML
function generateSidebarHTML() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // For pages other than walkback.html, detect an active game so the link
    // skips the spec page and goes straight to the game.
    let walkbackHref = 'walkbackspec.html';
    if (currentPage !== 'walkback.html') {
        try {
            const saved = JSON.parse(localStorage.getItem('walkbackGameState') || 'null');
            if (!isWalkbackDefaultState(saved)) {
                walkbackHref = 'walkback.html';
            }
        } catch (e) {}
    }

    // On walkback.html the routing decision is deferred to click-time so it
    // always reflects the current game state (see handleWalkbackNavClick).
    const walkbackOnClick = (currentPage === 'walkback.html')
        ? ' onclick="handleWalkbackNavClick(event)"'
        : '';

    let navItemsHTML = '';
    NAVIGATION_CONFIG.items.forEach(item => {
        const activePages = item.matchPages || [item.href];
        const isActive = activePages.includes(currentPage) ? ' active' : '';
        const targetAttr = item.newWindow ? ' target="_blank" rel="noopener"' : '';
        const href = (item.text === 'Walkback') ? walkbackHref : item.href;
        const extraAttrs = (item.text === 'Walkback') ? walkbackOnClick : '';

        navItemsHTML += `
            <a href="${href}" class="nav-button${isActive}"${targetAttr}${extraAttrs}>
                <div class="nav-icon">${item.icon}</div>
                <div class="nav-text">${item.text}</div>
            </a>
        `;
    });
    
    const sidebarHTML = `
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-title">${NAVIGATION_CONFIG.title}</div>
                <div class="sidebar-subtitle">${NAVIGATION_CONFIG.subtitle}</div>
            </div>
            ${navItemsHTML}
            <div class="sidebar-spacer"></div>
            <a href="https://m3simplymagic.myshopify.com/" target="_blank" rel="noopener noreferrer" class="nav-button nav-button-proshop">
                <div class="nav-icon">🛒</div>
                <div class="nav-text">Pro Shop</div>
            </a>
        </div>
        <button class="sidebar-toggle" id="sidebarToggle" onclick="toggleSidebar()">☰</button>
    `;
    
    return sidebarHTML;
}

// Initialize sidebar
function initializeSidebar() {
    const container = document.getElementById('shared-navigation');
    
    if (container) {
        const sidebarHTML = generateSidebarHTML();
        container.innerHTML = sidebarHTML;
        
        // Ensure the sidebar is visible
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.style.display = 'flex';
            sidebar.style.visibility = 'visible';
        }
        
        return true;
    }
    return false;
}

// Sidebar toggle functionality
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const toggle = document.getElementById('sidebarToggle');
    
    if (sidebar && mainContent && toggle) {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // Update toggle button text
        if (sidebar.classList.contains('collapsed')) {
            toggle.textContent = '☰';
        } else {
            toggle.textContent = '✕';
        }
    }
}

// Set active navigation based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.classList.remove('active');
        const href = button.getAttribute('href');
        // Find matching config item to check matchPages
        const configItem = NAVIGATION_CONFIG.items.find(i => i.href === href);
        const activePages = (configItem && configItem.matchPages) ? configItem.matchPages : [href];
        if (activePages.includes(currentPage)) {
            button.classList.add('active');
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    setActiveNavigation();
});

// Also try immediate initialization (in case DOM is already loaded)
if (document.readyState !== 'loading') {
    initializeSidebar();
    setActiveNavigation();
}

// Export functions for global use
window.toggleSidebar = toggleSidebar;
window.setActiveNavigation = setActiveNavigation;
window.initializeSidebar = initializeSidebar;
window.handleWalkbackNavClick = handleWalkbackNavClick;
window.isWalkbackDefaultState = isWalkbackDefaultState; 
