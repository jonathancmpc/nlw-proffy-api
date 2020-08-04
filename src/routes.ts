import { Router } from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';

const routes = Router();
const classesControllers = new ClassesController();
const connectionsController = new ConnectionsController();

/* Rota de Criação das aulas refatorada para o Controller */
routes.post('/classes', classesControllers.create);

/* Rota de listagem das aulas */
routes.get('/classes', classesControllers.index);

/* Rota para criar e mostrar uma conexão */
routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);

export default routes;
