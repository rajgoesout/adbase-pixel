// Facebook Pixel Base Code
!function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
}(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', 'YOUR_PIXEL_ID_HERE');

// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Get UTM parameters
var utmSource = getUrlParameter('utm_source');
var utmMedium = getUrlParameter('utm_medium');
var utmCampaign = getUrlParameter('utm_campaign');
var utmContent = getUrlParameter('utm_content');
var utmTerm = getUrlParameter('utm_term');

// Function to send data to your API
function sendToAPI(eventName, eventData) {
    const payload = {
        event_name: eventName,
        event_data: {
            ...eventData,
            pageEventId: Date.now().toString(),
            timeStamp: new Date().toISOString(),
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            utm_content: utmContent,
            utm_term: utmTerm
        }
    };

    // change this to adbase api url
    fetch('https://adbase-api-url.com/pixel', {
        method: 'POST',
        body: JSON.stringify(payload),
        keepalive: true,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => console.log('Data sent to API'))
        .catch(error => console.log('Error sending data to API:', error));
}

// Subscribe to Shopify events
analytics.subscribe('page_viewed', (event) => {
    fbq('track', 'PageView', {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm
    });
    sendToAPI('page_viewed', event);
});

analytics.subscribe('product_viewed', (event) => {
    fbq('track', 'ViewContent', {
        content_name: event.productTitle,
        content_ids: [event.productId],
        content_type: 'product',
        value: event.price,
        currency: event.currency
    });
    sendToAPI('product_viewed', event);
});

analytics.subscribe('cart_viewed', (event) => {
    fbq('track', 'ViewCart');
    sendToAPI('cart_viewed', event);
});

analytics.subscribe('checkout_started', (event) => {
    fbq('track', 'InitiateCheckout');
    sendToAPI('checkout_started', event);
});

analytics.subscribe('checkout_completed', (event) => {
    fbq('track', 'Purchase', {
        value: event.totalPrice,
        currency: event.currency
    });
    sendToAPI('checkout_completed', event);
});
