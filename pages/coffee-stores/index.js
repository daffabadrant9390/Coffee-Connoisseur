import Link from 'next/link';

const CoffeeStores = () => {
  return (
    <div>
      <h1>Welcome to the coffee stores!</h1>
      <Link href={`/coffee-stores/${'coffee-janji-jiwa-jakarta'}`}>
        Coffee Janji Jiwa Jakarta
      </Link>
    </div>
  );
};

export default CoffeeStores;
