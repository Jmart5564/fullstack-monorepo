-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS journals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL
);

CREATE TABLE locations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT,
  latitude DECIMAL(18,4),
  longitude DECIMAL(18,4),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE journals (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  location_id BIGINT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  details VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);