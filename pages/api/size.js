import { request } from '../../src/helpers/api'
import { addCache, removeCache, getCache, isExpired } from '../../src/helpers/cache'

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
  if (isExpired(filename, queries, 24, 'hour')) {
    const [error, result] = await request(urlText, pathChild, { method, queries })
      .then(v => [null, v]).catch(e => [e, null])
    removeCache(filename, queries)
    addCache(filename, queries, result)
    response = error ? error : result
    if (typeof response === 'object') {
      Object.assign(response, { source: 'network' })
    }
  } else {
    const resultCache = getCache(filename, queries)
    response = resultCache || {}
    if (typeof response === 'object') {
      Object.assign(response, { source: 'cache' })
    } 
  }
  res.status(200).json(response)
}
