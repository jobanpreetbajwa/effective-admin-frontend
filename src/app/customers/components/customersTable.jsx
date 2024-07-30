import { Table } from 'flowbite-react'

import CustomersShimmer from '../../shimmer/customersShimmer'
import { capitalizeFirstLetter } from '../../../utils/function'

export default function CustomersTable({
	customersData,
	currentPage,
	limit,
	isLoading,
}) {
	const startIndex = (currentPage - 1) * limit

	return (
		<div className='px-4 pb-1 max-h-full overflow-auto'>
			<Table hoverable striped className='w-full'>
				<Table.Head>
					<Table.HeadCell className='flex gap-4 h-full'>
						<p className='w-10'>Sr.No</p>
						<p>Customer Name</p>
					</Table.HeadCell>
					<Table.HeadCell>Address</Table.HeadCell>
					<Table.HeadCell>Contact Details</Table.HeadCell>
					<Table.HeadCell>Email</Table.HeadCell>
					<Table.HeadCell>No. of Orders</Table.HeadCell>
					<Table.HeadCell>No. of Enquiries</Table.HeadCell>
					<Table.HeadCell>No. of Views</Table.HeadCell>
				</Table.Head>
				<Table.Body>
					{!isLoading ? (
						customersData && customersData?.length ? (
							customersData?.map((item, index) => {
								return (
									<Table.Row key={index}>
										<Table.Cell className='flex gap-6'>
											<p className='w-10'>{startIndex + index + 1}</p>
											<p className='text-wrap'>
												{capitalizeFirstLetter(item?.user_name)}
											</p>
										</Table.Cell>
										<Table.Cell>
											<p className='flex flex-wrap'>{item?.address}</p>
										</Table.Cell>
										<Table.Cell>{item?.phoneNumber}</Table.Cell>
										<Table.Cell>
											<p className='flex flex-wrap'> {item?.user_email}</p>
										</Table.Cell>
										<Table.Cell>{item?.orders}</Table.Cell>
										<Table.Cell>{item?.enquiries}</Table.Cell>
										<Table.Cell>{item?.views}</Table.Cell>
									</Table.Row>
								)
							})
						) : (
							<Table.Row className='text-rose-600  py-4 text-center'>
								<Table.Cell colSpan={7}>No Customers Available!</Table.Cell>
							</Table.Row>
						)
					) : (
						<CustomersShimmer />
					)}
				</Table.Body>
			</Table>
		</div>
	)
}
