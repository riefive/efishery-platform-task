import { useEffect, useState } from 'react'
import { ExclamationIcon, XIcon, SearchIcon, RefreshIcon } from '@heroicons/react/solid'
import { Button, InputText, InputSelect } from './Elements'

export function ModalSelection(props) {
  const title = props?.title || 'pilihan'
  const clicked = props?.clicked || null
  const mode = props?.mode || 'none'
  const data = props?.data || null

  function handleButton(menu, index) {
    clicked(menu, mode, index)
  }

  const listContent = !Array.isArray(data) ? <div /> : 
  (
    <div className="select-none"> 
      {
        (() => {
          const rows = []
          for (let i = 0; i < data.length; i++) {
            const element = data[i]
            rows.push(
              <div 
                key={i} 
                className="border border-gray-100 hover:border-red-400 rounded-md text-sm cursor-pointer p-2 mb-2" 
                onClick={() => handleButton('click', i)}
              >
                {element}
              </div>
            )
          }
          return rows
        })()
      }
    </div>
  )

  return (
    <div className="modal hidden z-[100]" id="selection-modal">
      <div className="modal-wrapper">
        <div className="modal-content">
          <div className="flex justify-between items-center p-2">
            <span className="text-lg font-medium text-red-600 capitalize">{title}</span>
            <button className="modal-close" onClick={() => handleButton('close')}>
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="border-line"></div>
          <div className="modal-content-select mt-[5px]">
            {listContent}  
          </div>
          <div className="p-2">
            <div className="grid grid-cols-1 gap-[5px]">
              <Button text="tutup" type="danger" clicked={() => handleButton('close')}><span /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ModalFilter(props) {
  const title = 'filter pencarian'
  const actived = props?.actived || false
  const clicked = props?.clicked || null
  const data = props?.data || null

  function handleButton(menu) {
    const modalEl = document.querySelector('#filter-modal')
    let params = {}
    if (modalEl) { 
      const comodityEl = modalEl.querySelector('#comodity input[type="text"]')
      const provinceEl = modalEl.querySelector('#province input[type="text"]')
      const cityEl = modalEl.querySelector('#city input[type="text"]')

      params = { comodityName: comodityEl?.value, province: provinceEl?.value, city: cityEl?.value }
    }
    clicked(menu, params)
  }

  function init(isActive) {
    const el = document.querySelector('#filter-modal #comodity input[type="text"]')
    if (isActive && el) {
      el.focus()
    }
  }

  useEffect(() => { init(actived) }, [actived])

  return (
    <div className="modal hidden" id="filter-modal">
      <div className="modal-wrapper">
        <div className="modal-content">
          <div className="flex justify-between items-center p-2">
            <span className="text-lg font-medium text-red-600 capitalize">{title}</span>
            <button className="modal-close" onClick={() => handleButton('close')}>
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="border-line"></div>
          <div className="modal-content-child mt-[5px]">
            <InputText id="comodity" label="nama komoditas" placeholder="Isi nama komoditas" value={data?.comodity} />
            <InputSelect id="province" label="pilih provinsi" placeholder="Pilih area provinsi" value={data?.province} clicked={() => handleButton('open-province')} />
            <InputSelect id="city" label="pilih kota" placeholder="Pilih area kota sesudah provinsi" value={data?.city} clicked={() => handleButton('open-city')} />
          </div>
          <div className="p-2">
            <div className="grid grid-cols-2 gap-[5px]">
              <Button text="reset" type="secondary" clicked={() => handleButton('reset')}>
                <RefreshIcon className="w-5 h-5 mr-1" />
              </Button>
              <Button text="cari" type="danger" clicked={() => handleButton('save')}>
                <SearchIcon className="w-5 h-5 mr-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ModalForm(props) {
  const title = props?.title || 'form pengisian harga'
  const actived = props?.actived || false
  const clicked = props?.clicked || null
  const data = props?.data || null

  const [comodityType, setComodityType] = useState('normal')
  const [provinceType, setProvinceType] = useState('normal')
  const [cityType, setCityType] = useState('normal')
  const [sizeType, setSizeType] = useState('normal')
  const [priceType, setPriceType] = useState('normal')

  function handleButton(menu) {
    const modalEl = document.querySelector('#form-modal')
    // validation
    let countError = 0
    let params = {}
    if (menu === 'save' && modalEl) { 
      const comodityEl = modalEl.querySelector('#comodity input[type="text"]')
      const provinceEl = modalEl.querySelector('#province input[type="text"]')
      const cityEl = modalEl.querySelector('#province input[type="text"]')
      const sizeEl = modalEl.querySelector('#size input[type="text"]')
      const priceEl = modalEl.querySelector('#price input[type="number"]')

      setComodityType(comodityEl?.value === '' ? 'danger' : 'normal')
      setProvinceType(provinceEl?.value === '' ? 'danger' : 'normal')
      setCityType(cityEl?.value === '' ? 'danger' : 'normal')
      setSizeType(sizeEl?.value === '' ? 'danger' : 'normal')
      setPriceType(priceEl?.value === '' ? 'danger' : 'normal')

      if (comodityEl?.value === '' || provinceEl?.value === '' || cityEl?.value === '' || sizeEl?.value === '' || priceEl?.value === '') {
        countError++
      }
      params = { comodityName: comodityEl?.value, province: provinceEl?.value, city: cityEl?.value, size: sizeEl?.value, price: priceEl?.value }
    }
    if (countError > 0) return
    clicked(menu, params)
  }

  function init(isActive) {
    const el = document.querySelector('#form-modal #comodity input[type="text"]')
    if (isActive && el) {
      el.focus()
    }
  }

  useEffect(() => { init(actived) }, [actived])

  return (
    <div className="modal hidden" id="form-modal">
      <div className="modal-wrapper">
        <div className="modal-content">
          <div className="flex justify-between items-center p-2">
            <span className="text-md font-medium text-red-600 capitalize">{title}</span>
            <button className="modal-close" onClick={() => handleButton('close')}>
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="border-line"></div>
          <div className="modal-content-child">
            <InputText id="comodity" label="nama komoditas" placeholder="Isi nama komoditas" required={true} type={comodityType} value={data?.comodity} />
            <InputSelect id="province" label="pilih provinsi" placeholder="Pilih area provinsi" required={true} type={provinceType} value={data?.province} clicked={() => handleButton('open-province')} />
            <InputSelect id="city" label="pilih kota" placeholder="Pilih area kota sesudah provinsi" required={true} type={cityType} value={data?.city} clicked={() => handleButton('open-city')} />
            <InputSelect id="size" label="pilih ukuran" placeholder="Pilih ukuran" required={true} type={sizeType} value={data?.size} clicked={() => handleButton('open-size')} />
            <InputText id="price" label="harga" placeholder="Isi harga item" required={true} type={priceType} value={data?.price} inputType="number" />
          </div>
          <div className="p-2">
            <div className="grid grid-cols-2 gap-[5px]">
              <Button text="batal" type="secondary" clicked={() => handleButton('close')}><span /></Button>
              <Button text="simpan" type="danger" clicked={() => handleButton('save')}><span /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ModalQuestion(props) {
  const questionText = 'Apakah anda yakin menghapus item ini?'
  const clicked = props?.clicked || null
  
  function handleSave() {
    clicked('save')
  }

  function handleClose() {
    clicked('close')
  }

  return (
    <div className="modal hidden" id="popup-modal">
      <div className="modal-wrapper">
        <div className="modal-content">
          <div className="flex justify-end p-2">
            <button className="modal-close" onClick={handleClose}>
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col justify-center items-center p-6 pt-0">
            <ExclamationIcon className="w-24 h-24 text-red-400" />
            <span className="text-lg font-normal text-gray-500 mb-5">{questionText}</span>
            <div className="grid grid-cols-2 gap-[5px] w-full mt-10">
              <Button text="batal" type="secondary" clicked={handleClose}><span /></Button>
              <Button text="yakin" type="danger" clicked={handleSave}><span /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
