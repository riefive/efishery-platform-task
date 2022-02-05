import http from 'http'
import https from 'https'
import { camelize } from './words'

function mapper(data) {
  const item = {}
  for (const key in data) {
    const element = data[key]
    if (element && typeof element === 'object') {
      if (Array.isArray(element)) {
        item[camelize(key)] = element?.length > 0 ? element?.map((value) => mapper(value)) : []
      } else {
        const subItem = {}
        for (const subKey in element) {
          const subElement = element[subKey]
          subItem[camelize(subKey)] = subElement
        }
        item[camelize(key)] = subItem
      }
    } else {
      item[camelize(key)] = element
    }
  }
  return item
}

export function parsedArray(data) {
  const sources = Array.isArray(data) && data.length > 0 ? data : []
  const parsed = []
  sources?.forEach((element) => {
    parsed.push(mapper(element))
  })
  return parsed
}

export function parsedObject(data) {
  const parsed = typeof data !== 'object' ? data : mapper(data)
  return parsed
}

export function request(baseUrl, path, { method, payloads, queries }) {
  const parsedUrl = new URL(baseUrl)
  const curl = /https/i.test(parsedUrl?.protocol || 'http') ? https : http

  return new Promise((resolve, reject) => {
    const callback = (response) => {
      const statusCode = response.statusCode || 0
      let text = ''
      response.setEncoding('utf8')
      response.on('data', (chunk) => { text += chunk  })
      response.on('end', () => {
        let parsed = null
        try {
          parsed = JSON.parse(text)
        } catch (error) {
          parsed = text
        }
        resolve({ 
          code: statusCode, 
          timestamp: new Date().getTime(), 
          data: parsed 
        })
      })
    }
  
    const timeout = 30 * 1000
    const pathChild = (parsedUrl?.pathname || '').concat(`/${path}`).replace(/\/\//g, '/')
    const options = { host: parsedUrl?.host, method: method.toString().toUpperCase(), path: pathChild, rejectUnauthorized: false, requestCert: true }
  
    const methodText = method.toString().toLowerCase() 
    if (['post', 'put', 'delete'].includes(methodText) && typeof payloads === 'object') {
      const data = JSON.stringify(payloads)
      const headers = { 'Content-Type': 'application/json', 'Content-Length': data.length || Buffer.byteLength(data) }
      Object.assign(options, { headers })
    } else if (methodText === 'get' && typeof queries === 'object') {
      const params = new URLSearchParams(queries)
      Object.assign(options, { path: options.path + `?${params.toString()}` })
    }
  
    const req = curl.request(options, callback)
    if (['post', 'put', 'delete'].includes(methodText) && typeof payloads === 'object') {
      const data = JSON.stringify(payloads)
      req.write(data)
    }
    req.setTimeout(timeout)
  
    req.on('error', (error) => {
      reject({ 
        code: error?.code || 0, 
        timestamp: new Date().getTime(), 
        message: error.toString(), 
        errorCode: error?.errno, 
        errorLabel: error?.syscall 
      })
    })
  
    req.end()
  })
}
