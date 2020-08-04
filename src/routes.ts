import { Router } from 'express';
import db from './database/connection';
import convertHourToMinutes from './utils/convertHourToMinutes';

const routes = Router();

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

/* Definindo a rota */
routes.post('/classes', async (request, response) => {
  const { name, avatar, whatsapp, bio, subject, cost, schedule } = request.body;

  const trx = await db.transaction();

  /* Inserindo os dados no banco de dados, o insert sempre retorna o id dos itens que foram incluídos */
  const insertedUsersIds = await trx('users').insert({
    name, 
    avatar, 
    whatsapp, 
    bio
  });

    /* Pegando o primeiro id retornado pelo insert realizado na tabela de usuários(lembrando que é o primeiro id realizado a cada requisição e não o primeiro id da tabela) */
  const user_id = insertedUsersIds[0];

  const insertedClassesIds = await trx('classes').insert({
    subject,
    cost,
    user_id
  });

  const class_id = insertedClassesIds[0];

  /* Convertendo a hora em minutos antes de inserir no banco, para isso foi criada uma função em utils */
  const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
    return {
      week_day: scheduleItem.week_day,
      from: convertHourToMinutes(scheduleItem.from),
      to: convertHourToMinutes(scheduleItem.to),
      class_id,
    };
  });

  /* Inserimos então no banco de dados com os valores formatados, e passamos a variável classSchedule pq já está no formato que o banco espera */
  await trx('class_schedule').insert(classSchedule);

  await trx.commit();

  return response.send();
});

export default routes;
