import type { Palos } from '../models/palos.model.js';
 
export const palosDB: Palos[] = [
  {
    id: 1,
    nombre: 'Stealth 2',
    marca: 'TaylorMade',
    tipo: 'Driver',
    material: 'Grafito',
    flexibilidad: 'Regular',
    precio: 599,
    fecha_creacion: new Date('2026-10-05T18:00:00.000Z')
  },
  {
    id: 2,
    nombre: 'Paradym',
    marca: 'Callaway',
    tipo: 'Madera',
    material: 'Grafito',
    flexibilidad: 'Regular',
    precio: 349,
    fecha_creacion: new Date('2026-10-05T18:05:00.000Z')
  }
];
 
let siguienteId = palosDB.length + 1;
 
export const obtenerSiguienteId = (): number => {
  const id = siguienteId;
  siguienteId += 1;
 
  return id;
};