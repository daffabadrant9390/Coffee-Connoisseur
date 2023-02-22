import { findCoffeeStoreRecordByFormula } from '../../lib/services/airtable';

const getCoffeeStoreById = async (req, res) => {
  if (req.method === 'GET') {
    // const { id } = req.body; // We cant get id from req.body since we add id on url
    const { id } = req.query; // use this instead because we add the id on url

    if (!!id) {
      const findCoffeeStoreRecordById = await findCoffeeStoreRecordByFormula(
        id
      );

      console.log('findCoffeeStoreRecordById: ', findCoffeeStoreRecordById);

      if (!!findCoffeeStoreRecordById) {
        res.status(200);
        res.json({
          message: 'Specific Coffe Store found!',
          coffeeStore: findCoffeeStoreRecordById,
        });

        return findCoffeeStoreRecordById;
      } else {
        res.status(400);
        res.json({
          message: 'The specific coffee store not found',
        });
      }
    } else {
      res.status(400);
      res.json({
        message: 'Id is missing',
      });
    }
  } else {
    res.json({
      message: 'Request method is wrong',
    });
  }
};

export default getCoffeeStoreById;
