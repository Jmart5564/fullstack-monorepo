// const BASE_URL = '';
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
    const resp = await response.json();
    if (response.ok) {
      return await signIn({ email, password });
    } else {
      alert('This email already has an account, please sign in');
      throw new Error(resp.message);
    }
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
    const resp = await response.json();
    // return resp;
    if (resp.status === 401) {
      alert('Wrong Password, Please Try Again');
      throw new Error('wrong password, try again');
    } else {
      return await resp;
    }
  }
}

async function signIn({ email, password }) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/users/sessions`, {
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
    const resp = await response.json();
    // return resp;
    if (resp.status === 401) {
      throw new Error('wrong password, try again');
    } else {
      return await resp;
    }
  } catch (e) {
    return null;
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
      return await resp.json();
    } else {
      throw new Error();
    }
  } catch (e) {
    return null;
  }
}

export async function logout() {
  const resp = await fetch(`${BASE_URL}/api/v1/users/sessions`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    mode: 'cors',
  });
  if (resp.ok) {
    location.replace('/auth/sign-in');
  } else {
    throw new Error('Unable to logout');
  }
}
