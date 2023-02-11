import { table, getAirtableRecords } from '../../lib/services/airtable';

const createCoffeeStore = async (req, res) => {
  // Only run the code when the request method is POST
  if (req.method === 'POST') {
    // ? Find the specific ID of a coffeeStore inside airtable database.(using method select)
    // ? - if exist, just return the data to the user
    // ? - if doesnt exist, create a new store / row with the new coffeeStores data

    // get the request body like id, name, address, region, voting, and imgUrl
    const { id, name, address, region, voting, imgUrl } = req.body;

    try {
      if (!!id) {
        const findCoffeeStoresRecordById = await table
          .select({
            // This function will be returned in Array form
            filterByFormula: `id="${id}"`,
          })
          .firstPage(); // Since we only have 1 page, use firstPage

        if (!!findCoffeeStoresRecordById.length) {
          // return the data to the user
          const coffeeStoreRecord = getAirtableRecords(
            findCoffeeStoresRecordById
          );

          res.json({
            message: 'Coffee Stores Found',
            coffeeStore: coffeeStoreRecord,
          });
        } else {
          if (!!name) {
            // create a new store of coffee store
            const newCoffeeStore = await table.create([
              {
                fields: {
                  // Get the fields data from request body
                  id,
                  name,
                  address,
                  region,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const newCoffeeStoreRecord = getAirtableRecords(newCoffeeStore);

            res.json({
              message: 'Create new coffee store record!',
              coffeeStore: newCoffeeStoreRecord,
            });
            return newCoffeeStoreRecord;
          } else {
            res.status(400);
            res.json({
              message: 'id or name is missing from request body',
            });
          }
        }
      } else {
        res.status(400);
        res.json({
          message: 'id is missing from request body',
        });
      }
    } catch (err) {
      console.error('Error finding and creating coffeeStoreRecord', err);
      res.status(500);
      res.json({
        message: 'Error finding and creating coffeeStoreRecord',
        err,
      });
    }
  } else {
    res.json({
      message: 'Request method is wrong',
    });
  }
};

export default createCoffeeStore;
