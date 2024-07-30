import { Button } from 'flowbite-react'
import React from 'react'
const { VITE_BASE_URL } = import.meta.env
import { MdOutlineFileDownload } from 'react-icons/md'
import { getSampleCustomersExcelFile } from '../../../api/function'

import { useRef } from 'react'
import { useState } from 'react'

export default function SearchBar({
  searchItem,
  customersData,
  setSearchItem,
  setCurrentPage,
  type,
}) {
  const [item,setItem] = useState('')
  //debounce function returns a debounced version of a given function, delaying its execution until after a specified wait time has passed since the last invocation.
const timerId = useRef(null)
  const debounce = (func, delay) => {
   
    return function(...args) {
      clearTimeout(timerId.current)
      timerId.current = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }
  //searchHandler function, created using debounce, updates the search criteria with a delay of 400 milliseconds to prevent excessive execution during user input
  const searchHandler = debounce((e) => {
    if (!e.target.value.trim()) {
      setSearchItem('')
      return
    }
    setCurrentPage(1)
    setSearchItem(e.target.value)
  }, 400)

  return (
    <div className='flex p-3 justify-between items-center bg-slate-200'>
      <div className='flex gap-3 justify-start items-center'>
        <h1 className=' text-2xl font-bold'>Customers</h1>
        <div className='relative'>
          <input
          value={item}
            placeholder='Search Customers'
            className='w-64 px-2 py-1 pr-6 font-extralight border rounded placeholder:text-xs'
            onChange={(e)=>{
              if(item){
                setItem(e.target.value)
                searchHandler(e)
              }
              else{
                setItem(e.target.value.trim())
                searchHandler(e)
              }
          }}
          />
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-4 absolute top-2 right-0'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
            />
          </svg>
        </div>
      </div>
      <div className='flex gap-3'>
        <a
          href={`${VITE_BASE_URL}/customers/customer-excel/${type}`}
          className='flex w-44 items-center'
          download='customers.xlsx'
        >
          <Button>
            <p> Download Excel</p>
            <MdOutlineFileDownload size={20} />
          </Button>
        </a>
      </div>
    </div>
  )
}
