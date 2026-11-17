import express from 'express';
import cors from 'cors';

import palosRoutes from './src/routes/palos.routes.js';
import equiposRoutes from './src/routes/equipos.routes.js';
import vestimentaRoutes from './src/routes/vestimenta.routes.js';
import loginRoutes from './src/routes/login.routes.js';
import { errorHandler } from './src/middleware/error.middleware.js';

const app = express();

app.use(cors());

app.use(express.json());

// En Express 5 req.body es undefined si la peticion no trae cuerpo.
app.use((req, _res, next) => {
  req.body ??= {};
  next();
});

app.get('/', (_req, res) => {
  res.send('GolfAPP API funcionando');
});

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'OK'
  });
});

app.use('/api/v1/palos', palosRoutes);
app.use('/api/v1/equipos', equiposRoutes);
app.use('/api/v1/vestimenta', vestimentaRoutes);
app.use('/api/v1/login', loginRoutes);

app.use(errorHandler);

export default app;