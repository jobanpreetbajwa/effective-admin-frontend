export default function SearchBar({
	searchHandler,
	searchedItem,
	setSearchedItem,
}) {
	const handleSearchInput = (e) => {
		setSearchedItem(e.target.value)
		searchHandler(e)
	}

	return (
		<div className='flex gap-3 w-96 '>
			<h1 className='font-bold text-3xl'>Products</h1>
			<div className='relative'>
				<input
					className='px-2 py-1 pr-6 font-extralight border rounded'
					placeholder='Search'
					value={searchedItem}
					onChange={handleSearchInput}
				/>
				<div className='absolute right-0 top-2'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth='1.5'
						stroke='currentColor'
						className='w-6 h-4'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
						/>
					</svg>
				</div>
			</div>
		</div>
	)
}
