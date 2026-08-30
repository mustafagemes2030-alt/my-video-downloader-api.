const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    
    if (!videoUrl) {
        return res.json({ success: false, error: "Fadlan soo sii link-ga muuqaalka!" });
    }

    exec(`yt-dlp -g "${videoUrl}"`, (error, stdout, stderr) => {
        if (error) {
            return res.json({ success: false, error: error.message });
        }
        res.json({ success: true, download_link: stdout.trim() });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API-gaagu wuxuu ku shaqaynayaa Port ${PORT}!`));
