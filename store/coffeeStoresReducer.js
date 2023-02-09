import { ACTION_TYPE } from "./action";

export const CoffeeStoresReducer = ((state, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_LAT_LONG:
      return {
        ...state,
        latLong: {
          ...state.latLong,
          latitude: action.payload.latitude,
          longitude: action.payload.longitude
        }
      };
    case ACTION_TYPE.SET_COFFEE_STORES:
      return {
        ...state,
        coffeeStores: action.payload.coffeeStores
      };
    default:
      throw new Error(`Error Occurred on ACTION_TYPE: ${action.type}`);
  }
})