/**
 * Simple Hash Router for SPA Navigation
 * Handles route changes and component rendering
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.contentContainer = null;
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('load', () => this.handleRouteChange());
    }

    /**
     * Register a route with its component
     * @param {string} path - Route path (e.g., 'dashboard', 'analytics')
     * @param {Function} component - Component render function
     */
    register(path, component) {
        this.routes[path] = component;
    }

    /**
     * Set the container where components will be rendered
     * @param {string} selector - CSS selector for content container
     */
    setContainer(selector) {
        this.contentContainer = document.querySelector(selector);
    }

    /**
     * Navigate to a specific route
     * @param {string} path - Route path
     */
    navigate(path) {
        window.location.hash = path;
    }

    /**
     * Get current route from hash
     * @returns {string} Current route path
     */
    getCurrentRoute() {
        const hash = window.location.hash.slice(1) || 'dashboard';
        return hash.split('?')[0]; // Remove query params if any
    }

    /**
     * Handle route changes
     */
    async handleRouteChange() {
        const route = this.getCurrentRoute();
        
        // Update active sidebar item
        this.updateActiveNav(route);
        
        // Get component for this route
        const component = this.routes[route] || this.routes['dashboard'];
        
        if (component && this.contentContainer) {
            try {
                // Show loading state
                this.contentContainer.innerHTML = '<div class="loading-spinner">Loading...</div>';
                
                // Render component
                const content = await component();
                this.contentContainer.innerHTML = content;
                
                // Initialize component-specific JS if exists
                if (window[`init${this.capitalize(route)}`]) {
                    window[`init${this.capitalize(route)}`]();
                }
                
                this.currentRoute = route;
            } catch (error) {
                console.error('Route rendering error:', error);
                this.contentContainer.innerHTML = '<div class="error-state">Failed to load content</div>';
            }
        }
    }

    /**
     * Update active state in sidebar navigation
     * @param {string} route - Current route
     */
    updateActiveNav(route) {
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${route}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Capitalize first letter
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Export singleton instance
const router = new Router();
