import qs from 'querystring';
import fetch from 'isomorphic-fetch';
import genericPostJSON from './genericPostJSON';

const fetchBaseOptions = {
  method: 'GET',
  credentials: 'same-origin',
};

export default (endpoint, data, options = {}) => {
  // For backwards compatibility
  // TODO: remove usages that set method to POST
  if (options.method === 'POST') {
    return genericPostJSON(endpoint, data, options);
  }

  return fetch(endpoint + (data ? `?${qs.stringify(data)}` : ''), { ...fetchBaseOptions, ...options })
    .then(response => response.json());
};
