import { apiUrl, badResponse } from "./api";

export default {
  login(email, passwd) {
    return fetch(apiUrl + '/login?t=' + new Date().getTime(), {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: email, passwd: passwd})
    })
    .then(response => response.json())
    .catch(() => badResponse());
  },
  getSession() {
    return fetch(apiUrl + '/session?t=' + new Date().getTime(), {
      method: 'GET'
    })
    .then(response => response.json())
    .catch(() => badResponse());
  },
  
  logout() {
    return fetch(apiUrl + '/logout?t=' + new Date().getTime(), {
      method: 'GET'
    })
    .then(response => response.json())
    .catch(() => badResponse());
    //localStorage.removeItem('profile');
    //return true;
  },
  restore() {
    const profile = localStorage.getItem('profile');
    if (profile) {
      return JSON.parse(profile)
    } else {
      return {}
    }
  },

}
//https://jasonwatmore.com/post/2018/07/14/vue-vuex-user-registration-and-login-tutorial-example
//https://en.wikipedia.org/wiki/JSON_Web_Token
//https://medium.com/js-dojo/how-to-build-a-spa-using-vue-js-vuex-vuetify-and-firebase-adding-authentication-with-firebase-d9932d1e4365