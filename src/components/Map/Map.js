import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from 'react-map-gl';
import React, { useState, useEffect, useMemo } from 'react';
// import mapboxgl from '!mapbox-gl';
import styled from 'styled-components';
import testData from '../../cities.json';

export default function MapComponent() {
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -122.9703,
    width: '100vw',
    height: '100vh',
    zoom: 10,
  });
  const [selectedPin, setSelectedPin] = useState(null);
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

  const pins = useMemo(
    () =>
      testData.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setSelectedPin(city);
          }}
        >
          <MushImg src="/mushroom.svg" alt="Mushroom Icon" />
        </Marker>
      )),
    []
  );

  return (
    <MapDiv>
      <Map
        {...viewport}
        mapboxAccessToken={process.env.REACT_APP_MAP_ACCESS_TOKEN}
        mapStyle="mapbox://styles/jmart5564/cla77df0d001n15oy0bcrhmzp"
        onMove={(viewport) => {
          setViewport(viewport);
        }}
      >
        <GeolocateControl position="top-left" />
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

// export default function MapComponent() {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const [lng, setLng] = useState(-122.9);
//   const [lat, setLat] = useState(45.35);
//   const [zoom, setZoom] = useState(9);

//   useEffect(() => {
//     if (map.current) return; // initialize map only once
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/jmart5564/cla77df0d001n15oy0bcrhmzp',
//       center: [lng, lat],
//       zoom,
//     });
//   });

//   useEffect(() => {
//     if (!map.current) return; // wait for map to initialize
//     map.current.on('move', () => {
//       setLng(map.current.getCenter().lng.toFixed(4));
//       setLat(map.current.getCenter().lat.toFixed(4));
//       setZoom(map.current.getZoom().toFixed(2));
//     });
//   });

//   return (
//     <MapDiv>
//       <div className="sidebar">
//         Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
//       </div>
//       <MapDiv ref={mapContainer} className="map-container" />
//     </MapDiv>
//   );
// }

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
