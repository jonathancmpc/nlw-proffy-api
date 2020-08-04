/* Importamos o knex com letra maiúscula para passarmos ele como tipo nos parâmetros das funções que iremos criar */
import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('classes', table => {
    table.increments('id').primary();
    table.string('subject').notNullable();
    table.decimal('cost').notNullable();

    /* Criando o relacionamento entre o professor que vai dar a aula e a lista de usuários/professores */
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('classes');
}