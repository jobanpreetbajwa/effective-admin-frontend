import { searchOrders } from '../../../api/function'

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
				className='w-64 px-2 py-1 pr-6 font-extralight border rounded placeholder:text-xs'
			/>
			<div className='absolute right-1 top-2'>
				<CiSearch size={18} />
			</div>
		</div>
	)
}
