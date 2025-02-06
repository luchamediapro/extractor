const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/extract-m3u8', async (req, res) => {
    try {
        const targetURL = "https://embed.sdfgnksbounce.com/embed2/foxsportspremium.html";

        // Lanzar un navegador con Puppeteer
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        await page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': targetURL,
            'Origin': targetURL,
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
        });
        
        await page.goto(targetURL, { waitUntil: 'networkidle2' });
        
        // Extraer la URL del M3U8 desde el JavaScript de la página
        const m3u8Url = await page.evaluate(() => {
            const scripts = Array.from(document.scripts);
            for (let script of scripts) {
                if (script.textContent.includes('.m3u8')) {
                    const match = script.textContent.match(/(https?:\\/\\/[^"']+\\.m3u8)/);
                    if (match) {
                        return match[1].replace(/\\/g, ''); // Quitar escapes extra
                    }
                }
            }
            return null;
        });
        
        await browser.close();
        
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
