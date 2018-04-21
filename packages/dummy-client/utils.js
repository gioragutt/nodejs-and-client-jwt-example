const saveToStorage = ([key, value]) =>
  global.vorpal.localStorage.setItem(key, JSON.stringify(value))

const readFromStorage = (key) => {
  const value = global.vorpal.localStorage.getItem(key)
  return !value ? null : JSON.parse(value)
}

const removeFromStorage = key => global.vorpal.localStorage.removeItem(key)

const saveObjectToStorage = data => Object.entries(data).forEach(saveToStorage)

const httpOptions = () => {
  const token = readFromStorage('token')
  return {
    withCredentials: true,
    responseType: 'json',
    headers: token ? {Authorization: `Bearer ${token}`} : {},
  }
}

module.exports = {
  httpOptions,
  saveObjectToStorage,
  readFromStorage,
  removeFromStorage,
}
