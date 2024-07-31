import React from 'react'
import ToggleSwitch from '../../components/toggleSwitch'
import { useEffect } from 'react'
import { useState } from 'react'

export default function ShowPrice_onStatus({
	price_status_toggle,
	handleStatusChange,
}) {
	//   const [statusArray, setStatusArray] = useState([...price_status_toggle])

	//   useEffect(() => {
	//     setStatusArray([...price_status_toggle])
	//   }, [price_status_toggle])
	const changeShowPriceBit = (status, index) => {
		// setStatusArray((prev) => {
		//   let temp = [...prev]
		//   temp[index] = status
		//   return temp
		// })
		let temp = [...price_status_toggle]
		temp[index] = status
		handleStatusChange(temp)
	}

	return (
		<div className='p-4 sm:p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700  dark:bg-gray-800'>
			<div className='h-fit'>
				<h3 className='mb-4 text-xl font-semibold dark:text-white'>
					Show Price To Customer
				</h3>

				<div className='grid grid-cols-1 md:grid-cols-2  gap-6'>
					{/* Pending */}
					<div className='col-span-1 '>
						<ToggleSwitch
							label='Pending'
							name='Pending'
							checked={price_status_toggle[0] ? price_status_toggle[0] : false}
							onChange={(e) => changeShowPriceBit(!price_status_toggle[0], 0)}
						/>
					</div>

					{/* In Progress */}
					<div className='col-span-1 '>
						<ToggleSwitch
							name='In Progress'
							label='In Progress'
							checked={price_status_toggle[5] ? price_status_toggle[5] : false}
							onChange={(e) => changeShowPriceBit(!price_status_toggle[5], 5)}
						/>
					</div>

					{/* Shipped */}
					<div className='col-span-1 '>
						<ToggleSwitch
							name='Shipped'
							label='Shipped'
							checked={price_status_toggle[3] ? price_status_toggle[3] : false}
							onChange={(e) => changeShowPriceBit(!price_status_toggle[3], 3)}
						/>
					</div>

					{/* Delivered */}
					<div className='col-span-1 '>
						<ToggleSwitch
							name='Delivered'
							label='Delivered'
							checked={price_status_toggle[1] ? price_status_toggle[1] : false}
							onChange={(e) => changeShowPriceBit(!price_status_toggle[1], 1)}
						/>
					</div>

					{/* Returned */}
					<div className='col-span-1 '>
						<ToggleSwitch
							name='Returned'
							label='Returned'
							checked={price_status_toggle[4] ? price_status_toggle[4] : false}
							onChange={(e) => changeShowPriceBit(!price_status_toggle[4], 4)}
						/>
					</div>

					{/*Cancel */}
					<div className='col-span-1 '>
						<ToggleSwitch
							name='Cancelled'
							label='Cancelled'
							checked={price_status_toggle[2] ? price_status_toggle[2] : false}
							onChange={(e) => changeShowPriceBit(!price_status_toggle[2], 2)}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
