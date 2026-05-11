import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  client: 'better-sqlite3',
  connection: {
    filename: path.join(__dirname, 'farmshare.db')
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'db', 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'db', 'seeds')
  }
};
