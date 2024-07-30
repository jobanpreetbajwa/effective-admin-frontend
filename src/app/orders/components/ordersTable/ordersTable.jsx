import OrderList from './orderList'
import TableRowShimmer from './shimmer'
import { Table, Alert, Checkbox, Spinner } from 'flowbite-react'

import { FaInfoCircle } from 'react-icons/fa'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function OrdersTable({
	orders,
	LIMIT,
	scrollRef,
	hasMorePages,
	isFetchingOrders,
	setOrders,
	currentPage,
	setCurrentPage,
	selectedOrdersData,
	setSelectedOrdersData,
	allOrdersSelected,
	setAllOrdersSelected,
}) {
	// console.log(isFetchingOrders,"abcd")
	const checkAllOrdersHandler = (e) => {
		if (e.target.checked) {
			setSelectedOrdersData(orders)
			setAllOrdersSelected(true)
		} else {
			setSelectedOrdersData([])
			setAllOrdersSelected(false)
		}
	}

	const checkBoxHandler = (e, order) => {
		const { checked } = e.target

		if (checked) {
			setSelectedOrdersData((prev) => [...prev, order])
		} else {
			setSelectedOrdersData((prev) =>
				prev.filter((selectedOrder) => selectedOrder._id !== order._id)
			)
		}
	}

	useEffect(() => {
		if (orders) {
			if (orders.length === selectedOrdersData.length && orders.length !== 0) {
				setAllOrdersSelected(true)
			} else {
				setAllOrdersSelected(false)
			}
		}
	}, [selectedOrdersData])

	const handleScrolling = () => {
		setCurrentPage(currentPage + 1)
	}
	return (
		<div
			className='mt-3 w-full  min-h-96 lg:max-h-[70vh]  xl:max-h-[80vh] overflow-auto'
			id='scrollableOrderDiv'
			ref={scrollRef}
		>
			<Table hoverable striped className=' h-full'>
				<Table.Head>
					<Table.HeadCell className='col-span-1 pr-2 md:pr-4'>
						<div className='flex items-center gap-6'>
							<Checkbox
								value=''
								type='checkbox'
								id='default-checkbox'
								checked={allOrdersSelected}
								onChange={checkAllOrdersHandler}
								className='disabled:cursor-not-allowed'
								disabled={orders?.length ? false : true}
							/>
							<span className='text-nowrap'>Sr. No.</span>
						</div>
					</Table.HeadCell>
					<Table.HeadCell className='px-2 md:px-4'>Order ID</Table.HeadCell>
					<Table.HeadCell className='px-2 md:px-4'>Customers</Table.HeadCell>
					<Table.HeadCell className='text-nowrap'>Date & Time</Table.HeadCell>
					<Table.HeadCell className='px-2 md:px-4'>Amount</Table.HeadCell>
					<Table.HeadCell className='px-2 md:px-4'>Items</Table.HeadCell>
					<Table.HeadCell>Delivery Address</Table.HeadCell>
					<Table.HeadCell>Status</Table.HeadCell>
				</Table.Head>

				<Table.Body className='divide-y pb-16 overflow-y-auto'>
					{orders ? (
						orders?.length ? (
							orders.map((order, index) => (
								<OrderList
									key={order?.orderId}
									order={order}
									index={index}
									LIMIT={LIMIT}
									orders={orders}
									setOrders={setOrders}
									currentPage={currentPage}
									selectedOrdersData={selectedOrdersData}
									checkBoxHandler={checkBoxHandler}
								/>
							))
						) : null
					) : (
						<TableRowShimmer />
					)}
				</Table.Body>
			</Table>
			<InfiniteScroll
				dataLength={LIMIT * currentPage}
				hasMore={hasMorePages}
				next={() => {
					handleScrolling()
				}}
				scrollableTarget='scrollableOrderDiv'
				loader={
					isFetchingOrders && (
						<div className='mt-2 flex justify-center items-center'>
							<Spinner aria-label='Default status example' />
						</div>
					)
				}
				endMessage={
					!isFetchingOrders && !hasMorePages && Boolean(orders?.length) ? (
						<p className='mt-2 text-center'>
							<b>End Of Order List</b>
						</p>
					) : null
				}
			/>

			{/* If no orders are found, show this alert */}
			{orders ? (
				orders?.length ? null : (
					<Alert color='warning' className='mt-4 flex gap-2'>
						<span className='font-medium flex gap-1 items-center'>
							<FaInfoCircle /> No orders found. Please check back later.
						</span>
					</Alert>
				)
			) : null}
		</div>
	)
}
