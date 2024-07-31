import { searchOrders } from '../../../api/function'
import { IoIosClose } from 'react-icons/io'
import { CiSearch } from 'react-icons/ci'

export default function SearchBar({ setOrders, searchTerm, setSearchTerm }) {
	const handleChange = (event) => {
		setSearchTerm(event.target.value)
	}

	const debounce = (func, delay) => {
		let timeoutId
		return function (...args) {
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => {
				func.apply(this, args)
			}, delay)
		}
	}

	const onSearch = async (searchTerm) => {
		// Make an API call to fetch the orders based on the search term
		setOrders(null)
		const data = { search: searchTerm }
		await searchOrders(data)
			.then((response) => {
				setOrders(response.data)
			})
			.catch((error) => {
				console.error(error)
			})
	}

	const debouncedSearch = debounce(async (searchTerm) => {
		await onSearch(searchTerm)
	}, 500) // Adjust the delay time as needed

	const handleDebouncedSearch = (event) => {
		const searchTerm = event.target.value
		if (searchTerm !== '') {
			debouncedSearch(searchTerm)
		}
	}

	return (
		<div className='relative'>
			<input
				value={searchTerm}
				onChange={handleChange}
				onKeyUp={handleDebouncedSearch}
				placeholder='Search orders by ID or customer name.'
				className='w-64 px-2 pt-[5px] pb-[9px] pr-6 border rounded placeholder:text-xs'
			/>
			{!searchTerm ? (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth='1.5'
					stroke='currentColor'
					className='w-[1.3rem] h-[0.9rem] absolute top-2 right-1 mt-[5px]'
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
					className='absolute mt-[2px] top-1 right-1 cursor-pointer'
					onClick={() => {
						setSearchTerm('')
					}}
				/>
			)}
		</div>
	)
}
