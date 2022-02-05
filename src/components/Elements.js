import { ChevronRightIcon } from '@heroicons/react/solid'

export function Button(props) {
  const children = props?.children || <div />
  const clicked = props?.clicked || null
  const text = props?.text || 'My Button'
  const type = props?.type || 'primary'

  let classType = 'button-base focus:ring-4'
  if (type === 'primary') { 
    classType += ' focus:ring-blue-300 bg-blue-600 hover:bg-blue-700 text-white'
  } else if (type === 'secondary') {
    classType += ' focus:ring-gray-50 bg-gray-200 hover:bg-gray-300 text-black'
  } else if (type === 'danger') {
    classType += ' focus:ring-red-300 bg-red-600 hover:bg-red-800 text-white'
  }
  
  return (
    <div className={classType} onClick={clicked}>
      {children}
      <span className="text-sm capitalize">
        {text}
      </span>
    </div>
  )
} 

export function InputText(props) {
  const id = props?.id || 'input-text'
  const label = props?.label || null
  const required = props?.required || false
  const placeholder = props?.placeholder || null
  const value = props?.value || ''
  const inputType = props?.inputType || 'text' 
  const type = props?.type || 'normal'

  let classType = 'input-text-base'
  if (type === 'normal') {
    classType += ' focus:ring-blue-300'
  } else if (type === 'danger') {
    classType += ' border-red-300 focus:ring-red-400'
  }

  const labelRequiredContent = !required ? <span /> : <span className="text-sm text-red-400 font-normal ml-[5px]">*</span>
  const labelContent = !label ? <div /> : 
    (
      <div className="mb-[10px]">
			  <label htmlFor={label} className="text-caption text-black font-normal capitalize">{ label }</label>
			  {labelRequiredContent}
		  </div> 
    )
  const mainContent = (
    <div className="mb-15px">
      <input className={classType} placeholder={placeholder} type={inputType} defaultValue={value} />
    </div>
  )

  return (
    <div id={id} className="mb-[25px]">
      {labelContent}
      {mainContent}
    </div>
  )
}

export function InputSelect(props) {
  const id = props?.id || 'input-text'
  const label = props?.label || null
  const required = props?.required || false
  const placeholder = props?.placeholder || null
  const value = props?.value || ''
  const type = props?.type || 'normal'
  const clicked = props?.clicked || null

  let classType = 'input-text-base'
  if (type === 'normal') {
    classType += ' focus:ring-blue-300'
  } else if (type === 'danger') {
    classType += ' border-red-300 focus:ring-red-400'
  }

  const labelRequiredContent = !required ? <span /> : <span className="text-sm text-red-400 font-normal ml-[5px]">*</span>
  const labelContent = !label ? <div /> : 
    (
      <div className="mb-[10px]">
			  <label htmlFor={label} className="text-caption text-black font-normal capitalize">{ label }</label>
			  {labelRequiredContent}
		  </div> 
    )
  const mainContent = (
    <div className="relative mb-15px" onClick={clicked}>
      <ChevronRightIcon className="absolute top-[5px] right-[5px] w-7 h-7 text-gray-400 cursor-pointer" />
      <input className={classType} placeholder={placeholder} readOnly type="text" defaultValue={value} />
    </div>
  )

  return (
    <div id={id} className="mb-[25px]">
      {labelContent}
      {mainContent}
    </div>
  )
}