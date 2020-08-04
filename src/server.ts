import express from 'express';

const app = express();

const users = [
  {
    name: 'Jonathan',
    age: 29,
  },
  {
    name: 'Kelly',
    age: 29,
  }
];

/* Definindo a rota */
app.get('/users', (request, response) => {
  return response.json(users);
});

/* Ouvindo as requisições http na porta 3333 */
app.listen(3333);