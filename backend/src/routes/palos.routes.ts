import { Router } from 'express';

import {
  obtenerPalos,
  obtenerPalosPorId,
  crearPalos,
  actualizarPalos,
  eliminarPalos
} from '../controllers/palos.controller.js';

const router = Router();

router.get('/', obtenerPalos);

router.get('/:id', obtenerPalosPorId);

router.post('/', crearPalos);

router.put('/:id', actualizarPalos);

router.delete('/:id', eliminarPalos);

export default router;
