const fetch = require('isomorphic-fetch');

const fetchBaseOptions = {
  method: 'POST',
  // credentials: 'same-origin',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
};

// eslint-disable-next-line func-names
module.exports = function (endpoint, data, options) {
  return fetch(endpoint, { body: JSON.stringify(data), ...fetchBaseOptions, ...options })
    .then(response => response.json());
};
