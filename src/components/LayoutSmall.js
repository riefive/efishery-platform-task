import { useRouter } from 'next/router'
import { PaperAirplaneIcon, HomeIcon, ViewBoardsIcon } from '@heroicons/react/solid'
import { menus } from '../handlers/constants'

function LayoutSmall({ children }) {
  const router = useRouter()

  const pathName = router?.pathname
  if (typeof window === 'object') {
    const body = document?.querySelector('body') || null
    if (body) body.style.zoom = 1
  }

  return (
    <div className="relative w-full">
      <div className="fixed top-0 flex items-center bg-red-400 w-full h-[50px] z-10">
        <div className="flex items-center">
          <PaperAirplaneIcon className="w-6 h-6 text-white mx-[5px]" />
          <span className="text-md text-gray-50 font-medium capitalize">
            {String(process.env.NEXT_PUBLIC_APP_TITLE || '').toLowerCase()}
          </span>
        </div>
      </div>
      <div className="p-[10px] mt-[55px]">
        {children}
      </div>
      <div className="fixed bottom-0 bg-white w-full z-10">
        <div className="border-t border-blue-400 mb-[5px]" />
        <div className="columns-2 gap-[3px] mb-[5px]">
        {
          (() => {
            let container = [];
            menus?.forEach((value, index) => {
              let icon = null
              const iconClass = pathName === value.click ? 'h-8 w-8 text-red-400' : 'h-8 w-8 text-gray-400'
              const textClass = pathName === value.click ? 'text-sm text-center text-red-400 font-normal capitalize' : 'text-sm text-center text-gray-400 font-normal capitalize'
              if (value.id === 1) {
                icon = <HomeIcon className={iconClass} />
              } else {
                icon = <ViewBoardsIcon className={iconClass} />
              }
              container.push(
                <div key={index} className="flex flex-col justify-center items-center cursor-pointer select-none" onClick={() => router.push(value.click)}>
                  <div className="flex-none mr-[5px]">
                    { icon }
                  </div>
                  <div className="flex-none mt-[3px]">
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
    </div>
  )
}

export default LayoutSmall
