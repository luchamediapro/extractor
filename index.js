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
    // Realizar la solicitud HTTP para obtener el contenido de la página de Mediafire
    const response = await axios.get(url);
    const $ = cheerio.load(response.data); // Cargar el contenido HTML

    // Buscar el enlace de descarga en la página (esto puede variar dependiendo de la estructura de la página)
    const downloadLink = $('a[href*="download"]').attr('href');

    // Verificar si se encontró el enlace de descarga
    if (downloadLink) {
      res.json({ downloadLink });
    } else {
      res.status(404).json({ error: 'Enlace de descarga no encontrado.' });
    }
  } catch (error) {
    // Manejar errores en caso de fallo en la solicitud o scraping
    res.status(500).json({ error: 'Error al obtener el enlace de descarga' });
  }
});

// Definir el puerto para que la aplicación escuche
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
