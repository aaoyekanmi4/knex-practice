require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})
//Get all rows which name contains a search term
function searchByName(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}
searchByName('wings');

//Get the items from a page number when there are six items per page
function paginate(page) {
  const itemsPerPage = 6;
  const offset = itemsPerPage * (page - 1)
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

//Get all items added after a certain day
//#1fb789
function daysSinceAdded(daysAgo) {
  knexInstance
    .select('*')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .then(result => {
      console.log(result)
    })
}


//searchByName('wings');
daysSinceAdded(25);
//paginate(3);

function getTotalsByCategory(){
  knexInstance
  .select('category')
  .sum('price as total')
  .from('shopping_list')
  .groupBy('category')
  .then(result => {
    console.log(result)
  })
}
getTotalsByCategory();
