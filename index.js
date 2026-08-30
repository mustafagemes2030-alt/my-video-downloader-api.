const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();

// Ogolaansho buuxa oo CORS ah iyo JSON parser
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.send("API Downloader is active!");
});

// Endpoint-ka rasmiga ah ee Frontend-ku ka rabay
app.post('/api/download', (req, res) => {
    const videoUrl = req.body.url;

    if (!videoUrl) {
        return res.status(400).json({ detail: "Fadlan soo gali link-ga muuqaalka!" });
    }

    // Isticmaal yt-dlp
    exec(`yt-dlp -g "${videoUrl}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ detail: error.message });
        }

        const directLink = stdout.trim();

        // Frontend-ka wuxuu u baahan yahay qaab dhismeedkan (formats array)
        res.json({
            title: "Video Ready",
            thumbnail: "",
            formats: [
                {
                    url: directLink,
                    resolution: "HD / Direct Stream"
                }
            ]
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API-gaagu wuxuu ku shaqaynayaa Port ${PORT}!`));
