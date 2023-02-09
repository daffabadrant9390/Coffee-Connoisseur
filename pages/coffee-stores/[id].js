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

import styles from './index.module.scss';
// import styles from './index.module.css';

export async function getStaticProps(staticinitialProps) {
  const id = staticinitialProps?.params?.id;
  const coffeeStoresData = await fetchCoffeeStoresData();
  const findCoffeeStore = coffeeStoresData?.find(
    (coffeeStore) => coffeeStore?.fsq_id?.toString() === id?.toString()
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
        id: coffeeStore.fsq_id.toString(),
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
  // Grab the id from url
  const router = useRouter();
  const id = router.query.id;

  // Set initial value of coffeeStore to be the data from getStaticProps. If not exist, use the data from useContext
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [isVoted, setIsVoted] = useState(false);
  const [rating, setRating] = useState(1);

  const { state } = useContext(CoffeeStoresContext);
  const { coffeeStores: coffeeStoresNearMe } = state;

  useEffect(() => {
    if (initialProps.coffeeStore && isObjectEmpty(initialProps.coffeeStore)) {
      if (!!coffeeStoresNearMe?.length) {
        const specificCoffeeStore = coffeeStoresNearMe?.find(
          (coffeeStore) =>
            coffeeStore?.fsq_id?.toString() === router.query?.id?.toString()
        );
        setCoffeeStore(specificCoffeeStore);
      }
    }
  }, [id]);

  // using isFallback to check if the specifc data is exist, but we are not listed the {params: {id: '...'}} on getStaticPaths
  if (router.isFallback) {
    /* show us loading screen until the isFallback check the data on getStaticinitialinitialProps
      - If the data is exist (the id is found by getStaticinitialProps) => show the page with specific data
      - If the data is not exist => will show error "Failed to load static initialProps"
    */
    return <div>Loading....</div>;
  }
  const { name, location, imgUrl } = coffeeStore || {};
  const { address, region } = location || {};

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
              <p className={styles.detail_text}>{rating}</p>
            </div>
            {isVoted ? (
              <button
                className={cx(styles.btn, styles.remove_vote_btn)}
                onClick={() => {
                  setRating(rating - 1);
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CoffeeStore;
