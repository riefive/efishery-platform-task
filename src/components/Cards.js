export function CardSimple(props) {
  const title = props?.title || 'My card'
  const icon = props?.icon || null
  const children = props?.children || null

  return (
    <div className="shadow-md rounded-md">
      <div className="flex items-center p-[5px]">
        {icon}
        <span className="text-lg font-medium text-red-400 uppercase mx-2">
        {title}
        </span>
      </div>
      <div className="border-b-4 border-red-400" />
      <div className="p-2.5 mt-5">
        {children}
      </div>
    </div>
  )
}