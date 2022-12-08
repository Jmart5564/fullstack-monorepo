import ReactMapGL, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
} from 'react-map-gl';
import React, { useState, useEffect } from 'react';
// import mapboxgl from '!mapbox-gl';
import styled from 'styled-components';
// const mapToken = process.env.REACT_APP_MAP_ACCESS_TOKEN;
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

  return (
    <MapDiv>
      <ReactMapGL
        {...viewport}
        mapboxAccessToken={process.env.REACT_APP_MAP_ACCESS_TOKEN}
        mapStyle="mapbox://styles/jmart5564/cla77df0d001n15oy0bcrhmzp"
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        <NavigationControl position="top-left" />
        <FullscreenControl position="top-left" />
        <ScaleControl />
        {testData.map((data) => (
          <Marker key={data.id} latitude={data.latitude} longitude={data.longitude}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSelectedPin(data);
              }}
            >
              <img src="/mushroom.svg" alt="Mushroom Icon" />
            </button>
          </Marker>
        ))}

        {selectedPin ? (
          <Popup
            latitude={selectedPin.latitude}
            longitude={selectedPin.longitude}
            onClose={() => {
              setSelectedPin(null);
            }}
          >
            <div>
              <h2>{selectedPin.city}</h2>
              <h2>{selectedPin.state}</h2>
              <h3>{selectedPin.population}</h3>
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
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
    width: 70px;
    height: 70px;
  }
`;
