import { ArrowUpIcon, ArrowDownIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/outline'
import { tableColumns } from '../handlers/constants'
import { debounce } from '../helpers/commons'

export function TableBasic(props) {
  const columns = props?.columns || []
  const lists = props?.data || []

  const Columns = []
  const Rows = []

  columns?.forEach((item, index) => {
    Columns.push(
      <th key={index} className="text-sm text-red-600 font-medium uppercase p-[8px]">
        <div className="flex justify-between items-center cursor-pointer">
          {item.text}
        </div>
      </th>
    )
  })

  lists?.forEach((item, index) => {
    const rowClass = 'border-collapse border border-red-400 text-sm capitalize p-[10px]'
    const rowContents = []
    if (typeof item === 'object' && Object.keys(item).length > 0) {
      for (const key in item) {
        const element = item[key]
        rowContents.push(
          <td key={key} className={rowClass}>{element}</td>
        )
      }
    }
    Rows.push(
      <tr key={index}>
        {rowContents}
      </tr>
    )
  })

  return (
    <div>
      <table className="table-fixed border-collapse border border-red-400 select-none w-full">
        <thead>
          <tr className="border-collapse border border-red-400">
            {Columns}
          </tr>
        </thead>
        <tbody>
          {Rows}
        </tbody>
      </table>
      <div className="h-[100px]" />
    </div>
  )
}

export function TableBasicWide(props) {
  const clicked = props?.clicked || null
  const lists = props?.lists || []

  const Columns = []
  const Rows = []
  const Filters = []

  function handleFilter(event, item, lists) {
    const target = event?.target
    if (target) {
      const value = target?.value
      debounce(() => {
        clicked('filter', { value, item, lists })
      }, 500)()
    }
  }

  function handleSort(index, item, lists) {
    clicked('sort', { index, item, lists })
  }

  function handleEdit(item) {
    clicked('edit', { item })
  }

  function handleRemove(id) {
    clicked('remove', { id })
  }

  tableColumns?.forEach((item, index) => {
    const inputType = item.name === 'comodity' ? 'text' : 'number'
    const sortIcon = item.sort && item.sort === 'asc' ? 
      <ArrowDownIcon className="w-4 h-4 text-red-400 mt-[2px]" /> : <ArrowUpIcon className="w-4 h-4 text-red-400 mt-[2px]" />
    const sortComponent = item.sortable ? sortIcon : <div />
    Columns.push(
      <th key={index} className="text-sm text-red-600 font-medium uppercase p-[8px]">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => handleSort(index, item, lists)}>
          {item.text}
          {sortComponent}
        </div>
      </th>
    )
    
    if (item?.filter) {
      Filters.push(
        <th key={`input-${index}`} className="p-[10px] w-10/12">
          <input type={inputType} className="input-table-text" onChange={(value) => handleFilter(value, item, lists)} />
        </th>
      )
    }
  })

  Columns.push(<th key={Columns.length} className="text-sm text-red-600 font-medium uppercase p-[8px]">Aksi</th>)

  lists?.forEach((item, index) => {
    const rowClass = 'border-collapse border-t border-red-400 text-sm p-[10px]'
    const ButtonComponent = (item.uuid || item.comodityName) ? <div className="flex justify-center">
      <div className="p-[5px]">
        <div onClick={() => handleEdit(item)}>
          <button className="button-base bg-yellow-400 text-white w-10 h-10">
            <PencilAltIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-[5px]">
        <button className="button-base bg-red-400 text-white w-10 h-10" onClick={() => handleRemove(item.uuid || item.comodityName)}>
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div> : <div className="flex justify-start">-</div>

    Rows.push(
      <tr key={index}>
        <td className={rowClass}>{(index + 1)}. {item.comodityName || 'Tidak Ada Nama'}</td>
        <td className={rowClass}>{item.size || 0}</td>
        <td className={rowClass}>Rp. {item.price || 0}</td>
        <td className={rowClass}>$ {item.priceUsd || 0}</td>
        <td className={rowClass}>{ ButtonComponent }</td>
      </tr>
    )
  })

  return (
    <div>
      <table className="table-auto border-collapse border-b border-red-400 select-none w-full">
        <thead>
          <tr className="border-collapse border-t border-red-400">
            {Columns}
          </tr>
          <tr>
            {Filters}
          </tr>
        </thead>
        <tbody>
          {Rows}
        </tbody>
      </table>
      <div className="h-[100px]" />
    </div>
  )
}