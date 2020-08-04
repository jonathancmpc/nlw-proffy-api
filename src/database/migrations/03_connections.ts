/* Importamos o knex com letra maiúscula para passarmos ele como tipo nos parâmetros das funções que iremos criar */
import Knex from 'knex';

/* Essa tabela apenas vai anotar o id do professor que o usuário entrou em contato, contando como uma conexão(MVP) */
export async function up(knex: Knex) {
  return knex.schema.createTable('connections', table => {
    table.increments('id').primary();

    /* Criando o relacionamento entre a conexão e o professor(houve conexão com qual professor?) */
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    /* Quando houve essa conexão?(Data) */
    table.timestamp('created_at')
      .defaultTo('now()')
      .notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('connections');
}