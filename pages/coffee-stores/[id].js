import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import coffeeStoresData from '../../data/coffee-stores.json';

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  // console.log('params: ', params);

  return {
    props: {
      coffeeStores: coffeeStoresData?.find((coffeeStore) => {
        // Need to convert coffeeStore.id to string because params.id is string
        return coffeeStore.id.toString() === params.id;
      }),
    },
  };
}

export async function getStaticPaths() {
  const paths = coffeeStoresData?.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });

  return {
    paths,
    /**
     if fallback false, it will return 404 page when the data is not found. But when it's true, it will try to get the page even the data is not exist (it will return next js error state)
     */
    fallback: false,
  };
}

const CoffeeStore = (props) => {
  const router = useRouter();
  // grab the coffee ID from url using router.query
  const { id } = router?.query;

  // using isFallback to check if the specifc data is exist, but we are not listed the {params: {id: '...'}} on getStaticPaths
  if (router.isFallback) {
    /* show us loading screen until the isFallback check the data on getStaticProps
      - If the data is exist (the id is found by getStaticProps) => show the page with specific data
      - If the data is not exist => will show error "Failed to load static props"
    */
    return <div>Loading....</div>;
  }

  const { name, address, neighbourhood } = props.coffeeStores;

  console.log('props: ', props);

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <div>
        <h2>{name}</h2>
        <p>{address}</p>
        <p>{neighbourhood}</p>
        <p></p>
        <Link href="/">
          <a>Back to Home Page</a>
        </Link>
      </div>
    </>
  );
};

export default CoffeeStore;
