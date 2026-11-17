import { Router } from 'express';

import {
  obtenerVestimenta,
  obtenerVestimentaPorId,
  crearVestimenta,
  actualizarVestimenta,
  eliminarVestimenta
} from '../controllers/vestimenta.controller.js';

const router = Router();

router.get('/', obtenerVestimenta);
router.get('/:id', obtenerVestimentaPorId);
router.post('/', crearVestimenta);
router.put('/:id', actualizarVestimenta);
router.delete('/:id', eliminarVestimenta);

export default router;
