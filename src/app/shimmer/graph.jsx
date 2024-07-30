import React from 'react'

export default function GraphShimmer() {
  return (
    <div className='flex w-full gap-3'>
      <div className='animate-pulse w-1/2 '>
        <div className=' bg-gray-200 rounded h-96'></div>
      </div>
      <div className='animate-pulse w-1/2 '>
        <div className=' bg-gray-200 rounded h-96'></div>
      </div>
    </div>
  )
}
