import {
  findCoffeeStoreRecordByFormula,
  getAirtableRecords,
  table,
} from '../../lib/services/airtable';

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { id } = req.body;

      // Get the id from query
      if (!!id) {
        // Find the id in the airtable database
        const findCoffeeStoreRecordById = await findCoffeeStoreRecordByFormula(
          id
        );

        // findCoffeeStoreRecordById returned as array of object
        if (!!findCoffeeStoreRecordById?.length) {
          const coffeeStoreRecord = findCoffeeStoreRecordById[0];
          const { recordId, voting } = coffeeStoreRecord || {};
          const calculateVoting = parseInt(voting) + 1;

          const updatedCoffeeStore = await table.update([
            {
              id: recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (!!updatedCoffeeStore?.length) {
            res.status(200);
            res.json({
              message: 'Coffee store has been updated successfully',
              coffeeStore: getAirtableRecords(updatedCoffeeStore),
            });
          }
        } else {
          res.status(400);
          res.json({
            message: 'The coffee store with the provided id is not found!',
          });
        }
      } else {
        res.status(500);
        res.json({
          message: 'The id is missing from the request!',
        });
      }
    } catch (err) {
      res.status(500);
      res.json({
        message: 'Something went wrong ',
        err,
      });
    }
  } else {
    res.status(400);
    res.json({
      message: 'The request method is wrong',
    });
  }
};

export default favouriteCoffeeStoreById;
