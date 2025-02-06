const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

// Crear la aplicación Express
const app = express();

// Habilitar CORS para permitir solicitudes de otros dominios (si es necesario)
app.use(cors());

// Ruta para obtener el enlace de descarga de Mediafire
app.get('/extract-m3u8/get-mediafire-link', async (req, res) => {
  // Obtener la URL de Mediafire desde la consulta
  const { url } = req.query;

  // Verificar si se proporcionó la URL
  if (!url) {
    return res.status(400).json({ error: 'Se requiere la URL de Mediafire' });
  }

  try {
    // Usar ProxyCrawl como proxy (reemplaza YOUR_API_KEY con tu clave real)
    const proxyUrl = `https://api.crawlbase.com/?token=tc6wsSxJV3UjEWhyvd95EQ&url=https%3A%2F%2Fgithub.com%2Fcrawlbase%3Ftab%3Drepositories`;

    // Realizar la solicitud HTTP a Mediafire a través del proxy
    const response = await axios.get(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });

    // Imprimir el HTML completo de la respuesta para depurar
    console.log(response.data); // Esto te permitirá ver todo el contenido que estás recibiendo de Mediafire.

    // Cargar el contenido HTML usando cheerio
    const $ = cheerio.load(response.data);

    // Buscar todos los enlaces <a> y mostrar sus href
    $('a').each((i, el) => {
      console.log($(el).attr('href'));  // Esto imprimirá todos los href en la página
    });

    // Intentar buscar el enlace de descarga utilizando el texto 'Download' en el enlace
    const downloadLink = $('a:contains("Download")').attr('href');

    // Verificar si se encontró el enlace de descarga
    if (downloadLink) {
      res.json({ downloadLink });
    } else {
      res.status(404).json({ error: 'Enlace de descarga no encontrado.' });
    }
  } catch (error) {
    // Manejar errores y mostrar más detalles
    console.error('Error al obtener la página:', error);
    res.status(500).json({
      error: 'Error al obtener el enlace de descarga',
      details: error.message
    });
  }
});

// Definir el puerto para que la aplicación escuche
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
