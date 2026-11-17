import { type Request, type Response } from 'express';
import { LoginModel } from '../models/login.model.js';

export const iniciarSesion = async (req: Request, res: Response) => {
  const { usuario, contrasena } = req.body;

  const valido = await LoginModel.validar(usuario, contrasena);

  if (!valido) {
    return res.status(401).json({
      message: 'Usuario o contraseña incorrectos'
    });
  }

  res.json({
    message: 'Inicio de sesión correcto',
    usuario
  });
};
