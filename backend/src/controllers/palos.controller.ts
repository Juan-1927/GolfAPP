import { type Request, type Response } from 'express';
import { PalosModel } from '../models/palos.model.js';

export const obtenerPalos = async (req: Request, res: Response) => {
  const palos = await PalosModel.obtenerTodos();

  res.json(palos);
};

export const obtenerPalosPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const palos = await PalosModel.obtenerPorId(id);

  if (!palos) {
    return res.status(404).json({
      message: 'Palos no encontrado'
    });
  }

  res.json(palos);
};

export const crearPalos = async (req: Request, res: Response) => {
  const palos = await PalosModel.crear(req.body);

  res.status(201).json(palos);
};

export const actualizarPalos = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const palos = await PalosModel.actualizar(id, req.body);

  if (!palos) {
    return res.status(404).json({
      message: 'Palos no encontrado'
    });
  }

  res.json(palos);
};

export const eliminarPalos = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const eliminado = await PalosModel.eliminar(id);

  if (!eliminado) {
    return res.status(404).json({
      message: 'Palos no encontrado'
    });
  }

  res.status(204).send();
};