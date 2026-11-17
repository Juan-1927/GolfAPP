import { type Request, type Response } from 'express';
import { EquiposModel } from '../models/equipos.model.js';

export const obtenerEquipos = async (_req: Request, res: Response) => {
  const equipos = await EquiposModel.obtenerTodos();

  res.json(equipos);
};

export const obtenerEquipoPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const equipo = await EquiposModel.obtenerPorId(id);

  if (!equipo) {
    return res.status(404).json({
      message: 'Equipo no encontrado'
    });
  }

  res.json(equipo);
};

export const crearEquipo = async (req: Request, res: Response) => {
  const equipo = await EquiposModel.crear(req.body);

  res.status(201).json(equipo);
};

export const actualizarEquipo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const equipo = await EquiposModel.actualizar(id, req.body);

  if (!equipo) {
    return res.status(404).json({
      message: 'Equipo no encontrado'
    });
  }

  res.json(equipo);
};

export const eliminarEquipo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const eliminado = await EquiposModel.eliminar(id);

  if (!eliminado) {
    return res.status(404).json({
      message: 'Equipo no encontrado'
    });
  }

  res.status(204).send();
};
