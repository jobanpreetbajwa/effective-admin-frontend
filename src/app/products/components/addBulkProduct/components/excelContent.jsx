import { toast } from 'sonner'
import { useState, useRef, useEffect, memo } from 'react'
import { Table, Avatar, Label, FileInput, TextInput } from 'flowbite-react'

import ToggleSwitch from '../../../../components/toggleSwitch'
import {
	ONLY_FLOATING_POINT_HANDLER,
	ONLY_FLOATING_POINT_REGEX,
} from '../../../../utilis/regex'
import {
	PRODUCT_NAME_MAX_LENGTH,
	PRODUCT_UNIQUE_ID_MAX_LENGTH,
} from '../../../../constant/products/constant'

import { CiCircleRemove } from 'react-icons/ci'

function ExcelContent({ item, itemIndex, setExcelData, setPreview }) {
	const [error, setError] = useState(false)

	const [image, setImage] = useState(item?.image)

	const fileRef = useRef(null)
	const [name, setName] = useState(
		item?.['Product Name'] ? item?.['Product Name'] : ''
	)

	const [price, setPrice] = useState(item?.['Price'] ? item?.['Price'] : '')
	const switchRef = useRef(null)

	const [switch1, setSwitch1] = useState(item?.['Product Status'])
	const switchShowPriceRef = useRef(null)

	const [switchShowPrice, setswitchShowPrice] = useState(item?.['Show Price'])

	const [uniqueId, setUniqueId] = useState(
		item?.['Product Id'] ? item?.['Product Id'] : ''
	)

	//HandleFileChange function updates the image associated with a product and triggers an update to the product list with the new image data
	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0]
		setImage(selectedFile)
		fileRef.current.value = null

		const newData = {
			'Product Name': name,
			'Product Status': switch1,
			Price: price,
			image: selectedFile,
			'Product Id': uniqueId,
			showPrice: switchShowPrice,
			uuid: item?.uuid,
		}

		updateList(newData)
	}

	//HandleRemoveImage function removes the image associated with a product and triggers an update to the product list
	const handleRemoveImage = (e) => {
		e.stopPropagation()
		setImage(null)

		const newData = {
			'Product Name': name,
			'Product Status': switch1,
			Price: price,
			showPrice: switchShowPrice,
			'Product Id': uniqueId,
			image: null,
			uuid: item?.uuid,
		}
		updateList(newData)
	}

	//handlePriceChange function updates the price state based on user input, enforcing floating-point number input and restricting the value to a maximum of 999999, while notifying users of any input exceeding this limit
	const priceHandler = (e) => {
		ONLY_FLOATING_POINT_HANDLER(e)
		if (+e.target.value > 999999) {
			toast.warning('Price should not be more than 999999', {
				id: 'price',
			})
			e.target.value = e.target.value.slice(0, -1)
			return
		}
		setPrice(e.target.value)

		const newData = {
			'Product Name': name,
			'Product Status': switch1,
			'Product Id': uniqueId,
			Price: e.target.value,
			image: image,
			showPrice: switchShowPrice,
			uuid: item?.uuid,
		}
		updateList(newData)
	}

	//HandleFileChange function updates the product name and triggers an update to the product list with the new name.
	const nameHandler = (e) => {
		setName(e.target.value)

		const newData = {
			'Product Name': e.target.value,
			'Product Status': switch1,
			Price: price,
			showPrice: switchShowPrice,
			'Product Id': uniqueId,
			image: image,
			uuid: item?.uuid,
		}

		updateList(newData)
	}

	const uniqueIdHandler = (e) => {
		setUniqueId(e.target.value)

		const newData = {
			'Product Name': name,
			'Product Status': switch1,
			Price: price,
			showPrice: switchShowPrice,
			'Product Id': e.target.value,
			image: image,
			uuid: item?.uuid,
		}

		updateList(newData)
	}

	//Updating the Excel data list.
	const updateList = (newData) => {
		setExcelData((prevData) => {
			const updatedData = prevData.map((item, index) => {
				if (index === itemIndex) {
					return newData
				}
				return item
			})
			return updatedData
		})
	}

	//toggleHandler will toggle product status.
	const toggleHandler = (value) => {
		setSwitch1(!switch1)
		const newData = {
			'Product Name': name,
			'Product Status': value,
			Price: price,
			showPrice: switchShowPrice,
			'Product Id': uniqueId,
			image: image,
			uuid: item?.uuid,
		}

		updateList(newData)
	}

	//toggleShowPriceHandler will toggle show price to customer.
	const toggleShowPriceHandler = (value) => {
		setswitchShowPrice(!switchShowPrice)
		const newData = {
			'Product Name': name,
			'Product Status': switch1,
			Price: price,
			showPrice: value,
			'Product Id': uniqueId,
			image: image,
			uuid: item?.uuid,
		}

		updateList(newData)
	}

	const checkValidations = (item) => {
		const productStatus = item?.['Product Status']

		const isValidProductStatus =
			productStatus === 0 || productStatus === 1
				? true
				: productStatus === true || productStatus === false
				? true
				: false

		const isValidPrice = ONLY_FLOATING_POINT_REGEX.test(item.Price)

		const isValidName = item['Product Name'] ? true : false

		const isValidImage = item['image'] ? true : false

		// const isValidUniqueId = item?.['Product Id']?.length ? true : false

		if (
			!isValidPrice ||
			!isValidName ||
			!isValidImage ||
			!isValidProductStatus
		) {
			return true
		}

		return false
	}

	useEffect(() => {
		setError(checkValidations(item))
	}, [item])

	return (
		<Table.Row
			className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${
				error ? 'bg-rose-100 ' : ' '
			}`}
		>
			<Table.Cell className='w-1/4'>
				<div className='w-full flex gap-2'>
					<p className='w-12 text-nowrap flex justify-center items-center'>
						{itemIndex + 1}
					</p>

					<TextInput
						value={name}
						name='productName'
						onChange={nameHandler}
						className='min-w-32 w-full'
						maxLength={PRODUCT_NAME_MAX_LENGTH}
					/>
				</div>
			</Table.Cell>

			<Table.Cell className='w-1/5'>
				<TextInput
					name='unique_id'
					value={uniqueId}
					onChange={uniqueIdHandler}
					className='min-w-32'
					maxLength={PRODUCT_UNIQUE_ID_MAX_LENGTH}
				/>
			</Table.Cell>

			<Table.Cell className='w-1/6'>
				<ToggleSwitch
					ref={switchRef}
					checked={switch1}
					label={switch1 ? 'Visible' : 'Hidden'}
					onChange={() => {
						switchRef.current = !switchRef.current
						toggleHandler(switchRef.current)
					}}
				/>
			</Table.Cell>
			<Table.Cell className='w-1/6'>
				<ToggleSwitch
					ref={switchShowPriceRef}
					checked={switchShowPrice}
					label={switchShowPrice ? 'Visible' : 'Hidden'}
					onChange={() => {
						switchShowPriceRef.current = !switchShowPriceRef.current
						toggleShowPriceHandler(switchShowPriceRef.current)
					}}
				/>
			</Table.Cell>

			<Table.Cell className='w-1/6'>
				<TextInput name='price' value={price} onChange={priceHandler} />
			</Table.Cell>

			<Table.Cell className=' w-1/4'>
				<div>
					<FileInput
						ref={fileRef}
						id={`file-upload-${itemIndex}`}
						accept='.jpg, .jpeg, .png'
						onChange={handleFileChange}
						className='hidden'
					/>

					{image ? (
						<div className='flex justify-start relative w-12 h-12 '>
							<Avatar
								className='object-fit'
								img={URL.createObjectURL(image)}
								rounded
								stacked
							/>
							<CiCircleRemove
								className='absolute left-6 -top-1 bg-white rounded-full hover:cursor-pointer'
								onClick={handleRemoveImage}
								size={25}
								color='red'
							/>
						</div>
					) : null}

					{!image && (
						<Label
							htmlFor={`file-upload-${itemIndex}`}
							className='flex hover:bg-gray-200 hover:cursor-pointer rounded-full border bg-gray-50 w-12 h-12 justify-center items-center'
						>
							+
						</Label>
					)}
				</div>
			</Table.Cell>
		</Table.Row>
	)
}

export default memo(ExcelContent)
