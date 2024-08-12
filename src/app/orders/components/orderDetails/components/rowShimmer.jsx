export default function RowShimmer() {
	return (
		<tr className='border-b dark:border-neutral-600 hover:bg-neutral-100  animate-pulse'>
			<td className='px-6 py-4'>
				<div className='h-4 bg-gray-200 rounded w-6'></div>
			</td>
			<td className='font-bold px-6 py-4'>
				<div className=''>
					<div className='flex items-center w-full gap-2'>
						<div className='w-20 h-20 bg-gray-200 rounded'></div>
						<div className='w-24 h-8 bg-gray-200 rounded'></div>
					</div>
				</div>
			</td>

			<td className='px-6 py-4'>
				<div className='h-4 bg-gray-200 rounded w-24'></div>
			</td>

			<td className='px-6 py-4'>
				<div className='h-4 bg-gray-200 rounded w-24'></div>
			</td>

			<td className='px-6 py-4 font-bold'>
				<div className='h-4 bg-gray-200 rounded w-20'></div>
			</td>
		</tr>
	)
}
