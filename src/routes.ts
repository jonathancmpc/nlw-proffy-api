import { Router } from 'express';
import ClassesController from './controllers/ClassesController';

const routes = Router();
const classesControllers = new ClassesController();

/* Rota de Criação das aulas refatorada para o Controller */
routes.post('/classes', classesControllers.create);

/* Rota de listagem das aulas */
routes.get('/classes', classesControllers.index);

export default routes;
