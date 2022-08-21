import { useRouter } from 'next/router';

const CoffeeStore = () => {
  const router = useRouter();
  // grab the coffee ID from url using router.query
  const { id } = router?.query;

  return <div>Coffee Stores Page - {id}</div>;
};

export default CoffeeStore;
