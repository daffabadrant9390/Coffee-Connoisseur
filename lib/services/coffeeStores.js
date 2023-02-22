import { createApi } from 'unsplash-js';
import useSWR from 'swr';

// Function to return the fetch url of FoursquareAPI to find the nearest coffee stores
const getFetchUrlCoffeeStores = (latLong, query = 'coffee', limitSize = 10) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limitSize}`;
};

// Usage of Unsplash API
// 1. Define the unsplash createApi instance
const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});
// 2. Function to return the fetched unsplash data from specific query (coffee stores)
const getFetchUrlUnplashPhotos = (searchQuery) => {
  return unsplash.search.getPhotos({
    query: searchQuery,
    page: 1,
    perPage: 40,
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
export const fetchCoffeeStoresData = async (
  latlong = '-6.196678809912846,106.82305874679811',
  limit = 6
) => {
  // ? 1. Fetch the unsplash photos with query string coffee store
  const unsplashPhotosResults = await getListUnsplashPhotos('coffee store');

  // ? 2. Fetch the coffee stores data with fetchUrl and options provided
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };
  const fetchCoffeeStores = await fetch(
    getFetchUrlCoffeeStores(latlong, 'coffee', limit),
    options
  );
  const res = await fetchCoffeeStores.json();
  const coffeeStoresData = (await res?.results) || [];

  // ? 3. Return the coffeeStoresData, and add unsplashPhoto as imgUrl on each coffeeStore object
  return coffeeStoresData?.map((coffeeStoreData, idx) => {
    // return {
    //   ...coffeeStoreData,
    //   imgUrl:
    //     unsplashPhotosResults.length > 0 ? unsplashPhotosResults?.[idx] : null,
    // };
    return {
      id: coffeeStoreData?.fsq_id || '',
      name: coffeeStoreData?.name || '',
      address: coffeeStoreData?.location?.address || '',
      region: coffeeStoreData?.location?.region || '',
      imgUrl:
        unsplashPhotosResults.length > 0 ? unsplashPhotosResults?.[idx] : null,
    };
  });
};
