import { toast } from 'sonner'
import { Table, TextInput } from 'flowbite-react'

import { ONLY_FLOATING_POINT_HANDLER } from '../../../../utilis/regex'
import {
	MRP_PRICE_FIXED_VALUE,
	PRODUCT_NAME_MAX_LENGTH,
} from '../../../../constant/products/constant'

export default function TableRow({
	index,
	product,
	selectedProductsData,
	setSelectedProductsData,
}) {
	const handlePriceChange = (e) => {
		let { value } = e.target

		ONLY_FLOATING_POINT_HANDLER(e)

		if (+value > 999999) {
			toast.warning('Price should not be more than 999999', {
				id: 'price',
			})
			e.target.value = e.target.value.slice(0, -1)
		}

		const updatedSelectedProductsData = selectedProductsData.map((item) => {
			if (item._id === product._id) {
				return {
					...item,
					mrp_price: +value,
				}
			}

			return item
		})

		console.log('updatedSelectedProductsData', updatedSelectedProductsData)

		setSelectedProductsData(updatedSelectedProductsData)
	}

	return (
		<Table.Row>
			<Table.Cell className='flex items-center whitespace-nowrap w-full font-medium'>
				<div className='text-center w-8 mr-16'>{index + 1}</div>
				<TextInput
					disabled
					className='w-full'
					placeholder='Product name'
					defaultValue={product?.name}
					maxLength={PRODUCT_NAME_MAX_LENGTH}
				/>
			</Table.Cell>

			<Table.Cell className='w-2/5'>
				<TextInput
					placeholder='Enter New Price'
					defaultValue={product?.mrp_price?.toFixed(MRP_PRICE_FIXED_VALUE)}
					onChange={handlePriceChange}
				/>
			</Table.Cell>

			{/* <Table.Cell className='w-1/4'> */}
			{/* <IoAdd
      color='red'
      // size={20}
      onClick={addDataToList}
      className='hover:cursor-pointer hover:bg-gray-100 rounded p-1 text-3xl'
    /> */}
			{/* </Table.Cell> */}
		</Table.Row>
	)
}
