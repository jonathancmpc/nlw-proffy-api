import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
   
  async index(request: Request, response: Response) {
    const filters = request.query;

    /* Declarando os tipos dos dados para parar erro do typescript */
    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    /* Se não existir filtros de matéria ou de dia da semana ou não informou o horário que ele quer marcar 
    a aula na página então retornamos um erro, pq essa rota só pode retornar se tiver uma dessas info */
    if (!filters.week_day || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: 'Missing filters to search classes'
      });
    }

    /* Convertendo a hora para minutos para depois realizar a busca no BD */
    const timeinMinutes = convertHourToMinutes(time);

    /* Selecionando tudo da tabela class_schedule e verificando se existe o class_id da tabela clas_schedule na tabela classes, coluna id. Depois verifica se tem o dia da semana e a hora/minuto na lista destes id/usuários/classes */
    /* Fazendo os filtros no banco de dados, juntando(inner) com a tabela users para trazer o(s) professor(s) e
    selecionando todos os registros das duas tabelas */
    const classes = await db('classes')
      .whereExists(function() {
        this.select('class_schedule.*')
        .from('class_schedule')
        .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
        .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
        .whereRaw('`class_schedule`.`from` <= ??', [timeinMinutes])
        .whereRaw('`class_schedule`.`to` > ??', [timeinMinutes])
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*']);

    return response.json(classes);
  }

  async create(request: Request, response: Response) {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = request.body;
  
    const trx = await db.transaction();
  
    try {
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
  
      return response.status(201).send();
    } catch (err) {
      await trx.rollback(); // Desfazendo a inserção no banco
  
      console.log(err);

      return response.status(400).json({
        error: 'Unexpected error while creating new class'
      });
    }
  }

}