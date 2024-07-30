export default function TableRowShimmer() {
	return (
		<tr className='animate-pulse'>
			<td className='px-6 py-4 w-4'>
				<div className='h-4 w-4 bg-gray-200 rounded'></div>
			</td>
			<td className='px-6 py-4 w-1/12'>
				<div className='h-4 bg-gray-200 rounded'></div>
			</td>
			<td className='px-6 py-4 w-1/6'>
				<div className='h-4 bg-gray-200 rounded'></div>
			</td>
			<td className='px-6 py-4 w-1/6'>
				<div className='h-4 bg-gray-200 rounded'></div>
			</td>
			<td className='px-6 py-4 w-1/12'>
				<div className='h-4 bg-gray-200 rounded'></div>
			</td>

			<td className='px-6 py-4 w-8'>
				<div className='h-4 bg-gray-200 rounded'></div>
			</td>

			<td className='px-6 py-4 w-1/6'>
				<div className='h-4 bg-gray-200 rounded'></div>
			</td>

			<td className='px-6 py-4 w-1/6'>
				<div className='h-4 bg-gray-200 rounded'></div>
			</td>
		</tr>
	)
}
