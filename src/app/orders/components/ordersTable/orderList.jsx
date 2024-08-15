import moment from 'moment'
import { toast } from 'sonner'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table } from 'flowbite-react/components/Table'
import { updateOrderStatus } from '../../../../api/function'
import { ORDER_STATUS_INDICATOR } from '../../utils/constants'
import OrderStatusChangeDropdown from '../dropdowns/orderStatusChange'
import { Checkbox, Popover } from 'flowbite-react'
import { useEffect } from 'react'

export default function OrderList({
	order,
	LIMIT,
	index,
	orders,
	setOrders,
	currentPage,
	checkBoxHandler,
	allOrdersSelected,
	selectedOrdersData,
}) {
	const navigate = useNavigate()
	const [orderStatus, setOrderStatus] = useState(order?.status)

	useEffect(() => {
		setOrderStatus(order?.status)
	}, [orders])

	const changeStatusOfOrder = (newOrderStatus) => {
		const data = {
			orderID: order?._id,
			data: { status: newOrderStatus },
		}
		if (newOrderStatus !== 2) {
			data['data'].cancellation_reason = ''
		}

		const promise = updateOrderStatus(data)
			.then((response) => {
				// search this order with the orderID and update the status
				const updatedOrders = orders?.map((item) => {
					if (item?._id === order?._id) {
						return response?.data
					}
					return item
				})

				setOrders(updatedOrders)
				setOrderStatus(response?.data?.status)
				return response?.data?.status
			})
			.catch((error) => {
				console.error(error)
				throw new Error(error)
			})

		toast.promise(promise, {
			loading: 'Updating Status...',
			success: (status) => {
				return `Status updated to ${ORDER_STATUS_INDICATOR[status]}`
			},
			error: 'Error updating status. Please try again.',
		})
	}

	const startIndex = (currentPage - 1) * LIMIT
	console.log('order', order)
	return (
		<>
			<Table.Row
				className='bg-white hover:cursor-pointer'
				onClick={(event) => {
					event.stopPropagation()

					navigate(`/orders/${order?.orderId}`)
				}}
			>
				<Table.Cell
					onClick={(e) => {
						e.stopPropagation()
					}}
					className='pr-2 md:pr-4 '
				>
					<div className='flex items-center gap-6'>
						<Checkbox
							value=''
							type='checkbox'
							className='w-4 h-4'
							checked={allOrdersSelected || selectedOrdersData.includes(order)}
							onChange={(event) => checkBoxHandler(event, order)}
						/>
						<span className='ml-4'>{index + 1}</span>
					</div>
				</Table.Cell>

				<Table.Cell className='px-2 md:px-4 font-medium text-gray-900'>
					{order?.orderId}
				</Table.Cell>

				<Table.Cell className='px-2 lg:px-4 w-[100px] md:w-fit'>
					<div className='w-[100px] md:w-fit text-pretty truncate'>
						{order?.name}
					</div>
				</Table.Cell>

				<Table.Cell className='xl:w-8 2xl:truncate'>
					{`${moment.utc(order?.date).format('ddd MMM DD YYYY HH:mm')} `}
				</Table.Cell>

				<Table.Cell className='px-2 md:px-4 truncate'>
					{order?.totalAmount ? `₹${order?.totalAmount}` : 'N/A'}
				</Table.Cell>

				<Table.Cell className='px-2 md:px-4 truncate'>
					{order?.itemsCount > 1
						? `${order?.itemsCount} Items`
						: `${order?.itemsCount} Item`}
				</Table.Cell>

				<Table.Cell>
					<Popover
						content={
							<div className='max-w-44 h-fit p-2 text-balance'>
								{order?.deliveryAddress ? (
									<>
										{(order?.deliveryAddress?.toUpperCase() ?? '') +
											' ' +
											(order?.city?.toUpperCase() ?? '') +
											' ' +
											(order?.state?.toUpperCase() ?? '') +
											' ' +
											(order?.pin ?? '')}
									</>
								) : (
									'N/A'
								)}
							</div>
						}
						trigger='hover'
					>
						<p className='truncate min-w-32 text-balance line-clamp-2'>
							{order?.deliveryAddress ? (
								<>
									{(order?.deliveryAddress?.toUpperCase() ?? '') +
										' ' +
										(order?.city?.toUpperCase() ?? '') +
										' ' +
										(order?.state?.toUpperCase() ?? '') +
										' ' +
										(order?.pin ?? '')}
								</>
							) : (
								'N/A'
							)}
						</p>
					</Popover>
					{/* <p className='truncate min-w-28 text-balance line-clamp-2'>
						{order?.deliveryAddress ? (
							<>
								{(order?.deliveryAddress?.toUpperCase() ?? '') +
									' ' +
									(order?.city?.toUpperCase() ?? '') +
									' ' +
									(order?.state?.toUpperCase() ?? '') +
									' ' +
									(order?.pin ?? '')}
							</>
						) : (
							'N/A'
						)}
					</p> */}
				</Table.Cell>

				<Table.Cell
					onClick={(e) => {
						e.stopPropagation()
					}}
				>
					<OrderStatusChangeDropdown
						orderId={order?.orderId}
						orderStatus={orderStatus}
						changeStatusOfOrder={changeStatusOfOrder}
					/>
				</Table.Cell>
			</Table.Row>
		</>
	)
}
