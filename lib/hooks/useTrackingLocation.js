import { useState, useContext } from 'react';
import { ACTION_TYPE } from '../../store/action';
import { CoffeeStoresContext } from '../../store/coffeeStoresContext';

export const useTrackingLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { dispatch } = useContext(CoffeeStoresContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    dispatch({
      type: ACTION_TYPE.SET_LAT_LONG,
      payload: {
        latitude,
        longitude,
      },
    });
    setLocationErrorMsg('');
    setIsFindingLocation(false);
  };
  const error = () => {
    setLocationErrorMsg('Unable to retrieve your location!');
    setIsFindingLocation(false);
  };
  const handleTrackLocation = () => {
    setIsFindingLocation(true);

    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is not supported in your browser!');
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
  };
};
