import React from 'react';
import { logout } from '../../services/auth.js';

export default function Header() {
  const signOut = async () => {
    const response = await logout();
    return response;
  };
  return (
    <div>
      <h1>Forager Journal</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
