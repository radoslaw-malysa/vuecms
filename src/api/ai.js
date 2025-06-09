import { apiUrl, badResponse, objToQuery } from "./api";

export default {
  query(query, params) {
    return fetch(apiUrl + '/ai/query/' + query + '?t=' + new Date().getTime() + '&' + objToQuery(params), {
      method: 'GET'
    })
    .then(response => response.json())
    .catch(() => badResponse());
  }
}