import '../styles/globals.css';
import CoffeeStoresProvider from '../store/coffeeStoresContext';

function MyApp({ Component, pageProps }) {
  return (
    <CoffeeStoresProvider>
      <Component {...pageProps} />
    </CoffeeStoresProvider>
  );
}

export default MyApp;
