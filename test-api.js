import fetch from 'node-fetch';

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const TEST_USER = {
    username: 'testuser_' + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: 'Test@123456',
    phone: '1234567890'
};

let authToken = null;

// Helper function
const log = (title, data) => {
    console.log('\n' + '='.repeat(50));
    console.log(title);
    console.log('='.repeat(50));
    console.log(JSON.stringify(data, null, 2));
};

// Test 1: Health Check
async function testHealth() {
    try {
        const res = await fetch(`${BASE_URL}/api/health`);
        const data = await res.json();
        log('✅ Health Check', { status: res.status, data });
        return res.status === 200;
    } catch (error) {
        log('❌ Health Check Failed', { error: error.message });
        return false;
    }
}

// Test 2: Registration
async function testRegister() {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });
        const data = await res.json();
        log('✅ Registration', { status: res.status, data });
        return res.status === 201;
    } catch (error) {
        log('❌ Registration Failed', { error: error.message });
        return false;
    }
}

// Test 3: Login
async function testLogin() {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                username: TEST_USER.username,
                password: TEST_USER.password
            })
        });
        const data = await res.json();
        
        // Extract token from response
        if (data.data && data.data.token) {
            authToken = data.data.token;
        }
        
        // Also check Set-Cookie header
        const cookies = res.headers.get('set-cookie');
        
        log('✅ Login', { 
            status: res.status, 
            data,
            hasCookie: !!cookies,
            hasToken: !!authToken
        });
        
        return res.status === 200 && (authToken || cookies);
    } catch (error) {
        log('❌ Login Failed', { error: error.message });
        return false;
    }
}

// Test 4: Get Profile
async function testProfile() {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        const res = await fetch(`${BASE_URL}/api/bank/profile`, {
            method: 'GET',
            headers,
            credentials: 'include'
        });
        const data = await res.json();
        log('✅ Get Profile', { status: res.status, data });
        return res.status === 200;
    } catch (error) {
        log('❌ Get Profile Failed', { error: error.message });
        return false;
    }
}

// Test 5: Get Balance
async function testBalance() {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        const res = await fetch(`${BASE_URL}/api/bank/balance`, {
            method: 'GET',
            headers,
            credentials: 'include'
        });
        const data = await res.json();
        log('✅ Get Balance', { status: res.status, data });
        return res.status === 200;
    } catch (error) {
        log('❌ Get Balance Failed', { error: error.message });
        return false;
    }
}

// Test 6: Credit Amount
async function testCredit() {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        const res = await fetch(`${BASE_URL}/api/bank/credit`, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify({ amount: 5000 })
        });
        const data = await res.json();
        log('✅ Credit Amount', { status: res.status, data });
        return res.status === 200;
    } catch (error) {
        log('❌ Credit Amount Failed', { error: error.message });
        return false;
    }
}

// Test 7: Get Transactions
async function testTransactions() {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        const res = await fetch(`${BASE_URL}/api/bank/transactions`, {
            method: 'GET',
            headers,
            credentials: 'include'
        });
        const data = await res.json();
        log('✅ Get Transactions', { status: res.status, data });
        return res.status === 200;
    } catch (error) {
        log('❌ Get Transactions Failed', { error: error.message });
        return false;
    }
}

// Test 8: Logout
async function testLogout() {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        const res = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers,
            credentials: 'include'
        });
        const data = await res.json();
        log('✅ Logout', { status: res.status, data });
        return res.status === 200;
    } catch (error) {
        log('❌ Logout Failed', { error: error.message });
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('\n🚀 Starting API Tests...');
    console.log(`📍 Base URL: ${BASE_URL}`);
    console.log(`👤 Test User: ${TEST_USER.username}\n`);
    
    const results = {
        health: await testHealth(),
        register: await testRegister(),
        login: await testLogin(),
        profile: await testProfile(),
        balance: await testBalance(),
        credit: await testCredit(),
        transactions: await testTransactions(),
        logout: await testLogout()
    };
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    
    const passed = Object.values(results).filter(r => r).length;
    const total = Object.keys(results).length;
    
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${passed ? '✅' : '❌'} ${test.toUpperCase()}`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`Final Score: ${passed}/${total} tests passed`);
    console.log('='.repeat(50) + '\n');
    
    process.exit(passed === total ? 0 : 1);
}

// Run tests
runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
