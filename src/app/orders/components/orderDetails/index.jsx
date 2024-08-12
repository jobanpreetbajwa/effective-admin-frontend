import moment from 'moment'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import AdminNote from './components/adminNote'
import ProductTable from './components/productTable'
import CustomerNote from './components/customerNote'
import CancellationNote from './components/cancellationNote'
// import ToggleSwitch from '../../../components/toggleSwitch'
import OrderStatusChangeDropdown from '../dropdowns/orderStatusChange'
import { ORDER_STATUS_INDICATOR, PAYMENT_MODE } from '../../utils/constants'
import {
	getOrderById,
	getOrderSummary,
	updateOrderStatus,
} from '../../../../api/function'

import { IoIosArrowRoundBack } from 'react-icons/io'

export default function OrderDetails() {
	const { orderID } = useParams()
	const [orderDetails, setOrderDetails] = useState(null)
	const [orderStatus, setOrderStatus] = useState(null)
	// const [showPricingSwitch, setShowPricingSwitch] = useState(false)

	const [total, setTotal] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	// Copy to clipboard
	const copyToClipboard = (content) => {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator?.clipboard?.writeText(content)
		} else {
			// Fallback for browsers that don't support the Clipboard API
			const textArea = document.createElement('textarea')
			textArea.value = content
			document.body.appendChild(textArea)
			textArea.select()
			document.execCommand('copy')
			document.body.removeChild(textArea)
		}
		toast.success('Copied to clipboard')
	}

	// Change Status of Order
	const changeStatusOfOrder = (newOrderStatus) => {
		// Here you can make an API call to update the status of the order
		const data = {
			orderID: orderDetails?._id,
			data: {
				status: newOrderStatus,
			},
		}
		if (newOrderStatus !== 2) {
			data['data'].cancellation_reason = ''
		}
		const promise = updateOrderStatus(data)
			.then((response) => {
				setOrderDetails(response?.data)
				return response?.data?.status
			})
			.catch((error) => {
				console.error(error)
			})

		// Show Toast based on the promise
		toast.promise(promise, {
			loading: 'Updating Status...',
			success: (status) => {
				setOrderStatus(newOrderStatus)
				return `Status updated to ${ORDER_STATUS_INDICATOR[status]}`
			},
			error: 'Error updating status. Please try again.',
		})
	}

	// const handleShowPricingSwitch = (e) => {
	// 	// Here you can make an API call to update the showPricingSwitch
	// 	setShowPricingSwitch(!showPricingSwitch)

	// 	getOrderSummary({ orderID, showPrice: showPricingSwitch ? 0 : 1 })
	// 		.then((response) => {
	// 			response?.data?.showSummary
	// 				? toast.success('Showing pricing to customer')
	// 				: toast.success('Hiding pricing to customer')
	// 		})
	// 		.catch((error) => {
	// 			setShowPricingSwitch(showPricingSwitch)
	// 			console.error(error)
	// 		})
	// }

	// Get Order Details
	const getOrderDetails = async () => {
		setIsLoading(true)
		getOrderById(orderID)
			.then((response) => {
				setOrderDetails(response.data)
				if (orderStatus !== response.data.status) {
					setOrderStatus(response?.data?.status)
				}
				// setShowPricingSwitch(response?.data?.showSummary)

				// Calculate Subtotal and Total
				let allTotal = 0

				response?.data?.items.forEach((product) => {
					const totalPrice = product?.price * product.quantity

					allTotal = allTotal + totalPrice
				})

				setTotal(allTotal)
				setIsLoading(false)
			})
			.catch((error) => {
				console.error(error)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	// Call Order Details when orderID changes
	useEffect(() => {
		getOrderDetails()
	}, [orderID])

	// Get Order Details on Order Status Change
	useEffect(() => {
		if (orderStatus) {
			getOrderDetails()
		}
	}, [orderStatus])

	return (
		<div className='p-4'>
			<Link to={`/orders`} className='flex items-center w-fit'>
				<IoIosArrowRoundBack size={32} />
				<p>Back</p>
			</Link>

			<div className='flex items-center justify-between px-4'>
				<div className='mt-6'>
					<h1 className='font-semibold'>#{orderID}</h1>
					Ordered On :
					{orderDetails?.date
						? `${
								orderDetails?.date &&
								moment.utc(orderDetails?.date).format('ddd MMM DD YYYY')
						  } at ${
								orderDetails?.date &&
								moment.utc(orderDetails?.date).format('hh:mm A')
						  }`
						: null}
				</div>

				<div className='flex items-center gap-8 mt-6'>
					{/* {orderStatus === 1 && (
						<ToggleSwitch
							checked={showPricingSwitch}
							label='Show Pricing To Customer'
							onChange={handleShowPricingSwitch}
						/>
					)} */}

					<OrderStatusChangeDropdown
						orderId={orderID}
						orderStatus={orderStatus}
						changeStatusOfOrder={changeStatusOfOrder}
					/>
				</div>
			</div>

			<div className='flex gap-4 mt-6 p-4 '>
				{/* Main Left Side */}
				<div className='flex flex-col gap-4 md:w-2/3'>
					<ProductTable
						total={total}
						isLoading={isLoading}
						orderDetails={orderDetails}
					/>

					<AdminNote orderDetails={orderDetails} />
					{orderDetails?.cancellation_reason ? (
						<CancellationNote orderDetails={orderDetails} />
					) : null}
				</div>

				{/* Right Side */}
				<div className='flex md:w-1/3 flex-col gap-4'>
					{/* Ordered By */}
					<div className='p-4 bg-gray-100 rounded'>
						<h3 className='font-semibold text-lg'>Ordered By :</h3>
						<p className='font-semibold'>{orderDetails?.name}</p>
						<p>{orderDetails?.phoneNumber}</p>

						<p>{orderDetails?.email}</p>
					</div>

					{/* Shipping */}
					<div className='p-4 bg-gray-100 rounded'>
						<div className='flex items-center justify-between'>
							<h3 className='font-semibold text-lg'>Delivery To : </h3>
							<button
								className='text-blue-500'
								onClick={() =>
									copyToClipboard(
										`${
											(orderDetails?.deliveryAddress?.toUpperCase() ?? '') +
											' ' +
											(orderDetails?.city?.toUpperCase() ?? '') +
											' ' +
											(orderDetails?.state?.toUpperCase() ?? '') +
											' ' +
											(orderDetails?.pin ?? '')
										}`
									)
								}
							>
								Copy
							</button>
						</div>

						<p>{orderDetails?.deliveryAddress?.toUpperCase()}</p>
						<p>{orderDetails?.city?.toUpperCase()}</p>
						<p>{orderDetails?.state?.toUpperCase()}</p>
						<p>{orderDetails?.pin}</p>
					</div>

					{/* Payment Mode */}
					<div className='p-4 bg-gray-100 rounded'>
						<h3 className='font-semibold text-lg'>Payment Mode :</h3>

						<p className='font-semibold'>
							{PAYMENT_MODE[orderDetails?.paymentMode]}
						</p>
					</div>

					<CustomerNote user_note={orderDetails?.user_note} />
				</div>
			</div>
		</div>
	)
}
