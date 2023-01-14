import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.js';
import { authUser } from '../../services/auth.js';
import styled from 'styled-components';
import backgroundImg from '../../mushrooms.jpg';

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
  }, [loading, user, navigate]);

  return (
    <AuthPageDiv style={{ backgroundImage: `url(${backgroundImg})` }}>
      <AuthDiv>
        <h1>Forager Journal</h1>
        <div>
          <Link to="/auth/sign-in">Sign In</Link>
          <Link to="/auth/sign-up">Sign Up</Link>
        </div>
        <InputDiv>
          <label>Email</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </InputDiv>
        <InputDiv>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </InputDiv>
        {type === 'sign-in' ? <button onClick={submitAuth}>Sign In</button> : null}
        {type === 'sign-up' ? <button onClick={submitAuth}>Sign Up</button> : null}
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
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
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
  background-color: tan;
  box-shadow: 0px 9px 30px 0px rgba(167, 132, 82, 0.3);
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
    color: red;
  }
  input {
    width: 200px;
    height: 15px;
    padding: 7px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(220, 220, 220);
    &:focus {
      border: 2px solid rgba(0, 0, 0, 1);
    }
  }
  button {
    font-size: 15px;
  }
`;
