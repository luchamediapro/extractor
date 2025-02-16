// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permitir solicitudes desde cualquier origen (CORS)
app.use(express.json()); // Para parsear el cuerpo de las solicitudes JSON

// Datos de ejemplo (puedes reemplazar esto con una base de datos real)
const movies = [
  {
    id: 1,
    title: 'Inception',
    description: 'Un ladrón que roba secretos corporativos a través del uso de la tecnología de sueños compartidos.',
    poster: 'https://example.com/poster1.jpg',
    year: 2010,
  },
  {
    id: 2,
    title: 'Interstellar',
    description: 'Un grupo de exploradores espaciales viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.',
    poster: 'https://example.com/poster2.jpg',
    year: 2014,
  },
];

// Rutas
// Obtener todas las películas
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

// Obtener detalles de una película por ID
app.get('/api/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = movies.find((m) => m.id === movieId);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: 'Película no encontrada' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de películas!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
