const express = require('express');
const { File } = require('megajs');
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * ðŸ› ï¸ Secure Video Stream Proxy for MEGA
 * Handles decryption and streaming (Range Request Support)
 */

app.get('/api/stream/:token', async (req, res) => {
    const { token } = req.params;
    
    // ðŸ” Security Logic: Match token to a MEGA URL
    // In production, this would be a lookup in a secure DB or env mapping
    const VIDEO_DATABASE = {
        'surgical-case-01': 'https://mega.nz/file/uHp0gJ5Q#Ij6hZvaIWomZNBrZWB6-GfqJHCc5ugFClZyY1_sBxoA',
        'hernia-repair-op': 'https://mega.nz/file/vREHRCpI#your_key' // Example
    };

    const megaUrl = VIDEO_DATABASE[token];

    if (!megaUrl) {
        return res.status(404).send('Video not found or invalid token.');
    }

    try {
        const file = File.fromURL(megaUrl);
        await file.loadAttributes();

        const fileSize = file.size;
        const range = req.headers.range;

        // ðŸ›¡ï¸ Hotlink Protection & Referrer Check
        const referer = req.headers.referer || '';
        const allowedDomain = 'yourwebsite.com'; // Adjust this
        if (process.env.NODE_ENV === 'production' && !referer.includes(allowedDomain)) {
            // return res.status(403).send('Forbidden: Hotlinking is not allowed.');
        }

        if (range) {
            // ðŸ”„ Range Request Support (Seeking/Scrubbing)
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4', // Important: Adjust if your videos are different
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Connection': 'keep-alive'
            });

            file.download({ start, end }).pipe(res);
        } else {
            // ðŸŽžï¸ Full Stream Request
            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
                'Accept-Ranges': 'bytes'
            });
            file.download().pipe(res);
        }
    } catch (err) {
        console.error('Mega Proxy Error:', err);
        res.status(500).send('Error initializing secure stream.');
    }
});

app.listen(PORT, () => {
    console.log(`âœ… Secure Stream Proxy running on http://localhost:${PORT}`);
});

