import { request } from '../../src/helpers/api'
import * as CacheFile from '../../src/helpers/cache'
import * as CacheMap from '../../src/helpers/cachemap'

const useMap = true
const Cache = useMap ? CacheMap : CacheFile

export default async function handler(req, res) {
  const pathChild = 'option_size'
  const filename = 'size.cache'
  const urlText = process.env.API_URL
  const method = req.method 

  if (req.method !== 'GET') {
    return res.status(403).json({ message: 'method is not allowed' })
  }

  const queries = Object.assign({ limit: 100 }, req.query || {})
  
  let response = {}
  if (Cache.isExpired(filename, queries, 24, 'hour')) {
    const [error, result] = await request(urlText, pathChild, { method, queries })
      .then(v => [null, v]).catch(e => [e, null])
    Cache.removeCache(filename, queries)
    Cache.addCache(filename, queries, result)
    response = error ? error : result
    if (typeof response === 'object') {
      Object.assign(response, { source: 'network' })
    }
  } else {
    const resultCache = Cache.getCache(filename, queries)
    response = resultCache || {}
    if (typeof response === 'object') {
      Object.assign(response, { source: 'cache' })
    } 
  }
  res.status(200).json(response)
}
