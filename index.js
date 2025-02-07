const express = require('express');
const puppeteer = require('puppeteer');  // Usamos Puppeteer directamente
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/extract-m3u8/get-mediafire-link', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Se requiere la URL de Mediafire' });
  }

  try {
    // Establecer la ruta del caché de Puppeteer
    const cachePath = path.join(__dirname, '.cache', 'puppeteer');

    // Iniciar Puppeteer, sin necesidad de especificar la ruta del navegador
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      userDataDir: cachePath,  // Especifica el directorio de caché
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Esperar a que el enlace de descarga esté visible
    await page.waitForSelector('a[href*="download"]');

    // Obtener el enlace de descarga
    const downloadLink = await page.evaluate(() => {
      const link = document.querySelector('a[href*="download"]');
      return link ? link.href : null;
    });

    // Cerrar el navegador
    await browser.close();

    // Verificar si se encontró el enlace de descarga
    if (downloadLink) {
      res.json({ downloadLink });
    } else {
      res.status(404).json({ error: 'Enlace de descarga no encontrado.' });
    }
  } catch (error) {
    console.error('Error al obtener el enlace:', error);
    res.status(500).json({
      error: 'Error al obtener el enlace de descarga',
      details: error.message,
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
