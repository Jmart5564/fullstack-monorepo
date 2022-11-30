import { get, post } from './request.js';

const URL = '/api/v1/users';

export async function authUser(email, password, type) {
  let response;
  if (type === 'sign-up') {
    response = await post(`${URL}`, email, password);
  } else {
    response = await post(`${URL}/sessions`, email, password);
  }
  return response.user;
}

export async function signUpUser(credentials) {
  const response = await post(`${URL}`, credentials);
  response.user = response.data;
  return response;
}

export async function signInUser(credentials) {
  const response = await post(`${URL}/sessions`, credentials);
  response.user = response.data;
  return response;
}

export async function getUser() {
  const response = await get(`${URL}/me`);
  response.user = response.data;
  return response;
}

const USER_KEY = 'USER';

export function storeLocalUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function getLocalUser() {
  const json = localStorage.getItem(USER_KEY);
  try {
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    storeLocalUser();
  }
}
