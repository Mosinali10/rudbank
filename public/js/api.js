/**
 * API Service Layer
 * Centralized API calls with error handling
 */

const API = {
    baseURL: '/api',

    /**
     * Generic fetch wrapper with error handling
     */
    async request(endpoint, options = {}) {
        const config = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            const data = await response.json();

            if (response.status === 401) {
                // Session expired - redirect to login
                window.dispatchEvent(new CustomEvent('auth:logout'));
                throw new Error('Session expired');
            }

            return { success: response.ok, data, status: response.status };
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    },

    // Auth endpoints
    auth: {
        login: (credentials) => API.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        
        register: (userData) => API.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
        
        logout: () => API.request('/auth/logout', { method: 'POST' }),
        
        getProfile: () => API.request('/bank/profile'),
        
        changePassword: (passwords) => API.request('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify(passwords)
        })
    },

    // Bank endpoints
    bank: {
        getBalance: () => API.request('/bank/balance'),
        
        getTransactions: () => API.request('/bank/transactions'),
        
        credit: (amount) => API.request('/bank/credit', {
            method: 'POST',
            body: JSON.stringify({ amount })
        }),
        
        debit: (amount) => API.request('/bank/debit', {
            method: 'POST',
            body: JSON.stringify({ amount })
        }),
        
        updateProfile: (profileData) => API.request('/bank/update-profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        })
    }
};
