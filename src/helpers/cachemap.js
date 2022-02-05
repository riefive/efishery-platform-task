import { betweenTime } from './commons'

const cacheMap = new Map()

export function isExpired(filename, keyword, max, type) {
  const keyName = filename + '-' + JSON.stringify(keyword)
  if (cacheMap.has(keyName)) {
    const current = cacheMap.get(keyName)
    const timestamp = current.timestamp
    const diff = betweenTime(timestamp, null, type)
    return diff > max 
  }
  return true
}

export function addCache(filename, keyword, data) {
  const keyName = filename + '-' + JSON.stringify(keyword)
  if (data && !cacheMap.has(keyName)) {
    cacheMap.set(keyName, { keyword, timestamp: new Date().getTime(), response: data })
  }
}

export function removeCache(filename, keyword) {
  const keyName = filename + '-' + JSON.stringify(keyword)
  if (cacheMap.has(keyName)) {
    cacheMap.delete(keyName)
  }
}

export function getCache(filename, keyword) {
  const keyName = filename + '-' + JSON.stringify(keyword)
  if (cacheMap.has(keyName)) {
    const result = cacheMap.get(keyName)
    return result?.response || null
  }
  return null
}
