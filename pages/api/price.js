import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { request } from '../../src/helpers/api'
import { addCache, removeCache, getCache, isExpired } from '../../src/helpers/cache'

function filterRequest(data) {
  const params = {}
  if (!data?.limit) {
    params.limit = 15
  } else {
    params.limit = data.limit
  }
  if (data?.offset) {
    params.offset = data.offset || 1
  }
  if (data) {
    const details = {}
    if (data?.id) {
      Object.assign(details, { uuid: data.id?.toString() })
    } 
    if (data?.name) {
      Object.assign(details, { komoditas: data.name?.toString() })
    }
    if (data?.city) {
      Object.assign(details, { area_kota: data.city?.toString() })
    }
    if (data?.province) {
      Object.assign(details, { area_provinsi: data.province?.toString() })
    }
    if (data?.size) {
      Object.assign(details, { size: data.size?.toString() })
    }
    if (data?.price) {
      Object.assign(details, { price: data.price?.toString() })
    }
    if (Object.keys(details).length > 0) {
      params.search = JSON.stringify(details)
    }
  }
  return params
}

function filterResult(data, currency) {
  if (Array.isArray(data)) {
    const output = data.filter(item => item.komoditas).map(item => {
      const price = Number(item?.price || 0)
      const priceUsd = Number(((currency?.usd || 0) / (currency?.idr || 0)) * price).toFixed(2)
      return {
        uuid: item?.uuid || null, comodityName: item?.komoditas || null, areaProvince: item?.area_provinsi || null, areaCity: item?.area_kota || null,
        size: Number(item?.size || 0), price, priceUsd,
        dateParsed: item?.tgl_parsed || null, timestamp: item?.timestamp || null
      }
    })
    return output
  }
  return data
}

function filterSummary(data, queries) {
  let output = null
  if (queries && queries.summary) {
    if (Array.isArray(data)) {
      const groupComodity = new Map()
      const groupCity = new Map()
      let max = 0, min = 0, count = 0, sum = 0, sumUsd = 0
      const arrayComodities = [], arrayCities = []

      const handleComodity = (item) => {
        const price = Number(item?.price || 0)
        const priceUsd = Number(item?.priceUsd || 0)
        const nameKey = item.comodityName
        if (groupComodity.has(nameKey)) {
          const theComodity = groupComodity.get(nameKey)
          const maxLocal = theComodity.max < price ? price : theComodity.max
          const minLocal = theComodity.min > price ? price : theComodity.min
          const countLocal = theComodity.count + 1
          const priceLocal = theComodity.price + price
          const priceUsdLocal = theComodity.priceUsd + priceUsd
          const averageLocal = Number((priceLocal / countLocal).toFixed(2))
          groupComodity.set(nameKey, { 
            max: maxLocal, min: minLocal, count: countLocal, price: priceLocal, priceUsd: priceUsdLocal, average: averageLocal
          })
        } else {
          groupComodity.set(nameKey, { max: price, min: price, count: 1, price, priceUsd, average: price })
        }
      }
      const handleCity = (item) => {
        const price = Number(item?.price || 0)
        const priceUsd = Number(item?.priceUsd || 0)
        const nameKey = item.areaCity
        if (groupCity.has(nameKey)) {
          const theCity = groupCity.get(nameKey)
          const maxLocal = theCity.max < price ? price : theCity.max
          const minLocal = theCity.min > price ? price : theCity.min
          const countLocal = theCity.count + 1
          const priceLocal = theCity.price + price
          const priceUsdLocal = theCity.priceUsd + priceUsd
          const averageLocal = Number((priceLocal / countLocal).toFixed(2))
          groupCity.set(nameKey, { 
            max: maxLocal, min: minLocal, count: countLocal, price: priceLocal, priceUsd: priceUsdLocal, average: averageLocal
          })
        } else {
          groupCity.set(nameKey, { max: price, min: price, count: 1, price, priceUsd, average: price })
        }
      }
      data?.forEach(item => {
        const price = Number(item?.price || 0)
        const priceUsd = Number(item?.priceUsd || 0)
        if (max < price) max = price
        if (min === 0 || min > price) min = price
        if (item?.comodityName) {
          handleComodity(item)
        }
        if (item?.areaCity) {
         handleCity(item)
        }
        sum += price
        sumUsd += priceUsd
        count++
      })

      for (const [key, value] of groupComodity.entries()) {
        const percent = (((value?.price || 0) / sum) * 100).toFixed(4)
        arrayComodities.push(Object.assign({ id: key }, value, { percent: Number(percent) }))
      }

      for (const [key, value] of groupCity.entries()) {
        const percent = (((value?.price || 0) / sum) * 100).toFixed(4)
        arrayCities.push(Object.assign({ id: key }, value, { percent: Number(percent)  }))
      }

      output = {
        all: { max, min, count, price: sum, priceUsd: Number(sumUsd.toFixed(3)), average: Number((sum / count).toFixed(2)) },
        comodity: arrayComodities,
        city: arrayCities
      }
    }
  }
  return output
}

