import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.js';
import { authUser } from '../../services/auth.js';
import styled from 'styled-components';

// TODO Sign up does not give a cookie, only sign in

export default function Auth() {
  const { type } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { loading } = useContext(UserContext);
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
    if (!loading && user) {
      navigate('/home');
    }
  }, [loading]);

  return (
    <AuthPageDiv>
      <div>
        <h1>Forager Journal</h1>
      </div>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  align-items: center;
`;

const AuthDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid black;
  width: 350px;
  height: 350px;
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
