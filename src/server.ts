import express from 'express';

const app = express();
/* Pedindo para que o express e o app entenda json */
app.use(express.json());

/* Definindo a rota */
app.get('/', (request, response) => {
  return response.json({ message: 'Hello World'});
});

/* Ouvindo as requisições http na porta 3333 */
app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});