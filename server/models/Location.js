import pool from '../utils/pool.js';

export default class Location {
  id;
  user_id;
  latitude;
  longitude;
  journalArray;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.latitude = row.latitude;
    this.longitude = row.longitude;
    this.journalArray = row.journal_array;
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
      `SELECT locations.*, COALESCE(json_agg(json_build_object('details', journals.details, 'date', journals.date)), '[]')
      AS journal_array
      FROM locations
      LEFT JOIN journals on journals.location_id = locations.id 
      WHERE user_id= $1
      GROUP BY locations.id`,
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

  static async updateById(id, attrs) {
    const location = await Location.getById(id);
    if (!location) return null;
    const { latitude, longitude } = { ...location, ...attrs };
    const { rows } = await pool.query(
      `
      UPDATE locations 
      SET latitude=$2, longitude=$3 
      WHERE id=$1 RETURNING *`,
      [id, latitude, longitude]
    );
    return new Location(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM locations WHERE id = $1 RETURNING *', [id]);
    return new Location(rows[0]);
  }
}
