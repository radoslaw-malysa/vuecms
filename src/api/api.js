//const apiUrl = 'http://blokpres/cms';
//const apiUrl = '/cms';

const apiUrl = (window.location.hostname == 'localhost') ? 'http://elektrownia.test/cms' : '/cms';

const authHeader = () => {
  let profile = JSON.parse(localStorage.getItem('profile'));

  if (profile && profile.token) {
      return { 
          'Authorization': 'Bearer ' + profile.token
      }
  } else {
      return {}
  }
}

const badResponse = () => {
  return {
    error: {
      code: '0'
    }
  }
}

const objToQuery = (obj) => {
  return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}

const toFormData = (o) => {
  return Object.entries(o).reduce((d,e) => (d.append(...e),d), new FormData())
}

export { apiUrl, authHeader, badResponse, objToQuery, toFormData }