import { createApi } from 'unsplash-js';

// Function to return the fetch url of FoursquareAPI to find the nearest coffee stores
const getFetchUrlCoffeeStores = (latLong, query = 'coffee', limitSize = 10) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limitSize}`;
};

// Usage of Unsplash API
// 1. Define the unsplash createApi instance
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});
// 2. Function to return the fetched unsplash data from specific query (coffee stores)
const getFetchUrlUnplashPhotos = (searchQuery) => {
  return unsplash.search.getPhotos({
    query: searchQuery,
    page: 1,
    perPage: 10,
  });
};
// 3. Function to get all the unsplashPhotos list, then return the specific photos URLs
const getListUnsplashPhotos = async (searchQuery) => {
  const unsplashPhotos = await getFetchUrlUnplashPhotos(searchQuery);
  const photosResults = unsplashPhotos?.response?.results?.map(
    (unsplashPhoto) => unsplashPhoto?.urls['small']
  );
  return photosResults;
};

// Function to return the coffee stores data, which will be consumed by the getStaticProps and Paths
export const fetchCoffeeStoresData = async () => {
  const unsplashPhotosResults = await getListUnsplashPhotos('coffee store');
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };

  const fetchCoffeeStores = await fetch(
    getFetchUrlCoffeeStores(
      '-6.220303323683214%2C106.81116820370835',
      'coffee',
      6
    ),
    options
  );
  const res = await fetchCoffeeStores.json();
  const coffeeStoresData = (await res?.results) || [];
  return coffeeStoresData?.map((coffeeStoreData, idx) => {
    return {
      ...coffeeStoreData,
      imgUrl:
        unsplashPhotosResults.length > 0 ? unsplashPhotosResults?.[idx] : null,
    };
  });
};
