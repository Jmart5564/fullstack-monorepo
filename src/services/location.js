const BASE_URL = '';

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
      const location = await resp.json();
      return location;
    } else {
      throw new Error();
    }
  } catch (e) {
    return null;
  }
}

export async function addLocation(newLocation) {
  const { id, lat, lng, user_id } = newLocation;
  try {
    const resp = await fetch(`${BASE_URL}/api/v1/locations`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        latitude: lat,
        longitude: lng,
        user_id,
      }),
      credentials: 'include',
    });
    if (resp.ok) {
      return await resp.json();
    } else {
      throw new Error('Could not add marker');
    }
  } catch (e) {
    return null;
  }
}

export async function deleteLocation(id) {
  try {
    const resp = await fetch(`${BASE_URL}/api/v1/locations/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (resp.ok) {
      return await resp.json();
    } else {
      throw new Error('Could not delete marker');
    }
  } catch (e) {
    return null;
  }
}
