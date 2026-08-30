const express = require('express');
const cors = require('cors');

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
        // API Toos ah oo bilaash ah (kaas oo taageera Facebook, TikTok, YouTube, Instagram)
        const response = await fetch(`https://api.vkrdownloader.com/server?url=${encodeURIComponent(videoUrl)}`);
        const data = await response.json();

        // Hubi bal inay jawaabtu leedahay link video
        if (data && data.data && (data.data.url || data.data.downloads)) {
            const downloadUrl = data.data.url || data.data.downloads[0].url;
            
            return res.json({
                title: data.data.title || "Video Ready",
                thumbnail: data.data.thumbnail || "",
                formats: [
                    {
                        url: downloadUrl,
                        resolution: "HD Stream / Direct Download"
                    }
                ]
            });
        } else {
            return res.status(400).json({ detail: "Muuqaalkan waa la soo saari waayay. Hubi link-ga aad gelisay!" });
        }

    } catch (error) {
        console.error("Download Error:", error);
        return res.status(500).json({ 
            detail: "Error ayaa dhacay marka muuqaalka la soo saarayay." 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
