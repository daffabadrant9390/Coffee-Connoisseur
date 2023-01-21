import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';
import coffeeStoresData from '../data/coffee-stores.json';
import { fetchCoffeeStoresData } from '../lib/services/coffeeStores';

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStoresData();

  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props) {
  const handleOnClickBtnBanner = () => alert('Go to coffee list section!');

  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText="View stores nearby"
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
        <div className={styles.productSection}>
          {!!props.coffeeStores.length && (
            <>
              <h2 className={styles.heading}>Los Angeles Coffee Stores</h2>
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
