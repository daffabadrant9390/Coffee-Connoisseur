import { fetchCoffeeStoresData } from '../../lib/services/coffeeStores';

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    // Grab the latLong and limit from the URL using req.query
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStoresData(latLong, limit);
    res.status(200);
    res.json({
      response,
    });
  } catch (err) {
    console.error(`Error Occured: `, err);
    res.status(500);
    res.json({
      message: 'Oh no!, something went wrong on the server!.',
      err,
    });
  }
};

export default getCoffeeStoresByLocation;
