import { type Request, type Response } from 'express';
import { VestimentaModel } from '../models/vestimenta.model.js';

export const obtenerVestimenta = async (_req: Request, res: Response) => {
  const prendas = await VestimentaModel.obtenerTodos();

  res.json(prendas);
};

export const obtenerVestimentaPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const prenda = await VestimentaModel.obtenerPorId(id);

  if (!prenda) {
    return res.status(404).json({
      message: 'Prenda no encontrada'
    });
  }

  res.json(prenda);
};

export const crearVestimenta = async (req: Request, res: Response) => {
  const prenda = await VestimentaModel.crear(req.body);

  res.status(201).json(prenda);
};

export const actualizarVestimenta = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const prenda = await VestimentaModel.actualizar(id, req.body);

  if (!prenda) {
    return res.status(404).json({
      message: 'Prenda no encontrada'
    });
  }

  res.json(prenda);
};

export const eliminarVestimenta = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const eliminado = await VestimentaModel.eliminar(id);

  if (!eliminado) {
    return res.status(404).json({
      message: 'Prenda no encontrada'
    });
  }

  res.status(204).send();
};
