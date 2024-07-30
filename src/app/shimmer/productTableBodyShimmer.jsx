import { Table } from 'flowbite-react'

export default function ProductTableBodyShimmer() {
	return (
		<Table.Row className='animate-pulse'>
			<Table.Cell className='col-span-1 w-40'>
				<div className='flex items-center gap-12'>
					<div className='h-4 w-4 bg-gray-200 rounded'></div>
					<span className='h-4 w-4 bg-gray-200 rounded'></span>
				</div>
			</Table.Cell>

			<Table.Cell className='w-full col-span-full flex items-center gap-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
				<div className='w-full flex items-center gap-4'>
					<div className='h-8 w-8 rounded-full bg-gray-200'></div>
					<div className='h-4 w-[60%] bg-gray-200 rounded'></div>
				</div>
			</Table.Cell>

			<Table.Cell className='col-span-2'>
				<div className='flex items-center gap-4'>
					<div className='w-11 h-6 bg-gray-200 rounded-full'></div>
					<div className='h-4 w-10 bg-gray-200 rounded'></div>
				</div>
			</Table.Cell>

			<Table.Cell className='col-span-1 px-6 py-4'>
				<div className='h-4 w-16 bg-gray-200 rounded'></div>
			</Table.Cell>

			<Table.Cell className='col-span-2 relative h-full'>
				<div className='flex items-center gap-4'>
					<div className='h-4 w-16 bg-gray-200 rounded'></div>
					<div className='h-4 w-4 px-1 bg-gray-200 rounded'></div>
				</div>
			</Table.Cell>
		</Table.Row>
	)
}
