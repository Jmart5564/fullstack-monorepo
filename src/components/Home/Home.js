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
  console.log('homeuser', user);

  useEffect(() => {
    console.log('user1', user);
    // eslint-disable-next-line eqeqeq
    if (!loading && user == null) {
      console.log('user2', user);
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
