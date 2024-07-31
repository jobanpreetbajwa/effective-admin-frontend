import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { FileInput, Table, Avatar, Label, TextInput } from 'flowbite-react'

import Tags from './components/tags'
import CropperReact from '../../../cropper/cropperReact'
import ToggleSwitch from '../../../components/toggleSwitch'
import { capitalizeFirstLetter } from '../../../../utils/function'
import { ONLY_FLOATING_POINT_HANDLER } from '../../../utilis/regex'
import { PRODUCT_NAME_MAX_LENGTH } from '../../../constant/products/constant'

export default function AddBulkInputs({
	categoryID,
	addDataToList,
	bulkProducts,
}) {
	const switchRef = useRef(null)
	const mediaInputRef = useRef(null)
	const [price, setPrice] = useState('')
	const [uniqueId, setUniqueId] = useState('')

	const switchShowPriceRef = useRef(null)
	const [images, setImages] = useState([])
	const [tempFile, setTempFile] = useState(null)

	const [switch1, setSwitch1] = useState(true)
	const [productName, setProductName] = useState('')
	const [nameBlurOut, setNameBlurOut] = useState(false)
	const [priceBlurOut, setPriceBlurOut] = useState(false)
	const [switchShowPrice, setswitchShowPrice] = useState(true)

	const [selectedTags, setSelectedTags] = useState([])
	const [allSelectedTags, setAllSelectedTags] = useState(false)

	const categoryListSelector = useSelector((state) => state.categoryList)
	const currentCategory = categoryListSelector?.find(
		(item) => categoryID === item?._id
	)
	// clearFileInput function clears the file input field after the image is set.
	const clearFileInput = () => {
		mediaInputRef.current.value = ''
	}

	//triggers the addDataToList function when essential fields are filled correctly.
	useEffect(() => {
		if (
			productName &&
			nameBlurOut &&
			images.length &&
			switchRef &&
			switchShowPriceRef &&
			price &&
			priceBlurOut
		) {
			if (!productName || !images?.length || !price) {
				return toast.warning('All fields required')
			} else {
				addDataToList({
					productName,
					images,
					price,
					switch1,
					switchShowPrice,
					selectedTags,
					uniqueId,
				})
				setImages([])
				setPrice('')
				setProductName('')
				setswitchShowPrice(true)
				setSwitch1(true)
				setNameBlurOut(false)
				setPriceBlurOut(false)
				setUniqueId('')
			}
		}
	}, [
		productName,
		images,
		switch1,
		price,
		nameBlurOut,
		priceBlurOut,
		selectedTags,
		uniqueId,
	])

	//handlePriceChange function updates the price state based on user input, enforcing floating-point number input and restricting the value to a maximum of 999999, while notifying users of any input exceeding this limit
	const handlePriceChange = (e) => {
		ONLY_FLOATING_POINT_HANDLER(e)

		if (+e.target.value > 999999) {
			toast.warning('Price should not be more than 999999', {
				id: 'price',
			})
			e.target.value = e.target.value.slice(0, -1)
		}

		setPrice(e.target.value)
	}

	//mediaHandler without cropper function used to set image.
	// const mediaHandler = async (e) => {
	//   if (e) {
	//     setImages([e.target.files[0]])
	//   }

	//   clearFileInput()
	// }

	//mediaHandler with cropper function used to set image.
	const handleFileChange = (event) => {
		const file = event
		if (file) {
			setImages([file])
		}
		mediaInputRef.current.value = ''
		setTempFile(null)
	}

	return (
		<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
			<Table.Cell className='w-1/4 min-w-1/5 font-medium '>
				<div className='flex gap-4'>
					<p className='flex justify-center items-center text-nowrap min-w-10'>
						{bulkProducts?.length + 1}
					</p>

					<TextInput
						className='min-w-32'
						placeholder='Product name'
						value={productName}
						onChange={(e) => setProductName(e.target.value)}
						maxLength={PRODUCT_NAME_MAX_LENGTH}
						onBlur={() => {
							setProductName(capitalizeFirstLetter(productName))

							if (productName) {
								setNameBlurOut(true)
							} else {
								setNameBlurOut(false)
							}
						}}
					/>
				</div>
			</Table.Cell>

			{/* Product ID */}
			<Table.Cell className='w-1/6'>
				<TextInput
					maxLength={20}
					name='unique_id'
					value={uniqueId}
					className='min-w-20'
					placeholder='Unique ID'
					onChange={(event) => setUniqueId(event.target.value)}
				/>
			</Table.Cell>

			<Table.Cell className='w-1/6'>
				<ToggleSwitch
					ref={switchRef}
					checked={switch1}
					label={switch1 ? 'Visible' : 'Hidden'}
					onChange={() => {
						switchRef.current = !switchRef.current
						setSwitch1(!switch1)
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
						setswitchShowPrice(!switchShowPrice)
					}}
				/>
			</Table.Cell>

			<Table.Cell className='w-1/6'>
				<TextInput
					className='min-w-20'
					placeholder='Price'
					value={price}
					onChange={handlePriceChange}
					onBlur={() => {
						if (price) {
							setPriceBlurOut(true)
						} else {
							setPriceBlurOut(false)
						}
					}}
				/>
			</Table.Cell>

			<Table.Cell className='w-fit'>
				<FileInput
					ref={mediaInputRef}
					id='media'
					name='file1'
					className='hidden'
					onChange={(event) => setTempFile(event.target.files[0])}
					accept='.jpg, .jpeg, .png,'
				/>
				{mediaInputRef && tempFile && (
					<CropperReact
						file={URL.createObjectURL(tempFile)}
						handler={handleFileChange}
						banner={false}
						fileName={tempFile?.name}
					/>
				)}

				<Label htmlFor='media' className='cursor-pointer'>
					<Avatar.Group>
						{images?.map((img, i) => {
							return (
								<Avatar
									className='object-fit'
									img={URL.createObjectURL(img)}
									rounded
									stacked
									key={i}
								/>
							)
						})}
						{images?.length ? null : (
							<Label
								htmlFor='media'
								className='rounded-full border w-12 h-12 z-40  bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'
							>
								+
							</Label>
						)}
					</Avatar.Group>
				</Label>
			</Table.Cell>

			<Table.Cell className='w-fit'>
				<Tags
					selectedTags={selectedTags}
					setSelectedTags={setSelectedTags}
					allSelectedTags={allSelectedTags}
					setAllSelectedTags={setAllSelectedTags}
					tags={currentCategory?.subcategories}
				/>
			</Table.Cell>

			<Table.Cell className='w-1/8 pl-0'></Table.Cell>
		</Table.Row>
	)
}
