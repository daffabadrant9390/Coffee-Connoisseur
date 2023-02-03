import { useState } from 'react';

export const useTrackingLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  const [latLong, setLatLong] = useState({
    latitudeData: 0,
    longitudeData: 0,
  });
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLatLong({
      latitudeData: latitude,
      longitudeData: longitude,
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
    latLong,
    isFindingLocation,
  };
};
