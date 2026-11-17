import type { Equipo } from '../models/equipos.model.js';

export const equiposDB: Equipo[] = [];

let siguienteEquipoId = 1;

export const obtenerSiguienteEquipoId = (): number => {
  const id = siguienteEquipoId;
  siguienteEquipoId += 1;

  return id;
};
