export default function convertHourToMinutes(time: string) {
  /* Faz um split(retorna array) pelo dois pontos, converte tudo em número(.map(Number)) */
  /* Faz uma desestruturação, onde na primeira posição criamos uma variável 'hour' e na segunda 'minute'  */
  const [hour, minutes] = time.split(':').map(Number);
  /* Então pegamos a hora e multiplicamos por 60, transformando ela em minutos */
  const timeInMinutes = (hour * 60) + minutes;

  return timeInMinutes;
}