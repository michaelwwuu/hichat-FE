export const getToken = () => {
  const token = localStorage.getItem('token')
  if (token) return token
  else return false
}

export const setToken = (token) => {
localStorage.setItem('token', token)
}

export const getLocal = (key) => {
if(!key) {
  return;
}
const getLocalSth = window.localStorage.getItem(key);
return getLocalSth;
}

export const setLocal = ( key , value ) => {
if(!key || !value) {
  return;
}
window.localStorage.setItem(key,value);
}