import { betweenTime } from './commons'
import { read, write } from './files'

function createMap(filename) {
  const raw = read(filename)
  const cacheMap = new Map()
  let data = null
  try {
    data = JSON.parse(raw?.data || null)
  } catch (error) {} 
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i]
      cacheMap.set(JSON.stringify(element.keyword), element)
    }
  }
  return cacheMap
}

export function isExpired(filename, keyword, max, type) {
  const cacheMap = createMap(filename)
  const keyName = JSON.stringify(keyword)
  if (cacheMap.has(keyName)) {
    const current = cacheMap.get(keyName)
    const timestamp = current.timestamp
    const diff = betweenTime(timestamp, null, type)
    return diff > max 
  }
  return true
}

export function addCache(filename, keyword, data) {
  const cacheMap = createMap(filename)
  const keyName = JSON.stringify(keyword)
  if (data && !cacheMap.has(keyName)) {
    cacheMap.set(keyName, { keyword, timestamp: new Date().getTime(), response: data })
  }
  const arrays = []
  cacheMap.forEach((entry) => {
    arrays.push(entry)
  })
  write(filename, JSON.stringify(arrays, null, 4))
}

export function removeCache(filename, keyword) {
  const cacheMap = createMap(filename)
  const keyName = JSON.stringify(keyword)
  if (cacheMap.has(keyName)) {
    cacheMap.delete(keyName)
  }
  const arrays = []
  cacheMap.forEach((entry) => {
    arrays.push(entry)
  })
  write(filename, JSON.stringify(arrays, null, 4))
}

export function getCache(filename, keyword) {
  const cacheMap = createMap(filename)
  const keyName = JSON.stringify(keyword)
  if (cacheMap.has(keyName)) {
    const result = cacheMap.get(keyName)
    return result?.response || null
  }
  return null
}
