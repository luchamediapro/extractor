const axios = require('axios');
const cheerio = require('cheerio');

async function getDownloadLink(mediafireUrl) {
  try {
    // Hacer la solicitud al enlace de Mediafire
    const response = await axios.get(mediafireUrl);

    // Usar cheerio para parsear el HTML
    const $ = cheerio.load(response.data);

    // Buscar el enlace de descarga en el HTML de Mediafire
    const downloadLink = $('a[href*="download"]').attr('href');
    
    if (downloadLink) {
      // El enlace directo de descarga
      console.log('Enlace de descarga:', downloadLink);
      return downloadLink;
    } else {
      throw new Error('No se encontró un enlace de descarga.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// URL de Mediafire del archivo
const mediafireUrl = 'https://www.mediafire.com/file/example/filename/file';

// Llamada a la función
getDownloadLink(mediafireUrl);
