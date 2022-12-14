import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from 'react-map-gl';
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useLocations } from '../../hooks/useLocations.js';
import { deleteLocation, addLocation, getLocations } from '../../services/location.js';
// import { UserContext } from '../../context/UserContext.js';

export default function MapComponent() {
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -122.9703,
    width: '100vw',
    height: '100vh',
    zoom: 10,
  });
  const [selectedPin, setSelectedPin] = useState(null);
  const { locations, setLocations } = useLocations();
  // const { loading } = useContext(UserContext);

  useEffect(() => {
    const listener = (e) => {
      if (e.key === 'Escape') {
        setSelectedPin(null);
      }
    };
    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  // TODO Figure out why this doesn't work, works on save a new update not on load
  // const geolocateControlRef = useCallback((ref) => {
  //   if (ref) {
  //     // Activate as soon as the control is loaded
  //     ref.trigger();
  //   }
  // }, []);

  const pins = useMemo(
    () =>
      locations.map((location) => (
        <Marker
          key={location.id}
          longitude={location.longitude}
          latitude={location.latitude}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setSelectedPin(location);
            console.log('onclick', location);
          }}
        >
          <MushImg src="/mushroom.svg" alt="Mushroom Icon" />
        </Marker>
      )),
    [locations]
  );

  console.log('locations', locations);

  const addMarker = async (e) => {
    const newLocation = e.lngLat;
    await addLocation(newLocation);
    const updatedLocations = await getLocations();
    setLocations(updatedLocations);
  };

  const deleteMarker = async () => {
    await deleteLocation(selectedPin.id);
    const newLocations = locations.filter((loc) => loc.id !== selectedPin.id);
    setLocations(newLocations);
    setSelectedPin(null);
  };

  return (
    <MapDiv>
      <Map
        {...viewport}
        mapboxAccessToken={process.env.REACT_APP_MAP_ACCESS_TOKEN}
        mapStyle="mapbox://styles/jmart5564/cla77df0d001n15oy0bcrhmzp"
        onClick={addMarker}
        onMove={(evt) => {
          setViewport(evt.viewport);
        }}
      >
        <GeolocateControl
          // ref={geolocateControlRef}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
          auto
          position="top-left"
        />
        <NavigationControl position="top-left" />
        <FullscreenControl position="top-left" />
        <ScaleControl />

        {pins}

        {selectedPin && (
          <Popup
            anchor="top"
            longitude={Number(selectedPin.longitude)}
            latitude={Number(selectedPin.latitude)}
            onClose={() => setSelectedPin(null)}
          >
            <PopUpDiv>
              Pin Selected
              <button onClick={deleteMarker}>Delete Pin</button>
            </PopUpDiv>
            <img width="100%" src={selectedPin.image} />
          </Popup>
        )}
      </Map>
    </MapDiv>
  );
}

const MapDiv = styled.div`
  height: 100vh;
  button {
    width: 40px;
    height: 40px;
    img {
      height: 50px;
      width: 50px;
    }
  }
`;

const MushImg = styled.img`
  height: 50px;
  width: 50px;
  cursor: pointer;
`;

const PopUpDiv = styled.div`
  width: 95px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: flex-end;
  button {
    height: 20px;
    width: 80px;
    display: flex;
    align-self: center;
    justify-self: flex-end;
  }
`;
