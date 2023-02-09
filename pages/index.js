import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';
import coffeeStoresData from '../data/coffee-stores.json';
import { fetchCoffeeStoresData } from '../lib/services/coffeeStores';
import { useTrackingLocation } from '../lib/hooks/useTrackingLocation';
import { useEffect, useState, useContext } from 'react';
import { ACTION_TYPE } from '../store/action';
import { CoffeeStoresContext } from '../store/coffeeStoresContext';

export async function getStaticProps() {
  //! for the fetching methods which done on the server side, dont use queryString and hit the url from getCoffeeStoresByLocation. This is because when the API fetched on build time, the server is not 100% ready to use the API from /api/getCoffeeStoresByLocation file
  const coffeeStores = await fetchCoffeeStoresData();

  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props) {
  const { locationErrorMsg, handleTrackLocation, isFindingLocation } =
    useTrackingLocation();
  const handleOnClickBtnBanner = () => handleTrackLocation();

  const [errorCoffeeStoresNearMe, setErrorCoffeeStoresNearMe] = useState(null);
  const { state, dispatch } = useContext(CoffeeStoresContext);
  // Get the latLong and coffeeStoresNearMe data coming from CoffeeStoresContext
  const {latLong, coffeeStores: coffeeStoresNearMe} = state;

  useEffect(() => {
    const setCoffeeStoresByLocation = async () => {
      if (!!latLong && !!latLong.latitude && !!latLong.longitude) {
        try {
          const latLongModifier = `${latLong?.latitude},${latLong?.longitude}`;
          // const fetchedCoffeeStores = await fetchCoffeeStoresData(
          //   latLongModifier,
          //   10
          // );

          //! Here we will use the getCoffeeStoresByLocation api to fetch the coffeeStores data using queryString
          const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLongModifier}&limit=10`);
          const fetchedCoffeeStores = await response.json();
          console.log("fetchedCoffeeStores: ", fetchedCoffeeStores);

          dispatch({
            type: ACTION_TYPE.SET_COFFEE_STORES,
            payload: {
              coffeeStores: fetchedCoffeeStores.response
            }
          })
          setErrorCoffeeStoresNearMe(null);
        } catch (error) {
          setErrorCoffeeStoresNearMe(error.message);
        }
      }
    };

    setCoffeeStoresByLocation();
  }, [latLong, latLong?.latitude, latLong?.longitude]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnClickBtnBanner}
        />
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="hero-img"
            width={500}
            height={300}
          />
        </div>
        {locationErrorMsg && (
          <p className={styles.errorMsg}>
            Something went wrong: {locationErrorMsg}
          </p>
        )}
        {errorCoffeeStoresNearMe && (
          <p className={styles.errorMsg}>
            Something went wrong: {errorCoffeeStoresNearMe}
          </p>
        )}
        {/* THIS IS FOR COFFEE STORES IN NEAR ME = DYNAMIC CSR */}
        <div className={styles.productSection}>
          {!!coffeeStoresNearMe.length && coffeeStoresNearMe.length > 0 && (
            <>
              <h2 className={styles.heading}>Coffee Stores Near Me</h2>
              <div className={styles.productCardSection}>
                {(coffeeStoresNearMe || []).map((coffeeStore, idx) => {
                  return (
                    <ProductCard
                      key={`coffee-store-${idx}`}
                      productTitle={coffeeStore.name || ''}
                      imgUrl={
                        coffeeStore?.imgUrl ||
                        'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'
                      }
                      href={`/coffee-stores/${coffeeStore.fsq_id}`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
        {/* THIS IS FOR COFFEE STORES IN JAKARTA = STATIC */}
        <div className={styles.productSection}>
          {!!props.coffeeStores.length && !!props.coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading}>Jakarta Coffee Stores</h2>
              <div className={styles.productCardSection}>
                {(props.coffeeStores || []).map((coffeeStore, idx) => {
                  return (
                    <ProductCard
                      key={`coffee-store-${idx}`}
                      productTitle={coffeeStore.name || ''}
                      imgUrl={
                        coffeeStore?.imgUrl ||
                        'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'
                      }
                      href={`/coffee-stores/${coffeeStore.fsq_id}`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
