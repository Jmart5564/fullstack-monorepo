// import { post } from './request.js';
// import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:7890';

export async function authUser({ email, password, type }) {
  let response;
  if (type === 'sign-up') {
    response = await fetch(`${BASE_URL}/api/v1/users`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify({
        email,
        password,
        type,
      }),
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
    });
  } else if (type === 'sign-in') {
    response = await fetch(`${BASE_URL}/api/v1/users/sessions`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
    });

    return response.user;
  }
}

export async function getUser() {
  try {
    const resp = await fetch(`${BASE_URL}/api/v1/users/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (resp.ok) {
      return resp;
    } else {
      throw new Error();
    }
  } catch (e) {
    return null;
  }
}

// export async function CheckAuth() {
//   navigate = useNavigate();
//   const user = await getUser();

//   if (!user) location.replace('../auth');
// }

// export async function RedirectIfLoggedIn() {
//   navigate = useNavigate();
//   if (await getUser()) {
//     navigate('/home');
//   }
// }
