const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("API Downloader is active!");
});

app.post('/api/download', async (req, res) => {
    const videoUrl = req.body ? req.body.url : null;

    if (!videoUrl) {
        return res.status(400).json({ detail: "Fadlan soo gali link-ga muuqaalka!" });
    }

    try {
        const output = await ytdlp(videoUrl, {
            getUrl: true,
            noWarnings: true,
            format: 'best'
        });

        const directLink = String(output).trim().split('\n')[0];

        return res.json({
            title: "Video Ready",
            thumbnail: "",
            formats: [
                {
                    url: directLink,
                    resolution: "HD Stream / Direct Download"
                }
            ]
        });
    } catch (error) {
        console.error("YTDLP Error:", error);
        return res.status(500).json({ 
            detail: "Muuqaalka waa la soo saari waayay. Hubi link-ga aad gelisay!" 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
