import { useSelector } from 'react-redux'

import { IoIosClose } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({
	currentPage,
	searchHandler,
	searchedItem,
	setSearchedItem,
	setSearchedList,
}) {
	const navigate = useNavigate()
	const categoryListSelector = useSelector((state) => state.categoryList)

	const handleSearchInput = (e) => {
		currentPage.current = 1

		if (searchedItem) {
			setSearchedItem(e.target.value)
			searchHandler(e)
		} else {
			setSearchedItem(e.target.value.trim())
			searchHandler(e)
		}
	}

	return (
		<div className='flex gap-3 w-96 '>
			<h1 className='font-bold text-3xl'>Products</h1>
			<div className='relative'>
				<input
					className='w-64 pl-2 pt-[5px] pb-[9px] pr-6 border rounded placeholder:text-sm'
					placeholder='Search'
					value={searchedItem}
					onChange={handleSearchInput}
				/>
				{!searchedItem ? (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth='1.5'
						stroke='currentColor'
						className='w-[1.3rem] h-[0.9rem]  absolute right-1 top-2 mt-[5px]'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
						/>
					</svg>
				) : (
					<IoIosClose
						size={27}
						className='absolute  top-1 mt-[3px] right-1 cursor-pointer'
						onClick={() => {
							setSearchedItem('')
							setSearchedList(null)
							navigate(`/products/${categoryListSelector[0]?._id}`)
						}}
					/>
				)}
			</div>
		</div>
	)
}
