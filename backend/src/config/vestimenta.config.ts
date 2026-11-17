import type { Vestimenta } from '../models/vestimenta.model.js';

export const vestimentaDB: Vestimenta[] = [];

let siguienteVestimentaId = 1;

export const obtenerSiguienteVestimentaId = (): number => {
  const id = siguienteVestimentaId;
  siguienteVestimentaId += 1;

  return id;
};
