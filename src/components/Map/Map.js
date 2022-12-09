import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from 'react-map-gl';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useLocations } from '../../hooks/useLocations.js';
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
  const { locations } = useLocations();
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

  const geolocateControlRef = useCallback((ref) => {
    if (ref) {
      // Activate as soon as the control is loaded
      ref.trigger();
    }
  }, []);

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
          }}
        >
          <MushImg src="/mushroom.svg" alt="Mushroom Icon" />
        </Marker>
      )),
    [locations]
  );

  return (
    <MapDiv>
      <Map
        {...viewport}
        mapboxAccessToken={process.env.REACT_APP_MAP_ACCESS_TOKEN}
        mapStyle="mapbox://styles/jmart5564/cla77df0d001n15oy0bcrhmzp"
        onMove={(evt) => {
          setViewport(evt.viewport);
        }}
      >
        <GeolocateControl
          ref={geolocateControlRef}
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
            <div>
              {selectedPin.city}, {selectedPin.state} |{' '}
              <a
                target="_new"
                href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${selectedPin.city}, ${selectedPin.state}`}
              >
                Wikipedia
              </a>
            </div>
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
