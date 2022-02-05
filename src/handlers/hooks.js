import { initProvinces, initCities } from '../stores/store_region'
import { initSizes } from '../stores/store_size'

function setQueryParameters(params) {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
}

export async function fetchPrice(queries) {
  return await fetch('/api/price' + '?' + setQueryParameters(queries)).then(res => res.json()).then((res) => {
    let output = null
    const code = Number(res?.code || 0)
    if (code === 200) {
      const data = res?.data || []
      const summary = res?.summary || {}
      output = { data, summary }
    }
    return output
  })
}

export function fetchRegion(callback) {
  fetch('/api/region')
    .then(res => res.json())
    .then((res) => {
      let output = null
      const code = Number(res?.code || 0)
      if (code === 200) {
        const data = res?.data || []
        const provinceSet = new Set()
        const cities = []
        data?.forEach(item => {
          cities.push(item)
          if (item?.province) {
            provinceSet.add(item?.province)
          }
        })
        output = { provinces: [...provinceSet], cities }
      }
      if (callback) {
        callback(output)
      }
    })
}

export function fetchSize(callback) {
  fetch('/api/size')
    .then(res => res.json())
    .then((res) => {
      let output = null
      const code = Number(res?.code || 0)
      if (code === 200) {
        const data = res?.data || []
        output = data
      }
      if (callback) {
        callback(output)
      }
    })
}

export async function postPrice(data) {
  return await fetch('/api/price', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()).then((res) => {
    let output = null
    const code = Number(res?.code || 0)
    if (code === 200) {
      output = res
    }
    return output
  })
}

export async function putPrice(queries, data) {
  return await fetch('/api/price' + '?' + setQueryParameters(queries), { method: 'PUT', body: JSON.stringify(data) }).then(res => res.json()).then((res) => {
    let output = null
    const code = Number(res?.code || 0)
    if (code === 200) {
      output = res
    }
    return output
  })
}

export async function deletePrice(data) {
  return await fetch('/api/price', { method: 'DELETE', body: JSON.stringify(data) }).then(res => res.json()).then((res) => {
    let output = null
    const code = Number(res?.code || 0)
    if (code === 200) {
      output = res
    }
    return output
  })
}

export function initialized(dispatch) {
  if (!dispatch) return
  fetchRegion((output) => {
    if (!output) return
    if (output?.provinces) {
      dispatch(initProvinces(output.provinces))
    }
    if (output?.cities) {
      dispatch(initCities(output.cities))
    }
  })
  fetchSize((output) => {
    if (!output) return
    dispatch(initSizes(output))
  })
}
