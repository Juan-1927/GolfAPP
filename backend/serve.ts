// Debe ser el primer import: los import se ejecutan antes que el resto del
// archivo, y database.ts necesita las variables de .env al cargarse.
import 'dotenv/config';

import app from './app.js';
import { pool } from './src/config/database.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query('SELECT 1 FROM productos LIMIT 1');
    console.log(`Conectado a PostgreSQL (base de datos: ${process.env.DB_NAME})`);
  } catch (error) {
    console.error(
      'No se pudo usar la base de datos. Revisa los datos de .env y que hayas ejecutado database/schema.sql:',
      error
    );
    process.exit(1);
  }

  // Express 5 pasa aqui los errores de arranque, como un puerto ya ocupado.
  app.listen(PORT, (error) => {
    if (error) {
      console.error(`No se pudo iniciar la API en el puerto ${PORT}:`, error.message);
      process.exit(1);
    }

    console.log(`API ejecutandose en http://localhost:${PORT}`);
  });
}

startServer();
