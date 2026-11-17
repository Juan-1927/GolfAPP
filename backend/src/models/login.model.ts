// Usuario y contraseña fijos (hardcodeados). Más adelante se pueden
// guardar en una tabla de la base de datos.
const USUARIO = 'juan';
const CONTRASENA = '12345';

export class LoginModel {
  // Devuelve true si el usuario y la contraseña son correctos.
  static async validar(usuario: string, contrasena: string): Promise<boolean> {
    return usuario === USUARIO && contrasena === CONTRASENA;
  }
}
