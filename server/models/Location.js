import pool from '../utils/pool.js';

export default class Location {
  id;
  user_id;
  latitude;
  longitude;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.latitude = row.latitude;
    this.longitude = row.longitude;
  }

  static async insert({ user_id, latitude, longitude }) {
    const { rows } = await pool.query(
      `
        INSERT INTO locations (user_id, latitude, longitude)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [user_id, latitude, longitude]
    );

    return new Location(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      'SELECT * from locations where user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    return rows.map((location) => new Location(location));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM locations
      WHERE id=$1
      `,
      [id]
    );
    if (!rows[0]) {
      return null;
    }
    return new Location(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM locations WHERE id = $1 RETURNING *', [id]);
    return new Location(rows[0]);
  }
}
