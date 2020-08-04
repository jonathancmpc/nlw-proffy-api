import express from 'express';
import routes from './routes';

const app = express();
/* Pedindo para que o express e o app entenda json */
app.use(express.json());
/* Utilizando as rotas */
app.use(routes);

/* Ouvindo as requisições http na porta 3333 */
app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});