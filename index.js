const express = require('express');
const puppeteer = require('puppeteer-core');  // Usamos puppeteer-core para poder usar un navegador personalizado
const path = require('path');
const cors = require('cors');

// Crear la aplicación Express
const app = express();

// Habilitar CORS para permitir solicitudes de otros dominios
app.use(cors());

// Ruta para obtener el enlace de descarga de Mediafire
app.get('/extract-m3u8/get-mediafire-link', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Se requiere la URL de Mediafire' });
  }

  try {
    // Ruta del navegador en el entorno de Render
    const browserExecutablePath = '/usr/bin/google-chrome'; // Ajusta esta ruta según lo que Render te dé

    // Iniciar Puppeteer con el navegador ya instalado
    const browser = await puppeteer.launch({
      executablePath: browserExecutablePath,  // Usar el binario de Chrome instalado
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Estos argumentos son comunes en entornos de contenedor
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

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
