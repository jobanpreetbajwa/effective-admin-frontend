import React from 'react'

export default function NavSidebarHandler({ SidebarHandler, sidebar }) {
  return (
    <div
      className={`absolute bottom-2 flex gap-3 justify-between p-3  bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700  `}
    >
      <p className={`${sidebar ? 'hidden' : 'visible '}`}>HIDE SIDEBAR</p>
      <p
        onClick={SidebarHandler}
        className=' text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group hover:cursor-pointer'
      >
        {sidebar ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5'
            />
          </svg>
        )}
      </p>
    </div>
  )
}
