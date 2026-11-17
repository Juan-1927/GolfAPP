import { pool, transaccion } from '../config/database.js';

export interface Equipo {
  id?: number;
  nombre: string;
  marca: string;
  tipo: string;
  descripcion: string;
  precio: number;
  fecha_creacion?: Date;
}

const SELECT_EQUIPOS = `
  SELECT p.id, p.nombre, p.marca, d.tipo, d.descripcion, p.precio, p.fecha_creacion
  FROM productos p
  JOIN equipos d ON d.producto_id = p.id
`;

export class EquiposModel {
  static async obtenerTodos(): Promise<Equipo[]> {
    const { rows } = await pool.query(`${SELECT_EQUIPOS} ORDER BY p.id`);

    return rows;
  }

  static async obtenerPorId(id: number): Promise<Equipo | null> {
    const { rows } = await pool.query(`${SELECT_EQUIPOS} WHERE p.id = $1`, [id]);

    return rows[0] ?? null;
  }

  static async crear(equipo: Equipo): Promise<Equipo> {
    return transaccion(async (client) => {
      const producto = await client.query(
        `INSERT INTO productos (categoria, nombre, marca, precio)
         VALUES ('equipo', $1, $2, $3)
         RETURNING id, nombre, marca, precio, fecha_creacion`,
        [equipo.nombre, equipo.marca, equipo.precio]
      );

      const detalle = await client.query(
        `INSERT INTO equipos (producto_id, tipo, descripcion)
         VALUES ($1, $2, $3)
         RETURNING tipo, descripcion`,
        [producto.rows[0].id, equipo.tipo, equipo.descripcion]
      );

      return { ...producto.rows[0], ...detalle.rows[0] };
    });
  }

  // Los campos que no se envian conservan su valor actual.
  static async actualizar(id: number, equipo: Equipo): Promise<Equipo | null> {
    return transaccion(async (client) => {
      const producto = await client.query(
        `UPDATE productos
         SET nombre = COALESCE($2, nombre),
             marca = COALESCE($3, marca),
             precio = COALESCE($4, precio)
         WHERE id = $1 AND categoria = 'equipo'
         RETURNING id, nombre, marca, precio, fecha_creacion`,
        [id, equipo.nombre, equipo.marca, equipo.precio]
      );

      if (producto.rows.length === 0) {
        return null;
      }

      const detalle = await client.query(
        `UPDATE equipos
         SET tipo = COALESCE($2, tipo),
             descripcion = COALESCE($3, descripcion)
         WHERE producto_id = $1
         RETURNING tipo, descripcion`,
        [id, equipo.tipo, equipo.descripcion]
      );

      return { ...producto.rows[0], ...detalle.rows[0] };
    });
  }

  // ON DELETE CASCADE elimina tambien la fila de la tabla equipos.
  static async eliminar(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      `DELETE FROM productos WHERE id = $1 AND categoria = 'equipo'`,
      [id]
    );

    return rowCount === 1;
  }
}
