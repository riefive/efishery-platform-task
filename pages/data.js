import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PlusIcon, SearchIcon } from '@heroicons/react/solid'
import { initialized, fetchPrice, postPrice, putPrice, deletePrice } from '../src/handlers/hooks'
import { Button } from '../src/components/Elements'
import { ModalSelection, ModalFilter, ModalForm, ModalQuestion } from '../src/components/Modals'
import { Loading, Refreshing, NotFound } from '../src/components/Supports'
import { TableBasicWide } from '../src/components/Tables'
import { tableColumns } from '../src/handlers/constants'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [modeSelect, setModeSelect] = useState('')
  const [titleSelect, setTitleSelect] = useState(null)
  const [titleForm, setTitleForm] = useState(null)
  const [listSelect, setListSelect] = useState([])
  const [lists, setLists] = useState([])
  const [dataForm, setDataForm] = useState({})
  const [modeForm, setModeForm] = useState('add')
  const regions = useSelector(state => state.regions)
  const sizes = useSelector(state => state.sizes?.values || [])
  const dispatch = useDispatch()

  async function refresh(query) {
    if (loading) return
    const params = !query || Object.keys(query).length === 0 ? { limit: 100 } : query
    await fetchPrice(params).then(res => {
      setLoading(true)
      if (res?.data) {
        setLists(res.data)
      }
      setLoading(false)
    })
  }

  function init() {
    initialized(dispatch)
    refresh()
  }

  function callbackForm(menu) {
    if (menu === 'open-province') {
      handleModalSelect('open')
      setModeSelect('province')
      setTitleSelect('pilihan provinsi')
      setListSelect(regions?.provinces)
    } else if (menu === 'open-city') {
      const provinceCurrent = dataForm?.province || null
      const cityFilter = provinceCurrent ? 
        regions?.cities?.filter(item => item.province === provinceCurrent)?.map(item => item.city) : 
        regions?.cities?.map(item => item.city)
      handleModalSelect('open')
      setModeSelect('city')
      setTitleSelect('pilihan kota')
      setListSelect(cityFilter)
    } else if (menu === 'open-size') {
      handleModalSelect('open')
      setModeSelect('size')
      setTitleSelect('pilihan ukuran')
      setListSelect(sizes?.map(item => item.size))
    }
  }

  function callbackAfterSelect(mode, index) {
    const forms = Object.assign({}, dataForm)
    if (mode === 'province') {
      Object.assign(forms, { province: listSelect[index] || null, city: null })
    }
    if (mode === 'city') {
      Object.assign(forms, { city: listSelect[index] || null })
    }
    if (mode === 'size') {
      Object.assign(forms, { size: listSelect[index] || null })
    }
    setDataForm(forms)
  }

  function handleModalSelect(menu, mode, index) {
    const element = document.getElementById('selection-modal')
    if (element) {
      element.classList.toggle('hidden')
    }
    if (mode && index > -1) {
      callbackAfterSelect(mode, index)
    } 
  }

  function handleModalFilter(menu, additions) {
    if (['open', 'close', 'save', 'reset'].includes(menu)) {
      const element = document.getElementById('filter-modal')
      if (element) {
        element.classList.toggle('hidden')
      }
      setShowPopup(!showPopup)
      if (menu === 'save') {
        const params = {}
        if (additions?.comodityName !== '') params.name = additions?.comodityName
        if (additions?.province !== '') params.province = additions?.province
        if (additions?.city !== '') params.city = additions?.city
        if (Object.keys(params).length === 0) params.limit = 100
        setDataForm(null)
        refresh(Object.assign(params, { update: true }))
      } else if (menu === 'reset') {
        setDataForm(null)
        refresh(Object.assign({ limit: 100, update: true }))
      }
    } else {
      callbackForm(menu)
    }
  }

  async function handleModalForm(menu, additions) {
    if (['open', 'close', 'save'].includes(menu)) {
      const element = document.getElementById('form-modal')
      if (element) {
        element.classList.toggle('hidden')
      }
      setShowPopup(!showPopup)
      if (menu === 'save') {
        const mode = modeForm
        if (mode === 'edit') {
          const id = dataForm?.uuid || null
          await putPrice({ id }, additions)
        } else if (mode === 'add') {
          await postPrice(additions)
        }
        setModeForm('none')
        setDataForm(null)
        await refresh({ limit: 100, update: true })
      }
    } else {
      callbackForm(menu)
    }
  }

  async function handlePopup(menu) {
    const element = document.getElementById('popup-modal')
    if (element) {
      element.classList.toggle('hidden')
    }
    setShowPopup(!showPopup)
    if (menu === 'save') {
      const id = dataForm?.uuid || null
      await deletePrice({ id })
      setDataForm(null)
      await refresh({ limit: 100, update: true })
    }
  }

  function handleAdd() {
    setDataForm(null)
    setTitleForm('form tambah harga')
    setModeForm('add')
    handleModalForm('open')
  }

  function handleTable(menu, additions) {
    if (menu === 'edit') {
      const item = additions?.item || null
      if (item) {
        setDataForm({ uuid: item?.uuid, comodity: item?.comodityName, province: item?.areaProvince, city: item?.areaCity, size: item?.size, price: item?.price })
        setTitleForm('form edit harga')
        setModeForm('edit')
        handleModalForm('open')
      }
    } else if (menu === 'remove') {
      const id = additions?.id || null
      if (id) {
        setDataForm({ uuid: id })
        handlePopup('open')
      }
    } else if (menu === 'sort') {
      const index = additions?.index || 0
      const item = additions?.item || null
      const lists = additions?.lists || []
      if (item.sort) {
        const name = item.name || null
        const sort = item.sort === 'asc' ? 'desc' : 'asc'
        tableColumns[index].sort = sort
        if (name === 'comodity') {
          if (sort === 'asc') {
            lists.sort((a, b) => a.komoditas > b.komoditas ? -1 : 1)
          } else {
            lists.sort((a, b) => a.komoditas < b.komoditas ? -1 : 1)
          }
        } else if (name === 'size') {
          if (sort === 'asc') {
            lists.sort((a, b) => Number(a.size) - Number(b.size))
          } else {
            lists.sort((a, b) => Number(b.size) - Number(a.size))
          }
        } else if (name === 'price') {
          if (sort === 'asc') {
            lists.sort((a, b) => Number(a.price) - Number(b.price))
          } else {
            lists.sort((a, b) => Number(b.price) - Number(a.price))
          }
        }
      }
    } else if (menu === 'filter') {
      const value = additions?.value || null
      const item = additions?.item || null
      const lists = additions?.lists || []
      
    }
  }

  useEffect(() => { init() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[10px]">
        <Button text="filter pencarian" type="secondary" clicked={() => handleModalFilter('open')}>
          <SearchIcon className="w-5 h-5 mr-[5px]" />
        </Button>
        <Button text="tambah harga" type="danger" clicked={() => handleAdd()}>
          <PlusIcon className="w-5 h-5 mr-[5px]" />
        </Button>
      </div>
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
              return <TableBasicWide lists={lists} clicked={handleTable} />
            }
          })()
        }
      </div>
      <div className={showPopup ? 'popup' : ''}>
        <ModalSelection title={titleSelect} mode={modeSelect} data={listSelect} clicked={handleModalSelect} />
        <ModalFilter actived={showPopup} data={dataForm} clicked={handleModalFilter} />
        <ModalForm title={titleForm} actived={showPopup} data={dataForm} clicked={handleModalForm} />
        <ModalQuestion clicked={handlePopup} />
      </div>
    </div>
  )
}
