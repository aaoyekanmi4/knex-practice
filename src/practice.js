const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: 'postgresql://dunder_mifflin@localhost/knex-practice',
})
