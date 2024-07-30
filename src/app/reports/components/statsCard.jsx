import React from 'react'
import OrdersIcon from './ordersIcon'
import SalesIcon from './salesIcon'
import VisitorIcon from './visitorIcon'

export default function StatsCard({ item, type }) {
  return (
    <div className='  flex flex-col gap-3 rounded-lg justify-center items-center '>
      <div className='flex flex-col gap-4  justify-centers w-full font-semibold '>
        <div
          className='flex gap-6 justify-start items-center rounded-lg bg-[#F4F9F2]
#F4F9F2]  p-8 w-full'
        >
          <div className=' flex justify-center items-center rounded-full shadow-lg bg-white h-14 w-14 p-2'>
            <OrdersIcon />
          </div>
          <div className='flex flex-col tracking-wide gap-1 w-40 '>
            <p className='text-[#75AD63] flex gap-1 text-xl '>Total Orders</p>
            <p
              className={`text-black text-2xl font-semibold flex flex-wrap ${
                ('' + item?.orders).length >= 8
                  ? ('' + item?.orders).length >= 13
                    ? 'text-xs'
                    : 'text-xs'
                  : ''
              }`}
            >
              {item?.orders || '0'}
            </p>
          </div>
        </div>

        <div className='flex gap-6 justify-start items-center p-8  rounded-lg bg-[#FDE9FF] w-full'>
          <div className=' flex justify-center items-center rounded-full shadow-lg bg-white h-14 w-14 p-2'>
            <SalesIcon />
          </div>
          <div className='flex flex-col gap-1 w-40 tracking-wide '>
            <p className='text-[#EE55FF] flex gap-1 text-xl'>Total Sales</p>
            <p
              className={`text-black text-2xl font-semibold flex flex-wrap ${
                ('' + item?.sales).length >= 8
                  ? ('' + item?.sales).length >= 13
                    ? 'text-xs'
                    : 'text-xs'
                  : ''
              } `}
            >
              ₹{parseFloat(item?.sales || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className='flex gap-6 justify-start items-center p-8  rounded-lg bg-[#FFF0E4] w-full'>
          <div className='flex justify-center items-center rounded-full shadow-lg bg-white h-14 w-14 p-2'>
            <VisitorIcon />
          </div>
          <div className='flex flex-col gap-1 w-40 tracking-wide '>
            <p className='text-[#FF923F] flex gap-1 text-xl'>Unique Visitors</p>
            <p
              className={`text-black text-2xl font-semibold flex flex-wrap ${
                ('' + item?.visitors).length >= 8
                  ? ('' + item?.visitors).length >= 13
                    ? 'text-xs'
                    : 'text-xs'
                  : ''
              }`}
            >
              {item?.visitors || '0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