function setPayload(data, isSave = false) {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (error) {}
  }
  const maps = {
    uuid: data?.id || null,
    komoditas: data?.comodityName || data?.name || null,
    area_provinsi: data?.province || null,
    area_kota: data?.city || null,
    size: data?.size || 0,
    price: data?.price || 0
  }
  if (isSave) {
    const dateCurrent = new Date()
    Object.assign(maps, { uuid: uuidv4(), tgl_parsed: dateCurrent.toISOString(), timestamp: dateCurrent.getTime() })
  } else {
    delete maps.uuid
  }
  return maps
}

async function getCurrency() {
  const filename = 'currency.cache'
  const urlText = process.env.API_CURRENCY_URL
  const queries = { name: 'currency' }
  if (isExpired(filename, queries, 1, 'hour')) {
    const [error, result] = await request(urlText, 'v4/latest/USD', { method: 'GET' })
      .then(v => [null, v]).catch(e => [e, null])
    if (!error) {
      removeCache(filename, queries)
      addCache(filename, queries, result)
      const rates = result?.data?.rates || {}
      return { usd: Number(rates?.USD || 0), idr: Number(rates?.IDR || 0) }
    }
  } else {
    const result = getCache(filename, queries)
    if (result) {
      const rates = result?.data?.rates || {}
      return { usd: Number(rates?.USD || 0), idr: Number(rates?.IDR || 0) }
    }
  }
  return { usd: 1, idr: 1 }
}

export default async function handler(req, res) {
  const pathChild = 'list'
  const filename = 'price.cache'
  const urlText = process.env.API_URL
  const method = req.method

  function callbackResponse(response, currency, query, isCache = false) {
    if (typeof response === 'object') {
      if (response?.data) {
        const data = filterResult(response.data, currency)
        const summary = filterSummary(data, query)
        response.data = data
        response.summary = summary
      }
      Object.assign(response, { source: isCache ? 'cache' : 'network' })
    }
  }

  if (method === 'GET') {
    const queryraws = req.query
    const queries = filterRequest(queryraws)

    const currency = await getCurrency()
    let response = {}
    if (isExpired(filename, queries, 3, 'minute') || queryraws?.update) {
      const [error, result] = await request(urlText, pathChild, { method, queries })
        .then(v => [null, v]).catch(e => [e, null])
      removeCache(filename, queries)
      addCache(filename, queries, result)
      response = error ? error : result
      callbackResponse(response, currency, queryraws)
    } else {
      const resultCache = getCache(filename, queries)
      response = resultCache || {}
      callbackResponse(response, currency, queryraws, true)
    }
    res.status(200).json(response)
  } else {
    let payloads = req.body
    let queries = req.query
    if (method === 'POST') {
      payloads = [setPayload(payloads, true)]
    } else if (method === 'PUT') {
      const id = queries?.id || null
      const search = uuidValidate(id) ? { uuid: id } : { komoditas: id }
      payloads = { condition: search, set: setPayload(payloads) }
    } else if (method === 'DELETE') {
      let params = {}
      if (typeof payloads === 'string') {
        try {
          params = JSON.parse(payloads)
        } catch (error) {}
      }
      const id = params?.id || null
      const search = uuidValidate(id) ? { uuid: id } : { komoditas: id }
      payloads = { condition: search, limit: 1 }
    }
    const [error, result] = await request(urlText, pathChild, { method, payloads })
      .then(v => [null, v]).catch(e => [e, null])
    if (error) {
      res.status(200).json(error)
    } else {
      res.status(200).json(result)
    }
  }
}
