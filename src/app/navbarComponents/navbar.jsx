import { useState } from 'react'

import { CiLogout } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import NavbarComponents from './navbarComponents'
import NavSidebarHandler from './navSidebarHandler'

export default function Navbar({ sidebar, setSideBar }) {
  const [dropdown, setDropDown] = useState(false)

  const navigate = useNavigate()

  //toggle dropdown state.
  const dropdownHandler = () => {
    setDropDown(!dropdown)
  }
  //toggle sidebar state.
  const SidebarHandler = () => {
    setSideBar(!sidebar)
  }
  //delete token from localhost and navigate to login page.
  const logoutHandler = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div
      className={`w-${sidebar ? '20' : '56'} ${
        sidebar ? 'flex' : ''
      } border fixed z-50 top-0 left-0 h-full p-4 transition-width duration-300  bg-white dark:bg-gray-800 transition-all ease-in-out delay-1050 `}
      aria-labelledby='drawer-navigation-label'
    >
      <button
        id='drawer-navigation-label'
        className={`${
          sidebar ? 'hidden' : 'visible w-44'
        } text-gray-500 uppercase dark:text-gray-400 font-medium rounded-lg text-sm text-center inline-flex items-center`}
        onClick={dropdownHandler}
      >
        Satya Tech Store
        <svg
          className='w-2.5 h-2.5 ms-3'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 10 6'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='m1 1 4 4 4-4'
          />
        </svg>
      </button>
      {dropdown && !sidebar && (
        <div className=' bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 '>
          <div className='py-1 px-4 flex justify-between items-center text-sm text-gray-700 cursor-pointer hover:bg-gray-100 dark:text-gray-200'>
            <CiLogout size={20} />
            <div
              className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              onClick={logoutHandler}
            >
              LogOut
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col h-fit py-4  '>
        <NavbarComponents sidebar={sidebar} />
      </div>

      <NavSidebarHandler sidebar={sidebar} SidebarHandler={SidebarHandler} />
    </div>
  )
}
