const BASE_URL = 'http://localhost:7890';

export async function getLocations() {
  try {
    const resp = await fetch(`${BASE_URL}/api/v1/locations`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (resp.ok) {
      console.log('location', resp.status);
      return await resp.json();
    } else {
      throw new Error();
    }
  } catch (e) {
    return null;
  }
}

// TODO pins only show up after I save
