import { createContext, useReducer } from "react";
import { CoffeeStoresReducer } from "./coffeeStoresReducer";

export const CoffeeStoresContext = createContext();

const CoffeeStoresProvider = ({children}) => {
  const initialState = {
    latLong: {
      latitude: 0,
      longitude: 0
    },
    coffeeStores: []
  };

  const [state, dispatch] = useReducer(CoffeeStoresReducer, initialState);

  return (
    <CoffeeStoresContext.Provider value={{state, dispatch}}>
      {children}
    </CoffeeStoresContext.Provider>
  )
}

export default CoffeeStoresProvider;