const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/extract-m3u8', async (req, res) => {
    try {
        const targetURL = "https://embed.sdfgnksbounce.com/embed2/foxsportspremium.html";
        
        // Obtener el contenido del reproductor embebido
        const response = await axios.get(targetURL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        let m3u8Url = '';
        
        // Buscar la URL del m3u8 en los scripts de la página
        $('script').each((i, script) => {
            const scriptContent = $(script).html();
            const match = scriptContent.match(/(https?:\/\/[^"']+\.m3u8)/);
            if (match) {
                m3u8Url = match[1];
                return false;
            }
        });
        
        if (m3u8Url) {
            res.json({ success: true, url: m3u8Url });
        } else {
            res.status(404).json({ success: false, message: "No se encontró la URL del M3U8" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener la URL", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
