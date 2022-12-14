const BASE_URL = 'http://localhost:7890';

export async function getJournals() {
  try {
    const resp = await fetch(`${BASE_URL}/api/v1/journals`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (resp.ok) {
      const journal = await resp.json();
      return journal;
    } else {
      throw new Error();
    }
  } catch (e) {
    return null;
  }
}
