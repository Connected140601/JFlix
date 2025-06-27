import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(window.supabaseUrl, window.supabaseKey);

// Currency conversion rates (PHP to other currencies)
const CURRENCY_RATES = {
    'USD': 0.019,   // 1 PHP = 0.019 USD
    'EUR': 0.017,   // 1 PHP = 0.017 EUR
    'GBP': 0.015,   // 1 PHP = 0.015 GBP
    'JPY': 2.6,     // 1 PHP = 2.6 JPY
    'AUD': 0.028,   // 1 PHP = 0.028 AUD
    'CAD': 0.025,   // 1 PHP = 0.025 CAD
    'SGD': 0.026,   // 1 PHP = 0.026 SGD
    'MYR': 0.082,   // 1 PHP = 0.082 MYR
    'THB': 0.63,    // 1 PHP = 0.63 THB
    'IDR': 275.00,  // 1 PHP = 275.00 IDR
    'VND': 450.00,  // 1 PHP = 450.00 VND
    'HKD': 0.15,    // 1 PHP = 0.15 HKD
    'TWD': 0.058,    // 1 PHP = 0.058 TWD
    'KRW': 24.5,    // 1 PHP = 24.5 KRW
    'NZD': 0.029,   // 1 PHP = 0.029 NZD
    'INR': 1.50,    // 1 PHP = 1.50 INR
    'CNY': 0.13,    // 1 PHP = 0.13 CNY
    'DKK': 0.12,    // 1 PHP = 0.12 DKK
    'SEK': 0.18,    // 1 PHP = 0.18 SEK
    'NOK': 0.19,    // 1 PHP = 0.19 NOK
    'CHF': 0.018,   // 1 PHP = 0.018 CHF
};

// Currency symbols
const CURRENCY_SYMBOLS = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'AUD': '$',
    'CAD': '$',
    'SGD': '$',
    'MYR': 'RM',
    'THB': '฿',
    'IDR': 'Rp',
    'VND': '₫',
    'HKD': 'HK$',
    'TWD': 'NT$',
    'KRW': '₩',
    'NZD': '$',
    'INR': '₹',
    'CNY': '¥',
    'DKK': 'kr',
    'SEK': 'kr',
    'NOK': 'kr',
    'CHF': 'CHF',
    'PHP': '₱',
};

// Map country codes to currencies
const COUNTRY_CURRENCIES = {
    'US': 'USD',
    'CA': 'CAD',
    'AU': 'AUD',
    'GB': 'GBP',
    'JP': 'JPY',
    'SG': 'SGD',
    'MY': 'MYR',
    'TH': 'THB',
    'ID': 'IDR',
    'VN': 'VND',
    'HK': 'HKD',
    'TW': 'TWD',
    'KR': 'KRW',
    'NZ': 'NZD',
    'IN': 'INR',
    'CN': 'CNY',
    'DK': 'DKK',
    'SE': 'SEK',
    'NO': 'NOK',
    'CH': 'CHF',
    'PH': 'PHP'
};

// Base prices in PHP
const BASE_PRICES = {
    '7': 15,  // 7 days
    '15': 30, // 15 days
    '30': 50  // 30 days
};

// Helper: dynamically load CSS if not already present
function ensurePremiumBannerCSS() {
    if (!document.querySelector('link[href*="premium-banner.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/premium-banner.css?v=1.1';
        document.head.appendChild(link);
    }
}

// Helper: inject premium banner HTML from template if not already present
async function injectPremiumBannerHTML() {
    if (!document.querySelector('.premium-banner')) {
        try {
            const res = await fetch('templates/premium-banner.html');
            const html = await res.text();
            // Insert at top of body (after navbar if exists)
            const navbar = document.querySelector('.navbar');
            if (navbar && navbar.parentNode) {
                navbar.insertAdjacentHTML('afterend', html);
            } else {
                document.body.insertAdjacentHTML('afterbegin', html);
            }
        } catch (e) {
            console.error('Failed to inject premium banner HTML:', e);
        }
    }
}

// Get user's country from IP
async function getUserCountry() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const { ip } = await response.json();
        const countryResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const countryData = await countryResponse.json();
        return countryData.country_code;
    } catch (error) {
        console.error('Error getting user country:', error);
        return 'PH'; // Default to Philippines if error
    }
}

// Convert price to user's local currency
async function convertPrice(price, baseCurrency = 'PHP') {
    const country = await getUserCountry();
    let currencyCode;
    
    // Map country codes to currencies
    const COUNTRY_CURRENCIES = {
        'US': 'USD',
        'CA': 'CAD',
        'AU': 'AUD',
        'GB': 'GBP',
        'JP': 'JPY',
        'SG': 'SGD',
        'MY': 'MYR',
        'TH': 'THB',
        'ID': 'IDR',
        'VN': 'VND',
        'PH': 'PHP'
    };

    currencyCode = COUNTRY_CURRENCIES[country] || 'PHP';
    
    if (baseCurrency === currencyCode) {
        return `${CURRENCY_SYMBOLS[currencyCode]}${price.toFixed(2)}`;
    }
    
    const rate = CURRENCY_RATES[currencyCode];
    const convertedPrice = price * rate;
    return `${CURRENCY_SYMBOLS[currencyCode]}${convertedPrice.toFixed(2)}`;
}

// Update all prices in the banner
async function updatePrices() {
    const priceElements = document.querySelectorAll('.price');
    for (const priceElement of priceElements) {
        const basePrice = parseInt(priceElement.dataset.basePrice);
        const convertedPrice = await convertPrice(basePrice);
        priceElement.textContent = convertedPrice;
    }
}

// Check if user is premium
async function checkPremiumStatus() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (user) {
            // Check if user has premium status in your database
            const { data: userData, error: fetchError } = await supabase
                .from('users')
                .select('is_premium')
                .eq('id', user.id)
                .single();

            if (fetchError) throw fetchError;
            
            // Add premium-user class to body if user is premium
            if (userData?.is_premium) {
                document.body.classList.add('premium-user');
            }
        }
    } catch (error) {
        console.error('Error checking premium status:', error);
    }
}

// Initialize premium banner
async function initPremiumBanner() {
    ensurePremiumBannerCSS();
    await injectPremiumBannerHTML();

    // Update prices based on user's location
    await updatePrices();
    
    // Add click handler for upgrade button
    const upgradeBtn = document.getElementById('premium-upgrade-btn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', () => {
            window.location.href = '/account.html';
        });
    }
}

// Determine if banner should be shown on this page
function shouldShowPremiumBanner() {
    const path = window.location.pathname.toLowerCase();
    // Exclude pages under NOADS directory only
    return !path.includes('/noads/');
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    if (shouldShowPremiumBanner()) {
        await initPremiumBanner();

        // Show banner immediately for non-premium users (after injection)
        if (!document.body.classList.contains('premium-user')) {
            const bannerElement = document.querySelector('.premium-banner');
            if (bannerElement) bannerElement.style.display = 'block';
        }
    }
    // Always check premium status (may hide banner if user premium)
    checkPremiumStatus();
});
