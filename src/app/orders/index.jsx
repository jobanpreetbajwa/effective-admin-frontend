import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import moment from 'moment'
import { toast } from 'sonner'
import { DateRange } from 'react-date-range'
import { Button, Datepicker, Dropdown, Popover, Tooltip } from 'flowbite-react'
import { useEffect, useState, useRef } from 'react'

import SearchBar from './components/searchBar'
// import ToggleSwitch from '../components/toggleSwitch'
import StatusTopBar from './components/dropdowns/statusTopbar'
import OrdersTable from './components/ordersTable/ordersTable'
import {
	getOrderList,
	getGlobalPricingSwitchAPI,
	setGlobalPricingSwitchAPI,
} from '../../api/function'

import { FcClearFilters } from 'react-icons/fc'
import StatusChange from './components/statusChange/statusChange'

export default function Orders() {
	const scrollRef = useRef(null)
	const [limit, setLimit] = useState(50)
	const [hasMore, setHasMore] = useState(false)
	const [totalPages, setTotalPages] = useState(1)
	const [currentPage, setCurrentPage] = useState(1)

	const [orderStatus, setOrderStatus] = useState('')

	const defaultDateRange = [
		{
			startDate: new Date(),
			endDate: new Date(),
			key: 'selection',
		},
	]

	const [date, setDate] = useState([
		{
			startDate: null,
			endDate: null,
			key: 'selection',
		},
	])

	const [orders, setOrders] = useState(null)
	const [searchTerm, setSearchTerm] = useState('')

	const [selectedOrdersData, setSelectedOrdersData] = useState([])
	const [allOrdersSelected, setAllOrdersSelected] = useState(false)

	const [isFetchingOrders, setIsFetchingOrders] = useState(false)
	// const [showGlobalPricingSwitch, setShowGlobalPricingSwitch] = useState(false)

	// This function is called when the status is changed
	const handleStatusChange = (status) => {
		setOrderStatus('' + status)
		setSelectedOrdersData([])
		setCurrentPage(1)
		scrollRef.current.scroll({
			top: 0,
		})
	}

	// This function is called when the date is changed
	const handleDateChange = (item) => {
		setDate([item.selection])

		// setDate(moment.utc(date).local().format('MM/DD/YYYY'))
		scrollRef.current.scroll({
			top: 0,
		})
		setCurrentPage(1)
	}

	// const handleGlobalShowPricingSwitch = (event) => {
	//   // Here you can make an API call to update the status of the order
	//   if (event.target.checked) {
	//     setShowGlobalPricingSwitch(true)

	//     setGlobalPricingSwitchAPI(1).then((response) => {
	//       // setShowGlobalPricingSwitch(checked)
	//     })
	//   } else {
	//     setShowGlobalPricingSwitch(false)

	//     setGlobalPricingSwitchAPI(0).then((response) => {
	//       // setShowGlobalPricingSwitch(checked)
	//     })
	//   }
	// }

	// This function is called to get the orders based on the current page and limit

	const getOrders = async (append) => {
		// setOrders(null);
		if (!append) {
			setSelectedOrdersData([])
		}

		const data = {
			date:
				date[0].startDate &&
				moment.utc(date[0].startDate).local().format('MM/DD/YYYY'),
			toDate:
				date[0].endDate &&
				moment.utc(date[0].endDate).local().format('MM/DD/YYYY'),
			status: orderStatus,
		}

		if (totalPages > 1 && currentPage > Math.ceil(totalPages / limit)) {
			return
		}
		setIsFetchingOrders(true)

		try {
			const response = await getOrderList({ limit, currentPage, data })

			if (response?.data?.message === 'NO_ORDER_TILL_DATE') {
				setOrders([])
				setTotalPages(1)
				return
			}
			if (append) {
				setAllOrdersSelected(false)
				if (orders) {
					setOrders((orders) => [...orders, ...response?.data?.orders])
				} else {
					setOrders(response?.data?.orders)
				}
			} else {
				setOrders(response?.data?.orders)
			}

			setTotalPages(response?.data?.totalOrders)
			const moreData = +limit * currentPage < +response?.data?.totalOrders
			setHasMore(moreData)
		} catch (error) {
			console.error(error)
			toast.error('Something went wrong!', {
				id: 'fetchingOrders',
			})
		} finally {
			setIsFetchingOrders(false)
		}
	}

	useEffect(() => {
		setAllOrdersSelected(false)
		if (orderStatus || date) {
			getOrders(false)
		}
		if (!orderStatus) {
			getOrders(false)
		}
	}, [orderStatus, date])

	// This function is called when the orderStatus, date or currentPage is changed

	useEffect(() => {
		if (currentPage > 1) {
			getOrders(true)
		}
	}, [currentPage, limit])

	// This function is called when the search term is changed
	useEffect(() => {
		if (searchTerm === '' && limit) {
			setTimeout(getOrders, 600)
		}
	}, [searchTerm])

	const handleClearFilter = () => {
		setDate([
			{
				startDate: null,
				endDate: null,
				key: 'selection',
			},
		])
		setSearchTerm('')
		setCurrentPage(1)
		setOrderStatus('')
		setSelectedOrdersData([])
	}

	return (
		<div className='p-4 overscroll-none'>
			<div className='grid grid-cols-1 w-full'>
				<div className='flex gap-3 w-96 items-center'>
					<h1 className='font-bold text-3xl'>Orders</h1>
					<SearchBar
						setOrders={setOrders}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>
				</div>

				<div className='flex items-center justify-between gap-4 mt-6'>
					<div className='flex gap-4 items-center'>
						<StatusTopBar
							orderStatus={orderStatus}
							handleStatusChange={handleStatusChange}
						/>

						<Popover
							aria-labelledby='default-popover'
							content={
								<div className='w-38 overflow-visible'>
									{/* <Datepicker
										inline
										defaultDate={date ? moment(date)?.toDate() : new Date()}
										onSelectedDateChanged={handleDateChange}
										showClearButton={false}
									/> */}
									<DateRange
										editableDateInputs={false}
										onChange={handleDateChange}
										moveRangeOnFirstSelection={false}
										maxDate={new Date()}
										ranges={date[0].startDate ? date : defaultDateRange}
									/>
								</div>
							}
						>
							<Button outline className='min-w-36'>
								{date[0].startDate
									? date[0].endDate && date[0].startDate !== date[0].endDate
										? `${moment(date[0].startDate)
												.format('MMMM D, YYYY')
												.toString()} -
										  ${moment(date[0].endDate).format('MMMM D, YYYY').toString()}`
										: moment(date[0].startDate)
												.format('MMMM D, YYYY')
												.toString()
									: 'Select Date'}
							</Button>
						</Popover>

						<div onClick={handleClearFilter} className='flex cursor-pointer'>
							<Tooltip content='Clear Filter' placement='right'>
								<FcClearFilters size={28} />
							</Tooltip>
						</div>
					</div>

					<div className='flex gap-4 items-center'>
						{/* <ToggleSwitch
						checked={showGlobalPricingSwitch}
						label='Show Pricing To Customer'
						onChange={handleGlobalShowPricingSwitch}
					/> */}
						<StatusChange
							orders={orders}
							setOrders={setOrders}
							ids={selectedOrdersData?.map((item) => item?._id)}
							setSelectedOrdersData={setSelectedOrdersData}
							setAllOrdersSelected={setAllOrdersSelected}
						/>

						{/* <PaginationButtons
              LIMIT={limit}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            /> */}
					</div>
				</div>

				<OrdersTable
					LIMIT={limit}
					scrollRef={scrollRef}
					hasMorePages={hasMore}
					isFetchingOrders={isFetchingOrders}
					orders={orders}
					setOrders={setOrders}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					allOrdersSelected={allOrdersSelected}
					setAllOrdersSelected={setAllOrdersSelected}
					selectedOrdersData={selectedOrdersData}
					setSelectedOrdersData={setSelectedOrdersData}
				/>
			</div>
		</div>
	)
}
