import { pool, transaccion } from '../config/database.js';

export interface Palos {
  id?: number;
  nombre: string;
  marca: string;
  tipo: string;
  material: string;
  flexibilidad: string;
  precio: number;
  fecha_creacion?: Date;
}

const SELECT_PALOS = `
  SELECT p.id, p.nombre, p.marca, d.tipo, d.material, d.flexibilidad, p.precio, p.fecha_creacion
  FROM productos p
  JOIN palos d ON d.producto_id = p.id
`;

export class PalosModel {
  static async obtenerTodos(): Promise<Palos[]> {
    const { rows } = await pool.query(`${SELECT_PALOS} ORDER BY p.id`);

    return rows;
  }

  static async obtenerPorId(id: number): Promise<Palos | null> {
    const { rows } = await pool.query(`${SELECT_PALOS} WHERE p.id = $1`, [id]);

    return rows[0] ?? null;
  }

  static async crear(palo: Palos): Promise<Palos> {
    return transaccion(async (client) => {
      const producto = await client.query(
        `INSERT INTO productos (categoria, nombre, marca, precio)
         VALUES ('palo', $1, $2, $3)
         RETURNING id, nombre, marca, precio, fecha_creacion`,
        [palo.nombre, palo.marca, palo.precio]
      );

      const detalle = await client.query(
        `INSERT INTO palos (producto_id, tipo, material, flexibilidad)
         VALUES ($1, $2, $3, $4)
         RETURNING tipo, material, flexibilidad`,
        [producto.rows[0].id, palo.tipo, palo.material, palo.flexibilidad]
      );

      return { ...producto.rows[0], ...detalle.rows[0] };
    });
  }

  // Los campos que no se envian conservan su valor actual.
  static async actualizar(id: number, palo: Palos): Promise<Palos | null> {
    return transaccion(async (client) => {
      const producto = await client.query(
        `UPDATE productos
         SET nombre = COALESCE($2, nombre),
             marca = COALESCE($3, marca),
             precio = COALESCE($4, precio)
         WHERE id = $1 AND categoria = 'palo'
         RETURNING id, nombre, marca, precio, fecha_creacion`,
        [id, palo.nombre, palo.marca, palo.precio]
      );

      if (producto.rows.length === 0) {
        return null;
      }

      const detalle = await client.query(
        `UPDATE palos
         SET tipo = COALESCE($2, tipo),
             material = COALESCE($3, material),
             flexibilidad = COALESCE($4, flexibilidad)
         WHERE producto_id = $1
         RETURNING tipo, material, flexibilidad`,
        [id, palo.tipo, palo.material, palo.flexibilidad]
      );

      return { ...producto.rows[0], ...detalle.rows[0] };
    });
  }

  // ON DELETE CASCADE elimina tambien la fila de la tabla palos.
  static async eliminar(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      `DELETE FROM productos WHERE id = $1 AND categoria = 'palo'`,
      [id]
    );

    return rowCount === 1;
  }
}
