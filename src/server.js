/* eslint-disable no-undef */
const pg = require('pg')
const app = require('./app')
const {PORT, DATABASE_URL} = require('./config');
const knex = require('knex');
pg.defaults.ssl = true;

const db = knex({
  client: 'pg',
  connection : DATABASE_URL,
})


app.set('db', db);


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})