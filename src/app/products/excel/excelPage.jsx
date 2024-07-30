import { Table } from 'flowbite-react'

const ExcelTableBody = ({ item }) => {
	return (
		<>
			<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-200 cursor-pointer'>
				<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
					{item?.name}
				</Table.Cell>
				<Table.Cell>{item?.description}</Table.Cell>
				<Table.Cell>{item?.mrp_price}</Table.Cell>
				<Table.Cell>{item?.discounted_price}</Table.Cell>
				<Table.Cell>{item?.prod_status ? 'Visible' : 'Hidden'}</Table.Cell>
			</Table.Row>
		</>
	)
}

export default function ExcelPage({ productList }) {
	return (
		<div className='overflow-x-auto'>
			<Table striped>
				<Table.Head>
					<Table.HeadCell>Product name</Table.HeadCell>
					<Table.HeadCell>Description</Table.HeadCell>
					<Table.HeadCell>MRP Price</Table.HeadCell>
					<Table.HeadCell>Discounted Price</Table.HeadCell>
					<Table.HeadCell>Product Status</Table.HeadCell>
				</Table.Head>

				<Table.Body className='divide-y'>
					{productList ? (
						productList?.map((item, i) => {
							return <ExcelTableBody item={item} key={i} />
						})
					) : (
						<div className='flex h-full w-full justify-center items-center text-rose-700 py-4'>
							No Data Available In This Collection.
						</div>
					)}
				</Table.Body>
			</Table>
		</div>
	)
}
