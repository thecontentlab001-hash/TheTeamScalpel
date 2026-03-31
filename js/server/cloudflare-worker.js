/**
 * ðŸ› ï¸ Cloudflare Worker: Secure MEGA Stream Proxy
 * For deployment on Cloudflare Workers (Free)
 */

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    // ðŸ” Security Logic: Link Token to MEGA File
    const VIDEO_DB = {
        'surgical-case-01': 'https://mega.nz/file/uHp0gJ5Q#Ij6hZvaIWomZNBrZWB6-GfqJHCc5ugFClZyY1_sBxoA',
        'hernia-repair': 'https://mega.nz/file/your_id#your_key'
    };

    const megaUrl = VIDEO_DB[token];

    if (!megaUrl) {
        return new Response('Video not found or invalid token.', { status: 404 });
    }

    // ðŸ›¡ï¸ Implement Referrer Protection
    const referer = request.headers.get('referer') || '';
    const allowed = 'yourwebsite.com';
    if (!referer.includes(allowed)) {
        // return new Response('Forbidden: Access via verified domain only.', { status: 403 });
    }

    /* 
     * NOTE: To perform Decryption within Cloudflare Workers, 
     * a specialized library like 'mega-web-worker' or similar is required.
     * This script acts as the secure middleman for public or pre-decrypted streams.
     */

    try {
        // Fetch the MEGA public link (if exported)
        // or a pre-signed direct download link
        const response = await fetch(megaUrl, {
            headers: request.headers // Forward ranges
        });

        const newResponse = new Response(response.body, response);
        newResponse.headers.set('Access-Control-Allow-Origin', '*');
        newResponse.headers.set('X-Frame-Options', 'DENY');
        newResponse.headers.set('Content-Disposition', 'inline'); // Ensure it streams
        return newResponse;
    } catch (e) {
        return new Response('Error connecting to MEGA API.', { status: 500 });
    }
}

