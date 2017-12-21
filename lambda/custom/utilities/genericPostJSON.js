import fetch from 'isomorphic-fetch';

const fetchBaseOptions = {
  method: 'POST',
  // credentials: 'same-origin',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
};

export default (endpoint, data, options) =>
  fetch(endpoint, { body: JSON.stringify(data), ...fetchBaseOptions, ...options })
    .then(response => response.json());
