// Modular Sidebar System - Triple Nickel Lite
// This creates the sidebar navigation dynamically and handles all functionality

// Navigation configuration - UPDATE THIS TO CHANGE ALL PAGES
const NAVIGATION_CONFIG = {
    title: 'TRIPLE NICKEL',
    subtitle: 'Lite',
    items: [
        { href: 'index.html', icon: '🏠', text: 'Home' },
        { href: 'walkback.html', icon: '📏', text: 'Walkback' },
        { href: 'side-games.html', icon: '🎲', text: 'Side Games' },
        { href: 'resources.html', icon: '📚', text: 'Resources' }
    ]
};

// Generate sidebar HTML
function generateSidebarHTML() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    let navItemsHTML = '';
    NAVIGATION_CONFIG.items.forEach(item => {
        const isActive = item.href === currentPage ? ' active' : '';
        
        navItemsHTML += `
            <a href="${item.href}" class="nav-button${isActive}">
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
        if (href === currentPage) {
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
