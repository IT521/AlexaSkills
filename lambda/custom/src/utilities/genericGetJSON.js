const qs = require('querystring');
const fetch = require('isomorphic-fetch');

const fetchBaseOptions = {
  method: 'GET',
  // credentials: 'same-origin',
};

// eslint-disable-next-line func-names
module.exports = function (endpoint, data, options = {}) {
  const params = (data ? `?${qs.stringify(data)}` : '');
  return fetch(`${endpoint}${params}`, { ...fetchBaseOptions, ...options })
    .then(response => response.json());
};
