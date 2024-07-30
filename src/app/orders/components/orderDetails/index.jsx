import moment from 'moment'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import AdminNote from './components/adminNote'
import ProductList from './components/productList'
import CustomerNote from './components/customerNote'
// import ToggleSwitch from '../../../components/toggleSwitch'
import OrderStatusChangeDropdown from '../dropdowns/orderStatusChange'
import { ORDER_STATUS_INDICATOR, PAYMENT_MODE } from '../../utils/constants'
import {
  getOrderById,
  getOrderSummary,
  updateOrderStatus,
} from '../../../../api/function'
import { MRP_PRICE_FIXED_VALUE } from '../../../constant/products/constant'

import { IoIosArrowRoundBack } from 'react-icons/io'
import CancellationNote from './components/cancellationNote'

export default function OrderDetails() {
  const { orderID } = useParams()
  const [orderDetails, setOrderDetails] = useState(null)
  const [orderStatus, setOrderStatus] = useState(null)
  // const [showPricingSwitch, setShowPricingSwitch] = useState(false)

  const [total, setTotal] = useState(null)

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
  console.log(orderDetails)
  // Get Order Details
  const getOrderDetails = async () => {
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
      })
      .catch((error) => {
        console.error(error)
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

  // Function to calculate total quantity of products
  function calculateTotalQuantity(products) {
    let totalQuantity = 0

    products.forEach((product) => {
      totalQuantity += product.quantity
    })
    return totalQuantity
  }

  return (
    <div className='p-4'>
      <Link to={`/orders`} className='flex items-center w-fit'>
        <IoIosArrowRoundBack size={32} />
        <p>Back</p>
      </Link>

      <div className='flex items-center justify-between'>
        <div className='mt-6'>
          <h1 className='font-semibold'>#{orderID}</h1>
          Ordered On :
          {orderDetails?.date
            ? `${orderDetails?.date &&
                moment
                  .utc(orderDetails?.date)
                  .format('ddd MMM DD YYYY')} at ${orderDetails?.date &&
                moment.utc(orderDetails?.date).format('hh:mm A')}`
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
          <div className='flex flex-col px-10 py-6 gap-4 rounded bg-gray-100'>
            <div className='grid grid-cols-8 place-items-center gap-6 font-bold'>
              <div className='col-span-1 text-nowrap'>Sr. No.</div>

              <div className='col-span-3'>Product</div>

              <p className='col-span-2 text-nowrap'>Price & Quantity</p>

              <p className='col-span-2 font-semibold'>Price</p>
            </div>

            {orderDetails?.items ? (
              orderDetails?.items?.length ? (
                orderDetails?.items.map((product, index) => (
                  <ProductList
                    index={index}
                    product={product}
                    key={product?._id}
                  />
                ))
              ) : (
                <p>No Product Available</p>
              )
            ) : (
              // Loading Skeleton
              <div className='grid grid-cols-3 place-items-center gap-2 animate-pulse'>
                <div className='flex gap-2 items-center w-48'>
                  <div className='w-16 h-16 bg-gray-200 rounded'></div>
                  <div>
                    <div className='h-4 bg-gray-200 rounded w-24 mb-1'></div>
                    <div className='h-4 bg-gray-200 rounded w-10'></div>
                  </div>
                </div>
                <div className='h-4 bg-gray-200 rounded w-16'></div>
                <div className='h-4 bg-gray-200 rounded w-16'></div>
              </div>
            )}

            <hr />

            <div className='grid grid-cols-8 place-items-center gap-6'>
              <div className='flex items-center gap-4  col-span-2'>
                <p className='font-semibold text-nowrap'>Total Quantity</p>

                <p className='font-semibold text-xl'>
                  {orderDetails?.items?.length &&
                    calculateTotalQuantity(orderDetails?.items)}
                </p>
              </div>
              <div className='col-span-3'></div>

              <div className='flex items-center gap-4 col-span-3 '>
                <p className='text-nowrap font-semibold'>Total Price</p>

                <p className=' font-semibold text-xl'>
                  {total ? `₹${total?.toFixed(MRP_PRICE_FIXED_VALUE)}` : ' N/A'}
                </p>
              </div>
            </div>
          </div>

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
                    `${(orderDetails?.deliveryAddress?.toUpperCase() ?? '') +
                      ' ' +
                      (orderDetails?.city?.toUpperCase() ?? '') +
                      ' ' +
                      (orderDetails?.state?.toUpperCase() ?? '') +
                      ' ' +
                      (orderDetails?.pin ?? '')}`
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
