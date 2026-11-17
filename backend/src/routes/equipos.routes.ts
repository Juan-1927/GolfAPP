import { Router } from 'express';

import {
  obtenerEquipos,
  obtenerEquipoPorId,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo
} from '../controllers/equipos.controller.js';

const router = Router();

router.get('/', obtenerEquipos);
router.get('/:id', obtenerEquipoPorId);
router.post('/', crearEquipo);
router.put('/:id', actualizarEquipo);
router.delete('/:id', eliminarEquipo);

export default router;
