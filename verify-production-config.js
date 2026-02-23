/**
 * Production Configuration Verification Script
 * Run this to verify your production setup is correct
 */

import dotenv from 'dotenv';
dotenv.config();

console.log('\n🔍 RudBank Production Configuration Verification\n');
console.log('='.repeat(60));

// Check Environment Variables
console.log('\n📋 Environment Variables:');
console.log('='.repeat(60));

const checks = [
    {
        name: 'DATABASE_URL',
        value: process.env.DATABASE_URL,
        required: true,
        validate: (val) => val && val.includes('postgresql://'),
        message: 'Should start with postgresql://'
    },
    {
        name: 'JWT_SECRET',
        value: process.env.JWT_SECRET,
        required: true,
        validate: (val) => val && val.length >= 32,
        message: 'Should be at least 32 characters'
    },
    {
        name: 'CORS_ORIGIN',
        value: process.env.CORS_ORIGIN,
        required: true,
        validate: (val) => val && (val.startsWith('https://') || val === '*'),
        message: 'Should be https://your-domain.com or * for development'
    },
    {
        name: 'GOOGLE_CLIENT_ID',
        value: process.env.GOOGLE_CLIENT_ID,
        required: false,
        validate: (val) => !val || val.includes('.apps.googleusercontent.com'),
        message: 'Should end with .apps.googleusercontent.com'
    }
];

let allPassed = true;

checks.forEach(check => {
    const exists = !!check.value;
    const valid = exists && check.validate(check.value);
    const status = valid ? '✅' : (exists ? '⚠️' : '❌');
    
    console.log(`${status} ${check.name}: ${exists ? (check.name.includes('SECRET') ? '[HIDDEN]' : check.value) : 'NOT SET'}`);
    
    if (!valid && check.required) {
        console.log(`   ⚠️  ${check.message}`);
        allPassed = false;
    }
    
    if (!exists && check.required) {
        allPassed = false;
    }
});

// Check CORS Configuration
console.log('\n🌐 CORS Configuration:');
console.log('='.repeat(60));

if (process.env.CORS_ORIGIN) {
    if (process.env.CORS_ORIGIN === '*') {
        console.log('⚠️  CORS_ORIGIN is set to * (wildcard)');
        console.log('   This is OK for development but NOT recommended for production');
        console.log('   Set it to your exact domain: https://rudbank.vercel.app');
    } else if (process.env.CORS_ORIGIN.startsWith('https://')) {
        console.log('✅ CORS_ORIGIN is properly configured');
        console.log(`   Domain: ${process.env.CORS_ORIGIN}`);
    } else {
        console.log('❌ CORS_ORIGIN should start with https://');
        allPassed = false;
    }
} else {
    console.log('❌ CORS_ORIGIN is not set');
    allPassed = false;
}

// Check JWT Configuration
console.log('\n🔐 JWT Configuration:');
console.log('='.repeat(60));

if (process.env.JWT_SECRET) {
    const length = process.env.JWT_SECRET.length;
    if (length < 32) {
        console.log(`⚠️  JWT_SECRET is only ${length} characters`);
        console.log('   Recommended: At least 32 characters for security');
        allPassed = false;
    } else {
        console.log(`✅ JWT_SECRET length: ${length} characters`);
    }
} else {
    console.log('❌ JWT_SECRET is not set');
    allPassed = false;
}

// Check Google OAuth
console.log('\n🔑 Google OAuth Configuration:');
console.log('='.repeat(60));

if (process.env.GOOGLE_CLIENT_ID) {
    console.log('✅ GOOGLE_CLIENT_ID is set');
    console.log(`   Client ID: ${process.env.GOOGLE_CLIENT_ID}`);
    console.log('\n   ⚠️  Remember to configure in Google Cloud Console:');
    console.log('   1. Authorized JavaScript origins: https://rudbank.vercel.app');
    console.log('   2. Authorized redirect URIs: https://rudbank.vercel.app');
    console.log('   3. Wait 5-10 minutes after changes');
} else {
    console.log('⚠️  GOOGLE_CLIENT_ID is not set');
    console.log('   Google OAuth will not work');
    console.log('   This is optional - regular login will still work');
}

// Production Checklist
console.log('\n📝 Production Deployment Checklist:');
console.log('='.repeat(60));

const checklist = [
    'Set all environment variables in Vercel Dashboard',
    'Configure Google Cloud Console (if using OAuth)',
    'Verify CORS_ORIGIN matches your domain exactly',
    'Ensure JWT_SECRET is at least 32 characters',
    'Test /api/debug endpoint after deployment',
    'Clear browser cache before testing',
    'Test in incognito mode',
    'Verify cookies are set with HttpOnly and Secure flags'
];

checklist.forEach((item, index) => {
    console.log(`${index + 1}. ${item}`);
});

// Final Summary
console.log('\n' + '='.repeat(60));
if (allPassed) {
    console.log('✅ All critical checks passed!');
    console.log('   Your configuration looks good for production.');
    console.log('\n   Next steps:');
    console.log('   1. Set these variables in Vercel Dashboard');
    console.log('   2. Deploy your application');
    console.log('   3. Test with /api/debug endpoint');
} else {
    console.log('❌ Some checks failed!');
    console.log('   Please fix the issues above before deploying.');
    console.log('\n   Common fixes:');
    console.log('   1. Copy .env.example to .env');
    console.log('   2. Fill in all required values');
    console.log('   3. Generate a strong JWT_SECRET (32+ characters)');
    console.log('   4. Set CORS_ORIGIN to your Vercel domain');
}
console.log('='.repeat(60) + '\n');

// Exit with appropriate code
process.exit(allPassed ? 0 : 1);
