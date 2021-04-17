import { apiUrl, badResponse, objToQuery } from "./api";

export default {
  getItems(table, params) {
    return fetch(apiUrl + '/get/' + table + '?t=' + new Date().getTime() + '&' + objToQuery(params), {
      method: 'GET'
    })
    .then(response => response.json())
    .catch(() => badResponse());
  },
  getItem(table, id, params) {
    return fetch(apiUrl + '/get/' + table + '/' + id + '?t=' + new Date().getTime() + '&' + objToQuery(params), {
      method: 'GET'
    })
    .then(response => response.json())
    .catch(() => badResponse());
  },
  update(table, id, data) {
    return fetch(apiUrl + '/update/' + table + '/' + id + '?t=' + new Date().getTime(), {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .catch(() => badResponse());
  },
  create(table, data) {
    return fetch(apiUrl + '/create/' + table + '?t=' + new Date().getTime(), {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .catch(() => badResponse());
  },
  delete(table, id) {
    console.log(table, id);
  },
  getConfig() {
    console.log('getting config');
  },
  autocomplete(table, q) {
    return fetch(apiUrl + '/autocomplete/' + table + '/' + q + '?t=' + new Date().getTime(), {
      method: 'GET'
    })
    .then(response => response.json())
    .catch(() => badResponse());
  },
}