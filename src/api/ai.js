import { apiUrl, badResponse, toFormData, objToQuery } from "./api";

export default {
  query(params) {
    return fetch(apiUrl + '/ai/query?t=' + new Date().getTime(), {
      method: 'POST',
      body: toFormData(params)
    })
    .then(response => response.json())
    .catch(() => badResponse());
  },
  createImage(params) {
    
    return fetch(apiUrl + '/ai/create-image?t=' + new Date().getTime(), {
      method: 'POST',
      body: toFormData(params)
    })
    .then(response => response.json())
    .catch(() => badResponse());
  }
}