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
      console.log('respbody', resp.body);
      const journal = await resp.json();
      console.log('journal', journal);
      return journal;
    } else {
      throw new Error();
    }
  } catch (e) {
    return null;
  }
}

export async function addJournal(newJournal) {
  const { details, location_id, date } = newJournal;
  console.log('servicejournal', newJournal);
  try {
    const resp = await fetch(`${BASE_URL}/api/v1/journals`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        details,
        location_id,
        date,
      }),
      credentials: 'include',
    });
    if (resp.ok) {
      return await resp.json();
    } else {
      throw new Error('Could not add journal entry');
    }
  } catch (e) {
    return null;
  }
}
