import type { NextFunction, Request, Response } from 'express';

// Codigos de PostgreSQL causados por datos incorrectos en la peticion:
// id o precio no validos, valores fuera de rango, campos obligatorios
// ausentes y restricciones CHECK (por ejemplo, precio negativo).
const ERRORES_DE_DATOS = new Set(['22P02', '22003', '23502', '23514']);

export const errorHandler = (
  err: Error & { code?: string; status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err.code && ERRORES_DE_DATOS.has(err.code)) {
    return res.status(400).json({
      message: 'Los datos enviados no son válidos o están incompletos'
    });
  }

  // Errores 4xx de Express, como un JSON mal formado.
  if (err.status && err.status < 500) {
    return res.status(err.status).json({
      message: err.message
    });
  }

  console.error(err);

  // No se envia err.message al cliente porque puede revelar detalles de la base de datos.
  res.status(500).json({
    message: 'Error interno del servidor'
  });
};
