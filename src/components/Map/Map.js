// import Map, { Marker } from 'react-map-gl';
import { useState, useRef, useEffect } from 'react';
import mapboxgl from '!mapbox-gl';
import styled from 'styled-components';
import React from 'react';
mapboxgl.accessToken = process.env.REACT_APP_MAP_ACCESS_TOKEN;

export default function MapComponent() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-122.9);
  const [lat, setLat] = useState(45.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/jmart5564/cla77df0d001n15oy0bcrhmzp',
      center: [lng, lat],
      zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <MapDiv>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <MapDiv ref={mapContainer} className="map-container" />
    </MapDiv>
  );
}

const MapDiv = styled.div`
  height: 100vh;
`;
