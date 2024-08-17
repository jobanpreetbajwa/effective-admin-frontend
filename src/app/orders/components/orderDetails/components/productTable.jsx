import { Clipboard } from 'flowbite-react'

import ProductList from './productList'
import RowShimmer from './rowShimmer'
import { MRP_PRICE_FIXED_VALUE } from '../../../../constant/products/constant'

import { FaClipboardList } from 'react-icons/fa'
import { toast } from 'sonner'

export default function ProductTable({ orderDetails, isLoading, total }) {
	// Function to calculate total quantity of products
	function calculateTotalQuantity(products) {
		let totalQuantity = 0

		products &&
			products?.forEach((product) => {
				totalQuantity += product.quantity
			})
		return totalQuantity
	}

	const copyProductID = () => {
		return orderDetails?.items
			?.map(
				(item) =>
					`${item?.productId?.unique_id || ' '} ${item?.quantity || ' '}`
			)
			.join('\n')
	}

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

	// const copyQuantity = () => {
	// 	return orderDetails?.items?.map((item) => item?.quantity).join('\n')
	// }

	return (
		<div className='overflow-x-auto bg-white dark:bg-neutral-700 h-full overflow-y-scroll'>
			{/* Table */}
			<table className='min-w-full text-left text-sm whitespace-nowrap'>
				{/* Table head */}
				<thead className='uppercase tracking-wider sticky top-0 bg-white dark:bg-neutral-700 outline outline-2 outline-neutral-200 dark:outline-neutral-600'>
					<tr>
						<th scope='col' className='px-2 py-4'>
							Sr. No.
						</th>
						<th scope='col' className='px-6 py-4'>
							Product
						</th>
						<th scope='col' className='text-wrap px-6 py-4 '>
							<div className='flex items-center gap-1 '>
								PRODUCT ID
								<Clipboard
									disabled={
										!orderDetails?.items || !orderDetails?.items?.length
									}
									className='w-fit h-fit py-2 px-2 bg-cyan-700 disabled:opacity-50 hover:bg-cyan-800 disabled:cursor-not-allowed'
									valueToCopy={copyProductID()}
									onClick={() => copyToClipboard(copyProductID())}
									label={<FaClipboardList />}
								/>
							</div>
						</th>
						<th scope='col' className='px-6 py-4'>
							Sizes
						</th>
						<th scope='col' className='text-wrap px-6 py-4'>
							<div className='flex items-center gap-1 '>
								Price & Quantity
								{/* <Clipboard
									disabled={
										!orderDetails?.items || !orderDetails?.items?.length
									}
									className='w-fit h-fit py-2 px-2 bg-cyan-700 disabled:opacity-50 hover:bg-cyan-800 disabled:cursor-not-allowed'
									valueToCopy={copyQuantity()}
									label={<FaClipboardList />}
								/> */}
							</div>
						</th>

						<th scope='col' className='text-wrap px-6 py-4'>
							Final Price
						</th>
					</tr>
				</thead>

				{/* Table body */}
				<tbody>
					{!isLoading ? (
						orderDetails?.items?.length ? (
							orderDetails?.items.map((product, index) => (
								<ProductList
									index={index}
									product={product}
									key={product?._id}
								/>
							))
						) : (
							<tr>
								<td colSpan='5'>
									<div className='py-6 w-full grid place-items-center text-lg'>
										No Product Available
									</div>
								</td>
							</tr>
						)
					) : (
						// Loading Skeleton
						<RowShimmer />
					)}
				</tbody>
			</table>

			<hr />

			<div className='mt-2 px-4 flex justify-between items-center'>
				<p className='font-semibold text-nowrap flex items-center gap-1'>
					Total Quantity :
					<span className='font-semibold text-xl'>
						{orderDetails?.items?.length &&
							calculateTotalQuantity(orderDetails?.items)}
					</span>
				</p>

				<p className='font-semibold text-nowrap flex items-center gap-1'>
					Total Price :
					<span className=' font-semibold text-xl'>
						{total ? `₹${total?.toFixed(MRP_PRICE_FIXED_VALUE)}` : ' N/A'}
					</span>
				</p>
			</div>
		</div>
	)
}
