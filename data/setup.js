// const fs = require('fs').promises;
import fs from 'node:fs/promises';
import path from 'node:path';
// import url from 'node:url';
// const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default function (pool) {
  return fs
    .readFile(path.resolve(`./sql/setup.sql`), { encoding: 'utf-8' })
    .then((sql) => pool.query(sql))
    .then(() => {
      if (process.env.NODE_ENV !== 'test') {
        console.info('✅ Database setup complete!');
      }
    })
    .catch((error) => {
      const dbNotFound = error.message.match(/database "(.+)" does not exist/i);

      if (dbNotFound) {
        const [err, db] = dbNotFound;
        console.error('❌ Error: ' + err);
        console.info(`Try running \`createdb -U postgres ${db}\` in your terminal`);
      } else {
        console.error(error);
        console.error('❌ Error: ' + error.message);
      }
    });
}
