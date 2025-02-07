const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/extract-video/get-dailymotion-link', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Se requiere la URL del video de Dailymotion' });
  }

  try {
    // Lanzamos Puppeteer para obtener el enlace del video
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(),  // Usar la versión de Chromium descargada por Puppeteer
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Esperamos que el enlace de video esté presente en la página
    await page.waitForSelector('video');

    // Extraemos la URL del video
    const videoLink = await page.evaluate(() => {
      const videoElement = document.querySelector('video');
      return videoElement ? videoElement.src : null;
    });

    // Cerramos el navegador
    await browser.close();

    if (videoLink) {
      res.json({ videoLink });
    } else {
      res.status(404).json({ error: 'No se encontró el enlace del video.' });
    }
  } catch (error) {
    console.error('Error al obtener el enlace:', error);
    res.status(500).json({
      error: 'Error al obtener el enlace del video',
      details: error.message
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
