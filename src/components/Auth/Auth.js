import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.js';
import { authUser } from '../../services/auth.js';
import styled from 'styled-components';

export default function Auth() {
  const { type } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const submitAuth = async () => {
    if (email === '') {
      alert('Please provide email');
      return;
    }
    if (password === '') {
      alert('please provide password');
      return;
    }
    const userResponse = await authUser({ email, password, type });
    setUser(userResponse);
    setEmail('');
    setPassword('');
    navigate('/home');
  };

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, []);
  console.log('authuser', user);

  return (
    <AuthPageDiv>
      <AuthDiv>
        <div>
          <Link to="/auth/sign-in">Sign In</Link>
          <Link to="/auth/sign-up">Sign Up</Link>
        </div>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button onClick={submitAuth}>Submit</button>
      </AuthDiv>
    </AuthPageDiv>
  );
}

const AuthPageDiv = styled.div`
  height: 100vh;
  width: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  align-self: center;
  justify-items: center;
  justify-content: center;
  text-align: center;
`;

const AuthDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  align-self: center;
  justify-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid black;
  width: 30vh;
  height: 30vh;
  gap: 20px;
  a:link {
    text-decoration: none;
    padding: 15px 15px;
  }
  a:visited {
    color: black;
  }
  a:hover {
    font-size: 20px;
  }
  a.active {
    font-size: 25px;
    text-decoration: underline;
    font-weight: 500;
  }
  input {
    width: 200px;
    height: 15px;
    padding: 7px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(220, 220, 220);
    &:focus {
      border: 2px solid rgba(0, 206, 158, 1);
    }
  }
`;
