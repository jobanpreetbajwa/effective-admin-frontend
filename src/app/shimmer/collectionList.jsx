import React from 'react'

export default function CollectionList() {
  return (
    <div className='flex items-center  border-b cursor-pointer '>
      <div className='flex gap-3 p-3'>
        <div className='rounded-full bg-gray-200 rounded  text-gray-900 whitespace-nowrap dark:text-white h-12 w-12 '></div>
        <div className='flex flex-col'>
          <div className='h-4 bg-gray-200 rounded  text-gray-900 whitespace-nowrap dark:text-white w-24 mt-1 rounded'></div>
          <div className='h-3 bg-gray-200 rounded  text-gray-900 whitespace-nowrap dark:text-white w-16 mt-1 rounded'></div>
        </div>
      </div>
      <div className='relative ml-auto px-4'></div>
    </div>
  )
}
