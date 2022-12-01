import React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.js';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  console.log('homeuser', user);

  if (!user) {
    navigate('/auth/sign-in');
  }

  return <h1>You did it!</h1>;
}
