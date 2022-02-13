const express = require('express');
const app = express();
const cors = require('cors');



const client = require('./config/psqlClient');
const persons = require('./routes/persons');
const words = require('./routes/words')
const games = require('./routes/games')



app.use(express.json());
app.use(cors());
app.use("/person", persons);
app.use("/word", words);
app.use("/games", games)


// games = [{
//    gameid,       id gry
//    word,         słowo wylosowane
//    guesses,      odsłoniete litery
//    num,          ilość strzałów błędnych
//    letters       litery użyte
//    help          boolen, potrzebna pomoc
// }]
client
.connect()
.then(() => {
  console.log('Connected to PostgreSQL');

  client.query(`
  CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    nick VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS word (
    id SERIAL PRIMARY KEY,
    text VARCHAR(60) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS game (
    id VARCHAR(60) NOT NULL,
    word VARCHAR(60) NOT NULL,
    guesses VARCHAR(60) NOT NULL,
    num VARCHAR(60) NOT NULL,
    letters VARCHAR(60) NOT NULL,
    result VARCHAR(60) NOT NULL
  );
  
  `);

  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`API server listening at http://192.168.8.124:${port}`);
  });
})
.catch(err => console.error('Connection error', err.stack));