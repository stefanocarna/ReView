const storage = {
  workspace: window.location.hostname
}

storage.put = function(key, value) {
  if (!key || key === '') {
    console.error('Tried to store an invalid key into the localStorage:', key)
    return false
  }

  if (!value || value === 'undefined' || value === 'null') {
    console.warn(
      'Stored an invalid value into the localStorage. Just removed old value:',
      value
    )
    localStorage.removeItem(this.workspace + key)
    return false
  } else {
    localStorage.setItem(this.workspace + key, JSON.stringify(value))
    return true
  }
}

storage.get = function(key) {
  if (!key || key === '') {
    console.error('Tried to load an invalid key form localStorage:', key)
    return null
  }

  const localValue = localStorage.getItem(this.workspace + key)
  if (!localValue && !!localStorage[this.workspace + key]) {
    console.warn(
      'A key localStorage had a null value. Cleaned! :',
      this.workspace + key
    )
    return null
  }

  return JSON.parse(localValue)
}

storage.clear = function() {
  localStorage.clear()
}

export default storage
