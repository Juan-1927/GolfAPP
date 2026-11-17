import { pool, transaccion } from '../config/database.js';

export interface Vestimenta {
  id?: number;
  nombre: string;
  marca: string;
  talla: string;
  color: string;
  precio: number;
  fecha_creacion?: Date;
}

const SELECT_VESTIMENTA = `
  SELECT p.id, p.nombre, p.marca, d.talla, d.color, p.precio, p.fecha_creacion
  FROM productos p
  JOIN vestimenta d ON d.producto_id = p.id
`;

export class VestimentaModel {
  static async obtenerTodos(): Promise<Vestimenta[]> {
    const { rows } = await pool.query(`${SELECT_VESTIMENTA} ORDER BY p.id`);

    return rows;
  }

  static async obtenerPorId(id: number): Promise<Vestimenta | null> {
    const { rows } = await pool.query(`${SELECT_VESTIMENTA} WHERE p.id = $1`, [id]);

    return rows[0] ?? null;
  }

  static async crear(prenda: Vestimenta): Promise<Vestimenta> {
    return transaccion(async (client) => {
      const producto = await client.query(
        `INSERT INTO productos (categoria, nombre, marca, precio)
         VALUES ('vestimenta', $1, $2, $3)
         RETURNING id, nombre, marca, precio, fecha_creacion`,
        [prenda.nombre, prenda.marca, prenda.precio]
      );

      const detalle = await client.query(
        `INSERT INTO vestimenta (producto_id, talla, color)
         VALUES ($1, $2, $3)
         RETURNING talla, color`,
        [producto.rows[0].id, prenda.talla, prenda.color]
      );

      return { ...producto.rows[0], ...detalle.rows[0] };
    });
  }

  // Los campos que no se envian conservan su valor actual.
  static async actualizar(
    id: number,
    prenda: Vestimenta
  ): Promise<Vestimenta | null> {
    return transaccion(async (client) => {
      const producto = await client.query(
        `UPDATE productos
         SET nombre = COALESCE($2, nombre),
             marca = COALESCE($3, marca),
             precio = COALESCE($4, precio)
         WHERE id = $1 AND categoria = 'vestimenta'
         RETURNING id, nombre, marca, precio, fecha_creacion`,
        [id, prenda.nombre, prenda.marca, prenda.precio]
      );

      if (producto.rows.length === 0) {
        return null;
      }

      const detalle = await client.query(
        `UPDATE vestimenta
         SET talla = COALESCE($2, talla),
             color = COALESCE($3, color)
         WHERE producto_id = $1
         RETURNING talla, color`,
        [id, prenda.talla, prenda.color]
      );

      return { ...producto.rows[0], ...detalle.rows[0] };
    });
  }

  // ON DELETE CASCADE elimina tambien la fila de la tabla vestimenta.
  static async eliminar(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      `DELETE FROM productos WHERE id = $1 AND categoria = 'vestimenta'`,
      [id]
    );

    return rowCount === 1;
  }
}
