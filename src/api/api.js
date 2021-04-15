const apiUrl = 'http://blokpres/cms';

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

export { apiUrl, authHeader, badResponse, objToQuery }