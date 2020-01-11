const knex = require("knex");

const ItemService = require("../src/shopping-list_service");
describe(`Items Service Object`, function() {
  let db;
  let testItems = [
    {
      id: 1,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      name: "Prime Rib",
      price:"45.50",
      checked:false,
      category:"Main"

    },
    {
      id: 2,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      name: "Pasta",
      price:"1.50",
      checked:false,
      category:"Main"

    },
    {
      id: 3,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      name: "Tangerines",
      price:"4.59",
      checked:false,
      category:"Main"

    }
  ];
  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });
  before(() => db("shopping_list").truncate());

  afterEach(() => db("shopping_list").truncate());

  after(() => db.destroy());

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItems);
    });
    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      return ItemService.getAllItems(db).then(actual => {
        expect(actual).to.eql(testItems);
      });
    });
    it(`getById() resolves an items by id from 'shopping_list' table`, () => {
      const thirdId = 3;
      const thirdTestItems = testItems[thirdId - 1];
      return ItemService.getById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          id: thirdId,
          name: thirdTestItems.name,
          price: thirdTestItems.price,
          date_added: thirdTestItems.date_added,
          category:thirdTestItems.category,
          checked:thirdTestItems.checked
        });
      });
    });

    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3;
      return ItemService.deleteItem(db, itemId)
        .then(() => ItemService.getAllItems(db))
        .then(allItems => {
          // copy the test items array without the "deleted" item
          const expected = testItems.filter(
            item => item.id !== itemId
          );
          expect(allItems).to.eql(expected);
        });
    });

    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: "updated name",
        price: "57.45",
        date_added: new Date(),
        checked:false,
        category:"Main"
      };
      return ItemService.updateItem(
        db,
        idOfItemToUpdate,
        newItemData
      )
        .then(() => ItemService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData
          });
        });
    });
  });

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ItemService.getAllItems(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
    it(`insertItems() inserts an item and resolves the item with an 'id'`, () => {
      const newItem = {
        name: "Test new name",
        price: "97.85",
        date_added: new Date("2020-01-01T00:00:00.000Z"),
        category:'Main',
        checked:false,

      };

      return ItemService.insertItem(db, newItem).then(actual => {
        expect(actual).to.eql({
          id: 1,
          name: newItem.name,
          category: newItem.category,
          date_added: newItem.date_added,
          price:newItem.price,
          checked:newItem.checked
        });
      });
    });
  });
});