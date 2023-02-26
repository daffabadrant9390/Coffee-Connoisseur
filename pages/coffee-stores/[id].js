import { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import coffeeStoresData from '../../data/coffee-stores.json';
import nearMeIcon from '../../public/icons/nearMe.svg';
import starIcon from '../../public/icons/star.svg';
import locationOnIcon from '../../public/icons/locationOn.svg';
import arrowBackIcon from '../../public/icons/arrowBack.svg';
import cx from 'classnames';
import { fetchCoffeeStoresData } from '../../lib/services/coffeeStores';
import { CoffeeStoresContext } from '../../store/coffeeStoresContext';
import { isObjectEmpty } from '../../utils/isObjectEmpty';
import useSWR from 'swr';
import styles from './index.module.scss';

export async function getStaticProps(staticinitialProps) {
  const id = staticinitialProps?.params?.id;
  const coffeeStoresData = await fetchCoffeeStoresData();
  const findCoffeeStore = coffeeStoresData?.find(
    (coffeeStore) => coffeeStore?.id?.toString() === id?.toString()
  );

  return {
    props: {
      coffeeStore: findCoffeeStore ? findCoffeeStore : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStoresData = await fetchCoffeeStoresData();

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
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const id = router.query.id;

  // Set initial value of coffeeStore to be the data from getStaticProps. If not exist, use the data from useContext and airtable
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [voting, setVoting] = useState(0);

  const { state } = useContext(CoffeeStoresContext);
  const { coffeeStores: coffeeStoresNearMe } = state;

  //! Function to create new coffee store data on airtable
  // - Create new coffee store on airtable for the data on getStaticProps and context
  // - When the data exist on airtable, no need to create new record, just return the existed record
  const handleCreateCoffeeStoreAirtable = async (coffeeStore) => {
    const { id, name, imgUrl, address, region } = coffeeStore || {};

    const response = await fetch('/api/createCoffeeStore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        name,
        imgUrl,
        voting: 0,
        address: address || '',
        region: region || '',
      }),
    });
    const dbCoffeeStore = await response.json();
  };

  //! Function to get the coffee store record from airtable database by coffeeStore ID
  // - If the coffee store id is not found on getStaticProps and context data, query the data from airtable database
  const handleGetCoffeeStoreByIdAirtable = async (coffeeStoreQueryId) => {
    const response = await fetch(
      `/api/getCoffeeStoreById?id=${coffeeStoreQueryId}`
    );
    const dbCoffeeStore = await response.json();
    return dbCoffeeStore;
  };

  //! Function to update the voting property on specific coffee store by using coffeeStore ID
  const handleButtonUpVoteClick = async () => {
    const response = await fetch('/api/favouriteCoffeeStoreById', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const data = await response.json();
    if (!!data) {
      const updatedCoffeeStoreData = data?.coffeeStore?.[0] || {};
      const { voting: updatedVoting } = updatedCoffeeStoreData;
      setVoting(updatedVoting);
    }
  };

  useEffect(() => {
    /*
      - If the initialProps.cofffeeStore (coffee store from getStaticProps) is empty, fetch data from context or airtable
      - If the coffee store from getStaticProps is exist, add the data to airtable database too
    */
    if (initialProps.coffeeStore && isObjectEmpty(initialProps.coffeeStore)) {
      /* 
        - Check the data inside context. If exist, get the data from there and also add the data into airtable database 
        - If the data inside context isnt available (because page got reloaded), fetch the data from airtable database
      */
      if (!!coffeeStoresNearMe?.length) {
        const specificCoffeeStoreContext = coffeeStoresNearMe?.find(
          (coffeeStore) =>
            coffeeStore?.id?.toString() === router.query?.id?.toString()
        );

        if (!!specificCoffeeStoreContext) {
          setCoffeeStore(specificCoffeeStoreContext);
          handleCreateCoffeeStoreAirtable(specificCoffeeStoreContext);
        }
      } else {
        const getCoffeeStoreAirtable = async () => {
          // Retrieve the data from airtable if exist
          const specificCoffeeStoreAirtable =
            await handleGetCoffeeStoreByIdAirtable(id);
          const { coffeeStore: specificCoffeeStoreAirtableRecord } =
            specificCoffeeStoreAirtable;

          if (
            !!specificCoffeeStoreAirtableRecord &&
            !!specificCoffeeStoreAirtableRecord.length
          ) {
            setCoffeeStore(specificCoffeeStoreAirtableRecord[0]);
          }
        };
        getCoffeeStoreAirtable();
      }
    } else {
      // Add SSG data to airtable database
      handleCreateCoffeeStoreAirtable(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore, coffeeStoresNearMe]);

  const { name, address, region, imgUrl } = coffeeStore || {};

  //! Fetch the data using SWR (Stale While Revalidate) method to get auto updated voting data
  // - Need SWR to get auto rendering & Refetching the coffeeStore data when there is an update from different browser / tab
  // - When the main tab update the voting value, the same page from different browser will be updated too automatically
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (!!data) {
      // Set the coffeeStore state using data from SWR
      setCoffeeStore(data?.coffeeStore?.[0] || {});
      // Set the voting state using voting data from SWR
      setVoting(data?.coffeeStore?.[0]?.voting || 0);
    }
  }, [data]);

  // if SWR return error
  if (error) {
    return (
      <div>
        <p>Something went wrong ({error})</p>
      </div>
    );
  }

  // using isFallback to check if the specifc data is exist, but we are not listed the {params: {id: '...'}} on getStaticPaths
  if (router.isFallback) {
    /* show us loading screen until the isFallback check the data on getStaticinitialinitialProps
        - If the data is exist (the id is found by getStaticinitialProps) => show the page with specific data
        - If the data is not exist => will show error "Failed to load static initialProps"
      */
    return <div>Loading....</div>;
  }

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.product_detail_container}>
        <div className={styles.back_to_home}>
          <Link href="/">
            <a>
              <Image src={arrowBackIcon} width={24} height={24} alt="" />
              Back to home
            </a>
          </Link>
        </div>
        <div className={styles.product_detail_wrapper}>
          <div className={styles.product_title_image}>
            <h1 className={styles.title}>{name || ''}</h1>
            <div className={styles.product_img_wrapper}>
              <Image
                className={styles.product_img}
                src={
                  imgUrl ||
                  'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'
                }
                alt=""
                width={600}
                height={360}
              />
            </div>
          </div>
          <div className={cx('glass', styles.location_rating_vote)}>
            <div className={styles.detail_item}>
              <Image
                src={locationOnIcon}
                alt=""
                width={24}
                height={24}
                className={styles.detail_icon}
              />
              <p className={styles.detail_text}>{address || ''}</p>
            </div>
            <div className={styles.detail_item}>
              <Image src={nearMeIcon} alt="" width={24} height={24} />
              <p className={styles.detail_text}>{region || ''}</p>
            </div>
            <div className={styles.detail_item}>
              <Image src={starIcon} alt="" width={24} height={24} />
              <p className={styles.detail_text}>{voting}</p>
            </div>
            {/* {isVoted ? (
              <button
                className={cx(styles.btn, styles.remove_vote_btn)}
                onClick={() => {
                  setVoting(voting - 1);
                  setIsVoted(false);
                }}
              >
                Remove vote
              </button>
            ) : (
              <button
                className={cx(styles.btn, styles.up_vote_btn)}
                onClick={() => {
                  setRating(rating + 1);
                  setIsVoted(true);
                }}
              >
                Up vote!
              </button>
            )} */}
            <button
              className={cx(styles.btn, styles.up_vote_btn)}
              onClick={handleButtonUpVoteClick}
            >
              Up vote!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoffeeStore;
