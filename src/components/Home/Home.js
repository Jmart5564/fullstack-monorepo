import React from 'react';
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser, UserContext } from '../../context/UserContext.js';
import MapComponent from '../Map/Map.js';
import styled from 'styled-components';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { loading } = useContext(UserContext);

  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    if (!loading && user == null) {
      navigate('/auth/sign-in');
    }
  }, [loading]);

  return (
    <MapDiv>
      <MapComponent />
    </MapDiv>
  );
}

const MapDiv = styled.div`
  height: 100vh;
`;
