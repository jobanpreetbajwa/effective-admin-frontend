import React from 'react'

export default function ProductSearchList() {
  return (
    <div className='flex px-4 py-2 items-center w-full justify-between bg-gray-50 animate-pulse'>
      <div className='h-6 w-1/6 flex gap-1 '>
        <div className='h-6 w-6 rounded-full bg-gray-300'></div>
        <div className='w-full bg-gray-200 rounded'></div>
      </div>
      <div className='h-6 w-1/6 bg-gray-200 rounded'></div>
      <div className='h-6 w-1/6 bg-gray-200 rounded'></div>
      <div className='h-6 w-1/6 bg-gray-200 rounded'></div>
    </div>
  )
}
