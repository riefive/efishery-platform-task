import { useEffect, useState } from 'react'
import { CollectionIcon } from '@heroicons/react/outline'
import { Loading, Refreshing, NotFound } from '../src/components/Supports'
import { CardSimple } from '../src/components/Cards'
import { TableBasic } from '../src/components/Tables'
import { fetchPrice } from '../src/handlers/hooks'
import { Media } from '../src/handlers/breakpoint'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [lists, setLists] = useState([])
  const [summaryOne, setSummaryOne] = useState([])
  const [summaryTwo, setSummaryTwo] = useState([])
  const [summaryThree, setSummaryThree] = useState([])

  const columnOne = [
    { name: 'name', text: 'Keterangan' },
    { name: 'value', text: 'Nilai' }
  ]
  const columnTwo = [
    { name: 'name', text: 'Nama' },
    { name: 'count', text: 'Jumlah' },
    { name: 'max', text: 'Max' },
    { name: 'min', text: 'Min' },
    { name: 'price', text: 'Harga' },
    { name: 'priceUsd', text: 'Harga USD' },
    { name: 'avg', text: 'Avg' },
    { name: 'percent', text: 'Percent %' },
  ]
  const columnThree = [
    { name: 'name', text: 'Area' },
    { name: 'count', text: 'Jumlah' },
    { name: 'max', text: 'Max' },
    { name: 'min', text: 'Min' },
    { name: 'price', text: 'Harga' },
    { name: 'priceUsd', text: 'Harga USD' },
    { name: 'avg', text: 'Avg' },
    { name: 'percent', text: 'Percent %' },
  ]

  async function refresh() {
    if (loading) return
    await fetchPrice({ limit: 100, summary: true }).then(res => {
      setLoading(true)
      if (res?.data) {
        setLists(res.data)
      }
      if (res?.summary) {
        const summaries = res?.summary || null
        const all = summaries?.all
        const comodity = summaries?.comodity
        const city = summaries?.city
        const arraysOne = []
        const arraysTwo = []
        const arraysThree = []
        Object.keys(all).forEach(item => {
          arraysOne.push({ name: item.toString(), value: all[item] })
        })
        comodity?.forEach(item => {
          arraysTwo.push({ 
            name: item?.id, count: item?.count, max: item?.max || 0, min: item?.min || 0,
            price: item?.price || 0, priceUsd: (item?.priceUsd || 0)?.toFixed(2), avg: item?.average || 0,
            percent: item?.percent || 0
          })
        })
        city?.forEach(item => {
          arraysThree.push({ 
            name: item?.id, count: item?.count, max: item?.max || 0, min: item?.min || 0,
            price: item?.price || 0, priceUsd: (item?.priceUsd || 0)?.toFixed(2), avg: item?.average || 0,
            percent: item?.percent || 0
          })
        })
        setSummaryOne(arraysOne)
        setSummaryTwo(arraysTwo)
        setSummaryThree(arraysThree)
      }
      setLoading(false)
    })
  }

  function mapper(item) {
    return {
      name: item?.name, count: item?.count, max: item?.max || 0, min: item?.min || 0, 
      avg: item?.avg || 0
    }
  }

  useEffect(() => { refresh() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mt-5">
        {
          (() => {
            if (loading) {
              return <Loading />
            } else if (lists.length === 0) {
              return (
                <div className="border border-red-100 p-10">
                  <NotFound />
                  <Refreshing clicked={() => { refresh() }} />
                </div>
              )
            } else {
              return (
                <div>
                  <Media at="sm">
                    <div className="flex flex-row flex-wrap justify-start gap-[10px]">
                      <div className="xs:w-full sm:w-full md:w-6/12 lg:w-8/12 xl:w-full">
                        <CardSimple title="ringkasan semua" icon={<CollectionIcon className="w-5 h-5 text-red-400" />}>
                          <TableBasic columns={columnOne} data={summaryOne} />
                        </CardSimple>
                      </div>
                      <div className="flex-none w-full">
                        <CardSimple title="ringkasan per komoditas" icon={<CollectionIcon className="w-5 h-5 text-red-400" />}>
                          <TableBasic columns={columnTwo?.filter(item => !['price', 'priceUsd', 'percent'].includes(item?.name || ''))} data={summaryTwo.map(item => mapper(item))} />
                        </CardSimple>
                      </div>
                      <div className="flex-none w-full">
                        <CardSimple title="ringkasan per area" icon={<CollectionIcon className="w-5 h-5 text-red-400" />}>
                          <TableBasic columns={columnThree?.filter(item => !['price', 'priceUsd', 'percent'].includes(item?.name || ''))} data={summaryThree.map(item => mapper(item))} />
                        </CardSimple>
                      </div>
                    </div>
                  </Media>
                  <Media greaterThan="sm">
                    <div className="flex flex-row flex-wrap justify-start gap-[10px]">
                      <div className="xs:w-full sm:w-full md:w-6/12 lg:w-8/12 xl:w-full">
                        <CardSimple title="ringkasan semua" icon={<CollectionIcon className="w-5 h-5 text-red-400" />}>
                          <TableBasic columns={columnOne} data={summaryOne} />
                        </CardSimple>
                      </div>
                      <div className="flex-none w-full">
                        <CardSimple title="ringkasan per komoditas" icon={<CollectionIcon className="w-5 h-5 text-red-400" />}>
                          <TableBasic columns={columnTwo} data={summaryTwo} />
                        </CardSimple>
                      </div>
                      <div className="flex-none w-full">
                        <CardSimple title="ringkasan per area" icon={<CollectionIcon className="w-5 h-5 text-red-400" />}>
                          <TableBasic columns={columnThree} data={summaryThree} />
                        </CardSimple>
                      </div>
                    </div>
                  </Media>
                </div>
              )
            }
          })()
        }
      </div>
  )
}
