import React from 'react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.js';
import MapComponent from '../Map/Map.js';
import styled from 'styled-components';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  console.log('homeuser', user);

  useEffect(() => {
    if (user === null || user === undefined) {
      navigate('/auth/sign-in');
    }
  }, []);

  return (
    <MapDiv>
      <MapComponent />
    </MapDiv>
  );
}

const MapDiv = styled.div`
  height: 100vh;
`;
