import React from 'react';
import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { getUser } from '../services/auth.js';

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchUser() {
      const data = await getUser();
      if (data === null) {
        setUser(null);
      } else {
        setUser(data);
        setLoading(false);
      }
    }
    fetchUser();
  }, []);
  const contextValue = useMemo(
    () => ({ user, setUser, loading, setLoading }),
    [user, setUser, loading, setLoading]
  );
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('user called outside of UserProvider Component');
  }
  return context;
};
export { UserProvider, UserContext, useCurrentUser };
