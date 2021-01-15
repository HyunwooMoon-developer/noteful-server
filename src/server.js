/* eslint-disable no-undef */
const app = require('./app')
const {PORT, DB_URL} = require('./config');
const knex = require('knex');
//onst pg = require("pg")

//pg.defaults.ssl = true
//process.env.NODE_ENV === 'production'


const db = knex({
  client: 'pg',
  connection : DB_URL,
})


app.set('db', db);


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})