const BASE_URL = 'http://localhost:7890';

// TODO fix user sign up with duplicate email, try to run getUser. if user.status = 500
// TODO fix user can still access home page with wrong password if user.status = 401
// TODO user sign up also signs in

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
    return resp;
    // if (resp.ok) {
    //   console.log('working');
    //   return await resp.json();
    // } else {
    //   throw new Error('this email already has an account');
    // }
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
    return resp;
    // if (resp.ok) {
    //   return await resp.json();
    // } else {
    //   throw new Error();
    // }
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
