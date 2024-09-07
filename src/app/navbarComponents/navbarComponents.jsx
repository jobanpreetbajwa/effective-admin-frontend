import { NavLink } from 'react-router-dom'
import { GoPeople } from 'react-icons/go'
import { CiSettings } from 'react-icons/ci'
import { BiSolidOffer } from "react-icons/bi";
import { TiMessages } from 'react-icons/ti'
export default function NavbarComponents({ sidebar }) {
	return (
		<ul className='flex flex-col gap-2 h-fit overflow-y-auto'>
			<NavLink
				to='/'
				className={({ isActive }) => {
					const activeStyle = isActive
						? 'bg-slate-200 '
						: 'hover:bg-slate-100 hover:cursor-pointer '

					return `text-slate-900 rounded-lg w-full dark:text-white group ${activeStyle}`
				}}
			>
				<div className='flex gap-2 items-center p-2'>
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
							d='m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
						/>
					</svg>
					<p className={`${sidebar ? 'hidden' : 'visible'} whitespace-nowrap`}>
						Home
					</p>
				</div>
			</NavLink>

			<NavLink
				to='/products'
				className={({ isActive }) => {
					const activeStyle = isActive
						? 'bg-slate-200 '
						: 'hover:bg-slate-100 hover:cursor-pointer '

					return `text-slate-900 rounded-lg w-full dark:text-white group ${activeStyle}`
				}}
			>
				<div className='flex gap-2 w-full items-center p-2'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='w-6 h-6'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
						/>
					</svg>

					<p className={`${sidebar ? 'hidden' : 'visible'} whitespace-nowrap`}>
						Products
					</p>
				</div>
			</NavLink>

			<NavLink
				to='/orders'
				className={({ isActive }) => {
					const activeStyle = isActive
						? 'bg-slate-200 '
						: 'hover:bg-slate-100 hover:cursor-pointer '

					return `text-slate-900 rounded-lg w-full dark:text-white group ${activeStyle}`
				}}
			>
				<div className='flex gap-2 items-center p-2'>
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
							d='M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3'
						/>
					</svg>

					<p className={`${sidebar ? 'hidden' : 'visible'} whitespace-nowrap`}>
						Orders
					</p>
				</div>
			</NavLink>

			<NavLink
				to='/customers'
				className={({ isActive }) => {
					const activeStyle = isActive
						? 'bg-slate-200 '
						: 'hover:bg-slate-100 hover:cursor-pointer '

					return `text-slate-900 rounded-lg w-full dark:text-white group ${activeStyle}`
				}}
			>
				<div className='flex gap-2 items-center p-2 text-slate-900 rounded-lg hover:cursor-pointer dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 group'>
					<GoPeople size={20} />
					<span
						className={`${sidebar ? 'hidden' : 'visible'} whitespace-nowrap`}
					>
						Customers
					</span>
				</div>
			</NavLink>

			<NavLink
				to='/reports'
				className={({ isActive }) => {
					const activeStyle = isActive
						? 'bg-slate-200 '
						: 'hover:bg-slate-100 hover:cursor-pointer '

					return `text-slate-900 rounded-lg w-full dark:text-white group ${activeStyle}`
				}}
			>
				<div className='flex gap-2 items-center p-2 text-slate-900 rounded-lg hover:cursor-pointer dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 group'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 16 16'
						fill='currentColor'
						className='w-6 h-6'
					>
						<path
							fillRule='evenodd'
							d='M4 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Zm.75 7a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 1.5 0v-1.5A.75.75 0 0 0 4.75 9Zm2.5-1.75a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4Zm4-3.25a.75.75 0 0 0-.75.75v6.5a.75.75 0 0 0 1.5 0v-6.5a.75.75 0 0 0-.75-.75Z'
							clipRule='evenodd'
						/>
					</svg>
					<span
						className={`${sidebar ? 'hidden' : 'visible'} whitespace-nowrap`}
					>
						Reports
					</span>
				</div>
			</NavLink>

			{/* <NavLink
        to='/messages'
        className={({ isActive }) => {
          const activeStyle = isActive
            ? 'bg-slate-200 '
            : 'hover:bg-slate-100 hover:cursor-pointer '

          return `text-slate-900 rounded-lg w-full dark:text-white group ${activeStyle}`
        }}
      >
        <div className='flex gap-2 items-center p-2 text-slate-900 rounded-lg hover:cursor-pointer dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 group'>
          <TiMessages size={24} />
          <span
            className={`${sidebar ? 'hidden' : 'visible'} whitespace-nowrap`}
          >
            Messages
          </span>
        </div>
      </NavLink> */}
	  		<NavLink
				to='/create_offers'
				className={({ isActive }) => {
					const activeStyle = isActive
						? 'bg-slate-200 '
						: 'hover:bg-slate-100 hover:cursor-pointer '

					return `text-slate-900 rounded-lg w-full dark:text-white group ${activeStyle}`
				}}
			>
				<div className='flex gap-2 items-center p-2 text-slate-900 rounded-lg hover:cursor-pointer dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 group'>
					<BiSolidOffer size={24} />
					<span
						className={`${sidebar ? 'hidden' : 'visible'} whitespace-nowrap`}
					>
						Offers
					</span>
				</div>
			</NavLink>
			<NavLink
				to='/settings'
				className={({ isActive }) => {
					const activeStyle = isActive
						? 'bg-slate-200 '
						: 'hover:bg-slate-100 hover:cursor-pointer '

					return `text-slate-900 rounded-lg w-full dark:text-white group ${activeStyle}`
				}}
			>
				<div className='flex gap-2 items-center p-2 text-slate-900 rounded-lg hover:cursor-pointer dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 group'>
					<CiSettings size={24} />
					<span
						className={`${sidebar ? 'hidden' : 'visible'} whitespace-nowrap`}
					>
						Settings
					</span>
				</div>
			</NavLink>
		</ul>
	)
}
