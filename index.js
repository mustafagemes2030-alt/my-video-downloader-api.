const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();

// Ogolaansho buuxa oo CORS ah
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.send("API Downloader is active!");
});

// Endpoint-ka download-ka
app.post('/api/download', (req, res) => {
    const videoUrl = req.body ? req.body.url : null;

    if (!videoUrl) {
        return res.status(400).json({ detail: "Fadlan soo gali link-ga muuqaalka!" });
    }

    // Amarka yt-dlp oo wata timeout si uusan noqon hang
    exec(`yt-dlp -g --no-warnings "${videoUrl}"`, { timeout: 30000 }, (error, stdout, stderr) => {
        if (error) {
            console.error("yt-dlp error:", error.message);
            return res.status(500).json({ 
                detail: "Muuqaalka waa la soo saari waayay. Hubi in yt-dlp ku shuban yahay Render." 
            });
        }

        const directLinks = stdout.trim().split('\n');
        const mainLink = directLinks[0];

        if (!mainLink) {
            return res.status(404).json({ detail: "Lama helin link-ga tooska ah." });
        }

        // Qaabka uu Frontend-ku ka raadinayo
        return res.json({
            title: "Video Ready",
            thumbnail: "",
            formats: [
                {
                    url: mainLink,
                    resolution: "HD Stream / Direct Download"
                }
            ]
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

