const { VITE_BASE_URL } = import.meta.env
import { toast } from 'sonner'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, FileInput, Table } from 'flowbite-react'

import Excel from './components/excel'
import AddBulkInputs from './addBulkInputs'
import BulkProductTableBody from './bulkProductTabelBody'
import BackConfirmation from '../../modal/backConfirmation'
import { importExcelFile } from '../../../utilis/excelUtils'
import { addBulkProductsToList } from '../../../../store/slices/currentProductList'
import { updateCategoryItemsCount } from '../../../../store/slices/categoryList'
import { INCREMENT_ACTION_TYPE } from '../../../staticData/constantActions'
import {
	deleteImages,
	addBulkProduct,
	uploadMultipleImages,
} from '../../../../api/function'

import { IoIosArrowRoundBack } from 'react-icons/io'

export default function AddBulkProduct() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { categoryID } = useParams()
	const categoryListSelector = useSelector((state) => state.categoryList)
	const category = categoryListSelector.find((item) => item?._id === categoryID)
	const [showModal, setShowModal] = useState(false)
	const [isProductsAdding, setIsProductsAdding] = useState(false)
	const [bulkProducts, setBulkProducts] = useState([])

	const [preview, setPreview] = useState(false)
	const [excelData, setExcelData] = useState(null)

	//deleteRowHandler function delete row from bulkCollection list.
	const deleteRowHandler = (index) => {
		const updatedBulkProducts = [...bulkProducts]
		updatedBulkProducts.splice(index, 1)
		setBulkProducts(updatedBulkProducts)
	}

	//addProductsHandler function makes api call to save data in db.
	const addProductsHandler = async () => {
		try {
			let data = [...bulkProducts]
			const promises = []
			const failedUploads = []
			setIsProductsAdding(true)
			let images = null

			data.map(async (element) => {
				const imgArray = element?.images
				const formdata = new FormData()
				formdata.append('file', imgArray[0])

				console.log('formdata', formdata.get('file'))

				const promise = uploadMultipleImages({ data: formdata })
					.then((response) => {
						const images = [response?.data?._id]
						const { images: _, ...rest } = element
						return { ...rest, img_ids: images }
					})
					.catch((error) => {
						failedUploads.push(element)
						return { error: error?.message }
					})

				promises.push(promise)
			})

			const newData = Promise.all(promises).then((data) => {
				const elements = data.filter((element) => !element?.error)

				if (!elements?.length) {
					return new Error()
				}

				return elements
			})

			toast.promise(newData, {
				loading: 'Uploading...',
				success: `Images uploaded successfully`,
				error: 'Server Not Responding',
				id: 'uploadingImages',
			})

			const uploadData = await newData
			if (failedUploads?.length) {
				toast.error(
					`${failedUploads?.length} ${
						failedUploads?.length === 1 ? 'product' : 'products'
					} failed. Please try again!`,
					{
						duration: 5000,
					}
				)
			}
			const promise = addBulkProduct({
				data: uploadData,
				categoryID: categoryID,
			})
				.then((response) => {
					if (failedUploads?.length) {
						setBulkProducts(failedUploads)
					} else {
						setBulkProducts([])
					}

					dispatch(
						addBulkProductsToList({ categoryID, product: response.data })
					)
					dispatch(
						updateCategoryItemsCount({
							_id: categoryID,
							type: INCREMENT_ACTION_TYPE,
							count: response?.data?.length,
						})
					)
				})
				.catch(async (error) => {
					try {
						const response = await deleteImages((img_ids = images))
					} catch (error) {
						console.log('Error while deleting images', error)
					}

					console.error('Error while adding products in bulk', error)
					throw new Error('Something went wrong')
				})

			toast.promise(promise, {
				loading: 'Loading...',
				success: `${uploadData?.length} products added successfully`,
				error: (err) => err || 'Error',
				finally: () => {
					setIsProductsAdding(false)
				},
			})
		} catch (error) {
			setIsProductsAdding(false)
			console.log('Error while adding products in bulk', error)
		}
	}
	//AddDataToList function adds a new entry to the bulk product list.
	const addDataToList = ({
		productName,
		images,
		price,
		switch1,
		switchShowPrice,
		selectedTags,
		uniqueId,
	}) => {
		setBulkProducts((prev) => {
			return [
				...prev,
				{
					name: productName,
					images: images,
					mrp_price: +price,
					prices: [],
					prod_status: switch1,
					is_pricing: switchShowPrice,
					subcategories: selectedTags,
					unique_id: uniqueId,
					uuid: uuidv4(),
				},
			]
		})
	}

	//navigateHandler,if there is no changes in the list,moves back without asking for user confirmation.
	const navigateHandler = () => {
		if (bulkProducts && bulkProducts?.length) {
			setShowModal(true)
		} else {
			navigate(-1)
		}
	}

	//handleModalConfirm, before moving back ask for confirmation.
	const handleModalConfirm = (confirmed) => {
		if (confirmed) {
			navigate(-1)
		} else {
			setShowModal(false)
		}
	}

	//handleUploadExcel function processes an uploaded Excel file, extracts and validates data, then converts it into a structured format compatible with the application's requirements, displaying a preview if successful

	const handleUploadExcel = async (event) => {
		const file = event.target.files[0]

		const data = importExcelFile(file)

		data.then((data) => {
			setExcelData(data)
			setPreview(true)
		})

		toast.promise(data, {
			loading: 'Loading...',
			success: 'Excel file importing successfully',
			error: 'Error while importing excel file',
		})
	}

	return (
		<>
			{showModal && (
				<BackConfirmation
					openModal={showModal}
					onConfirm={handleModalConfirm}
				/>
			)}

			{preview ? (
				<Excel
					excelData={excelData}
					setPreview={setPreview}
					setExcelData={setExcelData}
					setBulkProducts={setBulkProducts}
				/>
			) : (
				<div className='flex flex-col gap-8 p-6'>
					<div
						className={`flex flex-col gap-3 ${
							isProductsAdding ? 'opacity-50' : 'opacity-100'
						}`}
					>
						<button
							className={`flex items-center w-fit `}
							onClick={isProductsAdding ? null : navigateHandler}
						>
							<IoIosArrowRoundBack size={32} />
							<p>Back </p>
						</button>
						<div className='flex justify-between items-center'>
							<h1 className='font-semibold text-xl'>
								Add Products
								{category?.category_name
									? ' in ' + category?.category_name
									: null}
							</h1>
							<div className='flex gap-3'>
								<a
									href={`${VITE_BASE_URL}/product/excel/sample`}
									download='sample.xlsx'
								>
									<Button className='w-32'>Sample Excel</Button>
								</a>

								{excelData?.length ? (
									<Button className='w-32' onClick={() => setPreview(true)}>
										Preview
									</Button>
								) : (
									<>
										<Button
											onClick={() => {
												document.getElementById('excel-file-upload').click()
											}}
											className='w-32'
										>
											<span className=''>
												{excelData?.length ? 'preview' : 'Upload Excel'}
											</span>
										</Button>

										<FileInput
											id='excel-file-upload'
											accept='.xlsx, .xlsm, .xlsb, .xltx,.xls'
											onChange={handleUploadExcel}
											className='hidden'
										/>
									</>
								)}

								<Button
									disabled={
										isProductsAdding
											? true
											: bulkProducts?.length
											? false
											: true
									}
									onClick={addProductsHandler}
									className='w-32'
								>
									Add Products
								</Button>
							</div>
						</div>
					</div>

					<div className='w-full h-[80vh] overflow-auto p-1'>
						<Table>
							<Table.Head>
								<Table.HeadCell>
									<div className='flex gap-4'>
										<p className='text-nowrap w-10'>SR No.</p>
										<div className='text-nowrap flex'>
											<p>Product name</p>
											<span className='text-rose-600'>*</span>
										</div>
									</div>
								</Table.HeadCell>

								<Table.HeadCell>Product ID</Table.HeadCell>

								<Table.HeadCell>
									Product Status
									<span className='text-rose-600'>*</span>
								</Table.HeadCell>
								<Table.HeadCell>
									Show Price To Customer
									<span className='text-rose-600'>*</span>
								</Table.HeadCell>
								<Table.HeadCell>
									Price
									<span className='text-rose-600'>*</span>
								</Table.HeadCell>

								<Table.HeadCell>
									Media
									<span className='text-rose-600'>*</span>
								</Table.HeadCell>

								<Table.HeadCell>Tags</Table.HeadCell>

								<Table.HeadCell>
									<span className='sr-only'>Edit</span>
								</Table.HeadCell>
							</Table.Head>

							<Table.Body className='divide-y'>
								{bulkProducts?.map((item, index) => {
									return (
										<BulkProductTableBody
											item={item}
											index={index}
											key={item?.uuid}
											categoryID={categoryID}
											setBulkProducts={setBulkProducts}
											isProductsAdding={isProductsAdding}
											onDelete={() => deleteRowHandler(index)}
										/>
									)
								})}

								<AddBulkInputs
									categoryID={categoryID}
									bulkProducts={bulkProducts}
									addDataToList={addDataToList}
								/>
							</Table.Body>
						</Table>
					</div>
				</div>
			)}
		</>
	)
}
