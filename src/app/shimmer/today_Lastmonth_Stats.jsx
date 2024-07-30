import React from 'react'

export default function Today_Lastmonth_Stats() {
  return (
    <div className='flex flex-col gap-3 rounded-lg justify-center items-center w-96 animate-pulse'>
      <div className='flex flex-col gap-4 justify-centers w-full font-semibold'>
        <div className='flex gap-6 justify-center items-center rounded-lg bg-lime-50 border p-8 w-full'>
          <div className='rounded-full h-12 w-12 bg-gray-200'></div>
          <div className='flex flex-col gap-4 w-40 '>
            <p className='h-4 bg-gray-200 rounded w-full'></p>
            <p className='h-4 bg-gray-200 rounded w-full'></p>
          </div>
        </div>

        <div className='flex gap-4 justify-center items-center p-8 border rounded-lg bg-fuchsia-50 w-full'>
          <div className='rounded-full h-12 w-12 bg-gray-200'></div>
          <div className='flex flex-col gap-4 w-40'>
            <p className='h-4 bg-gray-200 rounded w-full'></p>
            <p className='h-4 bg-gray-200 rounded w-full'></p>
          </div>
        </div>

        <div className='flex gap-4 justify-center items-center p-8 border rounded-lg bg-amber-50 w-full'>
          <div className='rounded-full h-12 w-12 bg-gray-200'></div>
          <div className='flex flex-col gap-4 w-40'>
            <p className='h-4 bg-gray-200 rounded w-full'></p>
            <p className='h-4 bg-gray-200 rounded w-full'></p>
          </div>
        </div>
      </div>
    </div>
  )
}
