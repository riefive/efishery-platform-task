import { useRouter } from 'next/router'
import { PaperAirplaneIcon, HomeIcon, ViewBoardsIcon } from '@heroicons/react/solid'
import { menus } from '../handlers/constants'

function LayoutWide({ children }) {
  const router = useRouter()

  const pathName = router?.pathname
  if (typeof window === 'object') {
    const body = document?.querySelector('body') || null
    if (body) body.style.zoom = 0.75
  }

  return (
    <div className="flex bg-white w-full">
      <div className="flex-none bg-red-400 w-2/12 h-[133vh] p-[20px]">
          <div className="text-md text-gray-50 font-semibold capitalize">
            <div className="flex items-center">
              <PaperAirplaneIcon className="w-6 h-6 text-white mx-[5px]" />
              <span className="text-sm">
                {String(process.env.NEXT_PUBLIC_APP_TITLE || '').toLowerCase()}
              </span>
            </div>
          </div>
          <div className="border-t-4 border-gray-50 my-[5px]" />
          <div className="mt-[25px]">
          {
            (() => {
              let container = [];
              menus?.forEach((value, index) => {
                let icon = null
                const iconClass = pathName === value.click ? 'h-8 md:h-6 w-8 md:w-6 text-red-400' : 'h-8 md:h-6 w-8 md:w-6 text-gray-50'
                const textClass = pathName === value.click ? 'text-md md:text-sm text-red-400 font-normal capitalize' : 'text-lg md:text-sm text-gray-50 font-normal capitalize'
                const menuClass = `menu-hover ${(pathName === value.click ? 'menu-active' : '').trim()} flex flex-row cursor-pointer select-none p-[10px] mb-[10px]`
                if (value.id === 1) {
                  icon = <HomeIcon className={iconClass} />
                } else {
                  icon = <ViewBoardsIcon className={iconClass}/>
                }
                container.push(
                  <div key={index} className={menuClass} onClick={() => router.push(value.click)}>
                    <div className="flex-none mr-[5px]">
                      { icon }
                    </div>
                    <div className="flex-none mt-[4px] md:mt-[2px]">
                      <span className={textClass}>{ value.text }</span>
                    </div>
                  </div>
                )
              });
              return container;
            })()
          }
          </div>
      </div>
      <div className="scrollbar-thin flex-none w-10/12 max-h-[725px] p-[10px] mt-[10px] overflow-y-scroll">
        {children}
      </div>
    </div>
  )
}

export default LayoutWide
