import qs from 'querystring';
import fetch from 'isomorphic-fetch';

const fetchBaseOptions = {
  method: 'GET',
  // credentials: 'same-origin',
};

export default (endpoint, data, options = {}) => {
  const params = (data ? `?${qs.stringify(data)}` : '');
  return fetch(`${endpoint}${params}`, { ...fetchBaseOptions, ...options })
    .then(response => response.json());
};
