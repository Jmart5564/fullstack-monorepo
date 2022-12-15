import pool from '../utils/pool.js';

export default class Journal {
  id;
  location_id;
  date;
  details;

  constructor(row) {
    this.id = row.id;
    this.location_id = row.location_id;
    this.details = row.details;
    this.date = row.date;
  }

  static async getAll(location_id) {
    console.log('locationID', location_id);
    const { rows } = await pool.query(
      `SELECT * from journals where location_id = $1 ORDER BY created_at DESC`,
      [location_id]
    );
    return rows.map((journal) => new Journal(journal));
  }

  static async insert({ location_id, details, date }) {
    const { rows } = await pool.query(
      `
        INSERT INTO journals (location_id, details, date)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [location_id, details, date]
    );
    return new Journal(rows[0]);
  }
}
