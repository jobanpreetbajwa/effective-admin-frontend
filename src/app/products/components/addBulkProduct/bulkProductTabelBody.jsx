import { useState, memo } from 'react'
import { useSelector } from 'react-redux'
import { Table, Avatar, TextInput } from 'flowbite-react'

import Tags from './components/tags'
import { ONLY_FLOATING_POINT_HANDLER } from '../../../utilis/regex'
import { PRODUCT_NAME_MAX_LENGTH } from '../../../constant/products/constant'

import { MdOutlineDelete } from 'react-icons/md'

const BulkProductTableBody = memo(function BulkProductTableBody({
	item,
	index,
	onDelete,
	categoryID,
	isProductsAdding,
	setBulkProducts,
}) {
	const [productName, setProductName] = useState(item?.name || '')
	// const [images, setImages] = useState(item?.images || [])
	const [price, setPrice] = useState(item?.mrp_price)

	const [uniqueId, setUniqueId] = useState(item?.unique_id || '')

	// const [anyChanges, setAnyChanges] = useState(false)
	const categoryListSelector = useSelector((state) => state.categoryList)

	const currentCategory = categoryListSelector?.find(
		(item) => categoryID === item?._id
	)

	const onChangeHandler = (e) => {
		// setAnyChanges(true)

		console.log('onChangeHandler', e.target.name, e.target.value)
		switch (e.target.name) {
			case 'productName':
				setProductName(e.target.value)
				break

			case 'unique_id':
				console.log('unique_id', e.target.value)
				setUniqueId(e.target.value)

				setBulkProducts((prev) => {
					const updatedBulkProducts = [...prev]
					updatedBulkProducts[index].unique_id = e.target.value

					return updatedBulkProducts
				})
				break

			case 'image':
				// setImage(e.target.files[0])
				setBulkProducts((prev) => {
					const updatedBulkProducts = [...prev]
					updatedBulkProducts[index].images = e.target.files[0]

					return updatedBulkProducts
				})
				break

			case 'price':
				ONLY_FLOATING_POINT_HANDLER(e)

				if (+e.target.value > 999999) {
					toast.warning('Price should not be more than 999999', {
						id: 'price',
					})
					e.target.value = e.target.value.slice(0, -1)
				}

				setPrice(e.target.value)
				break
			default:
				break
		}
	}

	const setSelectedTags = (tags) => {
		// setSelectedTags function sets the selected tags in the state
		setBulkProducts((prev) => {
			const updatedBulkProducts = [...prev]
			updatedBulkProducts[index].subcategories = tags
			return updatedBulkProducts
		})
	}

	return (
		<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
			<Table.Cell className='w-1/4 min-w-1/5 font-medium '>
				<div className='flex gap-4'>
					<p className='flex justify-center items-center text-nowrap w-10'>
						{index + 1}
					</p>

					<TextInput
						required
						name='productName'
						disabled={item?.name}
						onChange={onChangeHandler}
						placeholder='Product name'
						value={productName}
						maxLength={PRODUCT_NAME_MAX_LENGTH}
					/>
				</div>
			</Table.Cell>

			{/* Product ID */}
			<Table.Cell className='w-1/6'>
				<TextInput
					maxLength={20}
					name='unique_id'
					className='min-w-20'
					value={uniqueId || ''}
					placeholder='Unique ID'
					disabled={item?.unique_id}
					onChange={onChangeHandler}
				/>
			</Table.Cell>

			<Table.Cell className='w-fit'>
				<input
					required
					className='w-full p-3'
					name='visibility_status'
					onChange={onChangeHandler}
					disabled={true}
					value={item?.prod_status ? 'Visible' : 'Hidden'}
				/>
			</Table.Cell>

			<Table.Cell className='w-fit'>
				<input
					required
					disabled={true}
					className='w-full p-3'
					name='price_To_Customer'
					value={item?.is_pricing ? 'Visible' : 'Hidden'}
				/>
			</Table.Cell>

			<Table.Cell className='w-1/6'>
				<TextInput
					required
					name='price'
					value={price}
					placeholder='Price'
					onChange={onChangeHandler}
					disabled={item?.mrp_price}
					className='w-full min-w-24'
				/>
			</Table.Cell>

			<Table.Cell className='overflow-auto w-fit'>
				{
					// here this avatar rerenders on every change in
				}
				<Avatar.Group>
					{item?.images.map((img, i) => (
						<Avatar
							className='object-fit'
							img={URL.createObjectURL(img)}
							rounded
							stacked
							key={i}
						/>
					))}
				</Avatar.Group>
			</Table.Cell>

			<Table.Cell className='overflow-auto w-fit'>
				<Tags
					disabled={false}
					selectedTags={item?.subcategories}
					setSelectedTags={setSelectedTags}
					tags={currentCategory?.subcategories}
				/>
			</Table.Cell>

			<Table.Cell className='w-1/8 pl-0'>
				<MdOutlineDelete
					color='red'
					onClick={isProductsAdding ? null : onDelete}
					className='hover:cursor-pointer hover:bg-gray-100 p-2 rounded text-3xl'
					size={40}
				/>
			</Table.Cell>
		</Table.Row>
	)
})

export default BulkProductTableBody
