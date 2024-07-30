import { Table } from 'flowbite-react'
import { useState, useEffect } from 'react'
import PendingOrdersStatsShimmer from '../../shimmer/pendingOrdersStatsShimmer'
import { getProductQuantityStats } from '../../../api/function'
import PaginationButtons from '../../orders/components/pagination'
import { toast } from 'sonner'

export default function PendingOrdersStats() {
	const [products, setProducts] = useState(null)

	const limit = 8
	const [totalPages, setTotalPages] = useState(1)
	const [currentPage, setCurrentPage] = useState(1)

	useEffect(() => {
		// This function asynchronously retrieves product quantity statistics.
		const fetchProducts = async () => {
			try {
				const response = await getProductQuantityStats({ limit, currentPage })
				if (response?.data) {
					setProducts(response?.data?.pendingOrders)
					setTotalPages(response?.data?.totalProducts)
				} else {
					setProducts([])
				}
			} catch (error) {
				setProducts([])

				console.log('Error while products-quantity stats ', error)
				toast.error('Something went wrong', {
					id: 'error',
				})
			}
		}
		fetchProducts()
	}, [currentPage])
	const startIndex = (currentPage - 1) * limit
	return (
		<>
			{products ? (
				products?.length ? (
					<div className='w-full lg:w-1/2 pt-4 rounded-lg bg-white '>
						<div className='flex items-center justify-between  w-full'>
							<div className='pl-6 font-bold text-2xl'>
								Pending Order Products
							</div>
							<PaginationButtons
								LIMIT={limit}
								totalPages={totalPages}
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								className='ml-auto w-fit mb-2 mr-2'
							/>
						</div>
						<Table hoverable>
							<Table.Head>
								<Table.HeadCell className='text-center text-nowrap col-span-1'>
									Sr. No.
								</Table.HeadCell>
								<Table.HeadCell className='w-full col-span-2'>
									Product Name
								</Table.HeadCell>
								<Table.HeadCell className='text-center col-span-1'>
									Quantity
								</Table.HeadCell>
							</Table.Head>
							<Table.Body>
								{products.map((item, index) => (
									<Table.Row key={index} className='border-b'>
										<Table.Cell className='text-center'>
											{startIndex + index + 1}
										</Table.Cell>
										<Table.Cell>{item?.productName}</Table.Cell>
										<Table.Cell className='text-center'>
											{item?.totalQuantity}
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</div>
				) : (
					<div className='text-rose-600 w-1/2'>
						{' '}
						No Products-Quantity Data Found!
					</div>
				)
			) : (
				<PendingOrdersStatsShimmer />
			)}
		</>
	)
}
