import { toast } from 'sonner'
import { Dropdown, Table } from 'flowbite-react'
import { useState, useEffect } from 'react'
import PendingOrdersStatsShimmer from '../../shimmer/pendingOrdersStatsShimmer'
import { getProductViewsStats } from '../../../api/function'
import PaginationButtons from '../../orders/components/pagination'

export default function ProductViewsStats() {
	const [products, setProducts] = useState(null)

	const limit = 8
	const [totalPages, setTotalPages] = useState(1)
	const [currentPage, setCurrentPage] = useState(1)

	const [sortBasedOn, setSortBasedOn] = useState(0)

	const SORT_USING = {
		0: 'Views',
		1: 'Orders',
	}

	//// This function asynchronously retrieves product view statistics.

	const fetchProducts = async () => {
		try {
			const response = await getProductViewsStats({
				limit,
				currentPage,
				sortBit: sortBasedOn ? 1 : 0,
			})
			if (response?.data) {
				setProducts(response?.data?.products)
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

	const handleSorting = (e) => {
		setSortBasedOn(!sortBasedOn)
	}

	useEffect(() => {
		fetchProducts()
	}, [currentPage, sortBasedOn])
	const startIndex = (currentPage - 1) * limit
	return (
		<>
			{products ? (
				products?.length ? (
					<div className='w-full lg:w-1/2  pt-4 rounded-lg bg-white '>
						<div className='flex items-center justify-between w-full '>
							<div className='pl-6 font-bold text-2xl'>Product Stats</div>
							<div>
								<Dropdown
									size='xs'
									label={`Sort using ${
										sortBasedOn ? SORT_USING[1] : SORT_USING[0]
									}`}
								>
									<Dropdown.Item onClick={handleSorting}>
										{sortBasedOn ? SORT_USING[0] : SORT_USING[1]}
									</Dropdown.Item>
								</Dropdown>
							</div>

							<PaginationButtons
								LIMIT={limit}
								totalPages={totalPages}
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								className='w-fit mb-2 mr-2'
							/>
						</div>

						<Table hoverable>
							<Table.Head>
								<Table.HeadCell className='text-center text-nowrap col-span-1'>
									Sr. No.
								</Table.HeadCell>
								<Table.HeadCell className='col-span-2'>
									Product Name
								</Table.HeadCell>
								<Table.HeadCell className='text-center col-span-1'>
									Views
								</Table.HeadCell>
								<Table.HeadCell className='text-center col-span-1'>
									Orders
								</Table.HeadCell>
							</Table.Head>
							<Table.Body>
								{products.map((item, index) => (
									<Table.Row key={index} className='border-b'>
										<Table.Cell className='text-center'>
											{startIndex + index + 1}
										</Table.Cell>
										<Table.Cell className='w-full'>
											{item?.productName}
										</Table.Cell>
										<Table.Cell className='text-center'>
											{item?.views}
										</Table.Cell>
										<Table.Cell className='text-center'>
											{item?.orders}
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</div>
				) : (
					<div className='text-rose-600 w-1/2'> No Products Data Found!</div>
				)
			) : (
				<PendingOrdersStatsShimmer />
			)}
		</>
	)
}
