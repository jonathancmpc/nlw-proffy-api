import knex from 'knex';
import path from 'path';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite')
  },
  /* Configuração exclusiva do SQLite, para informa-lo que quando não for preenchido um dado o mesmo preencha com NULL por padrão */
  useNullAsDefault: true,
});

export default db;