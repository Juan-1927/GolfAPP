import { Pool, types, type PoolClient } from 'pg';

// Por defecto pg devuelve BIGINT y NUMERIC como texto. La API y el frontend
// trabajan con numeros, asi que `id` y `precio` se convierten aqui.
types.setTypeParser(types.builtins.INT8, Number);
types.setTypeParser(types.builtins.NUMERIC, Number);

export const pool = new Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? 'golfapp',
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? ''
});

// Sin este listener, un error en una conexion inactiva terminaria el proceso.
pool.on('error', (error) => {
  console.error('Error inesperado en la conexion con PostgreSQL:', error);
});

// Ejecuta varias consultas como una sola operacion: si una falla, se revierten todas.
export const transaccion = async <T>(
  trabajo: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const resultado = await trabajo(client);
    await client.query('COMMIT');

    return resultado;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
