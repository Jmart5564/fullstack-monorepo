import React from 'react';
import { logout } from '../../services/auth.js';
import styled from 'styled-components';

export default function Header() {
  const signOut = async () => {
    const response = await logout();
    return response;
  };
  return (
    <HeaderDiv>
      <button onClick={signOut}>Sign Out</button>
      <h1>Forager Journal</h1>
    </HeaderDiv>
  );
}

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 30px;
  }
  button {
    margin-top: 20px;
    font-size: large;
    cursor: pointer;
  }
`;
