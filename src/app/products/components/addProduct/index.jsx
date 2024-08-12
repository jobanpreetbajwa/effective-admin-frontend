import { IoIosArrowRoundBack } from 'react-icons/io'

import { toast } from 'sonner'
import { Button } from 'flowbite-react'
import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
	addProductToList,
	updateProductList,
} from '../../../../store/slices/currentProductList'

import { updateCategoryItemsCount } from '../../../../store/slices/categoryList'

import NameAndStatusComponent from './components/nameAndStatus'
import UniqueId from './components/uniqueId'
import DescriptionComponent from './components/description'
import MediaComponent from './components/media'
import PricingComponent from './components/pricing'
import VariablePriceModal from '../../modal/variablePriceModal'
import InventoryComponent from './components/inventory'
import WeightComponent from './components/weight'
import TagsComponent from './components/tags'
import MoreFields from './components/moreFields'

// import VariantComponent from './components/variants'
import { generateAddProductPayload } from './utils/generatePayload'
import { sendMultipleImages } from '../../../utilis/sendMultipleImages'
import {
	INCREMENT_ACTION_TYPE,
	VARIABLE_MAX_RANGE_ANY,
	ADD_PRODUCT_ACTION_TYPE,
	EDIT_PRODUCT_ACTION_TYPE,
	DETAILS_PRODUCT_ACTION_TYPE,
} from '../../../staticData/constantActions'

import {
	getProductData,
	getCategoryTags,
	addSingleProduct,
} from '../../../../api/function'

import BackConfirmation from '../../modal/backConfirmation'

export default function AddProduct({ action }) {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const priceInputRef = useRef(null)
	const { categoryID, productID } = useParams()

	// const [showModal, setShowModal] = useState(false)

	const [maxRange, setMaxRange] = useState([])
	const [productData, setProductData] = useState({})
	const [disabledTags, setDisabledTags] = useState(true)
	const [variablePricing, setVariablePricing] = useState([])
	const [variablePriceModal, setVariablePriceModal] = useState(false)
	const categoryListSelector = useSelector((state) => state.categoryList)
	const category = categoryListSelector.find((item) => item?._id === categoryID)

	const [openVariantModal, setOpenVariantModal] = useState(false)

	// ADD PRODUCT IMAGES ARRAY
	// const [images, setImages] = useState([])
	const [detailPageImages, setDetailPageImages] = useState([])

	// EDIT PRODUCT IMAGES ARRAY
	const [sendImages, setSendImages] = useState([])
	const [showEditImage, setShowEditImage] = useState([])
	const [showDiscountedPrice, setShowDiscountedPrice] = useState(
		productID ? true : false
	)
	const [inventoryAvailable, setInventoryAvailable] = useState(true)
	const [isPricing, setIsPricing] = useState(true)
	const [variantData, setVariantData] = useState(productData?.variants || [])
	const [deletedVariants, setDeletedVariants] = useState([])
	const [tags, setTags] = useState([])
	const [showTags, setShowTags] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedTags, setSelectedTags] = useState([])
	const [deletedImages, setDeletedImages] = useState([])

	const handleSubmit = async (event) => {
		event.preventDefault()
		setIsLoading(true)

		// Media
		if (
			!sendImages.length &&
			action === EDIT_PRODUCT_ACTION_TYPE &&
			showEditImage.length === 0
		) {
			toast.error('Please upload an image')
			setIsLoading(false)

			return
		}

		if (
			+event.target.min_order_quantity.value >
			+event.target.max_order_quantity.value
		) {
			toast.error('Min Order Quantity should be less than Max Order Quantity')
			setIsLoading(false)
			return
		}

		const tagsName = selectedTags.map((item) => item?._id)

		const data = await generateAddProductPayload(
			event,
			action,
			maxRange,
			tagsName,
			isPricing,
			sendImages,
			categoryID,
			deletedImages,
			variablePricing
		)

		const addVariantDataInPayload = (variant, rawData) => {
			return { ...rawData, ...variant }
		}

		for (const variant of variantData) {
			if (variant?.image) {
				const variantImageId = await sendMultipleImages([variant?.image])
				variant.img_ids = variantImageId
			} else {
				if (variant.img_ids?.[0]?._id) {
					variant.img_ids = [variant.img_ids?.[0]?._id]
				} else {
					variant.img_ids = [data?.[0]?.img_ids?.[0]]
				}
			}

			const variantWOFileImage = { ...variant }
			delete variantWOFileImage.image

			const newVariantData = await addVariantDataInPayload(
				variantWOFileImage,
				data[0]
			)

			newVariantData.parent_id = productData._id
			newVariantData.name = `${productData.name} - ${variant.size}`
			newVariantData.srn = productData?.srn
			data.push(newVariantData)
		}

		data[0] = { ...productData, ...data[0] }

		let updateProductPayload = {}

		if (action === EDIT_PRODUCT_ACTION_TYPE) {
			updateProductPayload = {
				products: data,
				delete_images: [...data?.[0].deleted],
				delete_variants: deletedVariants,
				subcategories: selectedTags.map((item) => item?.name) || [],
				category_id: categoryID,
			}
		}

		const bodyData =
			action === ADD_PRODUCT_ACTION_TYPE ? data : updateProductPayload

		const url = action === ADD_PRODUCT_ACTION_TYPE ? '/product/add' : `/product`

		const method = action === ADD_PRODUCT_ACTION_TYPE ? 'POST' : `PATCH`

		const sendData = addSingleProduct({
			path: url,
			data: bodyData,
			method: method,
		})
			.then(async (response) => {
				const data = await response.data
				if (action === EDIT_PRODUCT_ACTION_TYPE) {
					setVariantData(data?.product?.variants)
					// setLimited_availability(data?.product?.inventory_available)
				}
				if (
					data?.message ===
					'E11000 duplicate key error collection: bikayi.products index: name_1 dup key: { name: "Tdyj" }'
				) {
					throw new Error('Product Already Exists')
				}

				if (action !== EDIT_PRODUCT_ACTION_TYPE) {
					dispatch(
						updateCategoryItemsCount({
							_id: categoryID,
							type: INCREMENT_ACTION_TYPE,
						})
					)
				}

				return data
			})
			.catch((error) => {
				console.error(error)
				toast.error('Failed to add product')
				throw new Error('Failed to add product')
			})

		toast.promise(sendData, {
			loading: 'Loading...',
			success: (data) => {
				if (
					data?.message === 'ALREADY_EXIST' ||
					data?.message ===
						'E11000 duplicate key error collection: bikayi.products index: name_1 dup key: { name: "Tdyj" }'
				) {
					throw new Error('Product Already Exists')
				} else {
					if (data?.message?._id) {
						throw new Error('Error While Adding Product')
					}

					if (action === ADD_PRODUCT_ACTION_TYPE) {
						dispatch(addProductToList({ categoryID, product: data }))
					}

					if (action === EDIT_PRODUCT_ACTION_TYPE) {
						const newData = {
							...data?.product,
							subcategories: data?.subCategories,
						}
						setMaxRange(data?.product?.prices[data?.product?.prices.length - 1])

						dispatch(
							updateProductList({
								categoryID: categoryID,
								updatedProduct: newData,
							})
						)
					}

					//reset the fields
					if (action === ADD_PRODUCT_ACTION_TYPE) {
						event.target.reset()
						setTags([])
						// setImages([])
						setMaxRange([])
						setSendImages([])
						setVariantData([])
						setSelectedTags([])
						setVariablePricing([])
					}

					return action === ADD_PRODUCT_ACTION_TYPE
						? `Product Added Successfully`
						: `Product Updated Successfully`
				}
			},
			error: (err) => {
				return err || 'Failed to add product'
			},
			finally: () => {
				setIsLoading(false)
			},
		})
	}

	useEffect(() => {
		const fetchTags = async () => {
			getCategoryTags(categoryID)
				.then((response) => response.data)
				.then((result) => {
					setShowTags(result)
				})
				.catch((error) => console.error(error))
		}
		fetchTags()

		if (productID) {
			const fetchProduct = async () => {
				const response = await getProductData(productID)
				const res = response.data
				const data = res?.product

				setIsPricing(data?.is_pricing)
				setDeletedImages(data?.img_ids)
				setDetailPageImages(data?.img_ids?.map((item) => item?.url))
				setShowEditImage(data?.img_ids?.map((item) => item?.url))
				setSelectedTags(res?.subCategories)
				setInventoryAvailable(data?.inventory_available)
				//if data?.prices last array has "to" key === "Any" then remove it

				if (
					data?.prices[data?.prices?.length - 1]?.to === VARIABLE_MAX_RANGE_ANY
				) {
					setMaxRange(data?.prices?.pop())
					setVariablePricing([...data?.prices])
				} else {
					setVariablePricing(data?.prices)
				}

				setVariantData(data?.variants)
				setProductData(data)
			}

			fetchProduct()
		}
	}, [productID, categoryID])

	// Add Variable Pricing
	const addVariablePricing = (data) => {
		setVariablePricing((prev) => {
			let index = prev.findIndex(
				(item) => parseInt(item.from) > parseInt(data.from)
			)

			if (index === -1) {
				index = prev.length
			}
			return [...prev.slice(0, index), data, ...prev.slice(index)]
		})
	}

	// const isEmpty = () => {
	// 	if (
	// 	  collectionName ||
	// 	  sendImages?.length ||
	// 	  bannerImage?.length ||
	// 	  Object.keys(collectionTags).length
	// 	) {
	// 	  console.log(
	// 		sendImages?.length,
	// 		'image',
	// 		bannerImage?.length,
	// 		'banner',
	// 		Object.keys(collectionTags).length
	// 	  )
	// 	  return false
	// 	} else {
	// 	  return true
	// 	}
	//   }
	//   const navigateHandler = () => {
	// 	if (!isEmpty()) {
	// 	  console.log('not empty')
	// 	  setShowModal(true)
	// 	} else {
	// 	  navigate(-1)
	// 	}
	//   }
	//   const handleModalConfirm = (confirmed) => {
	// 	if (confirmed) {
	// 	  navigate(-1)
	// 	} else {
	// 	  setShowModal(false)
	// 	}
	//   }

	return (
		<>
			{/* {showModal && (
        <BackConfirmation
          openModal={showModal}
          onConfirm={handleModalConfirm}
        />
      )} */}
			{variablePriceModal && (
				<VariablePriceModal
					variablePricing={variablePricing}
					variablePriceModal={variablePriceModal}
					addVariablePricing={addVariablePricing}
					setVariablePriceModal={setVariablePriceModal}
					defaultStartRange={
						variablePricing.length > 0 &&
						variablePricing[variablePricing.length - 1]?.['to']
							? variablePricing[variablePricing.length - 1]?.['to']
							: null
					}
				/>
			)}

			<div>
				<button
					disabled={isLoading}
					onClick={() => {
						if (action === DETAILS_PRODUCT_ACTION_TYPE) {
							navigate(-1)
						} else {
							navigate('/products/' + categoryID)
						}
					}}
					className={`flex items-center pt-6 pl-6 ${
						isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
					}`}
				>
					<IoIosArrowRoundBack size={32} />
					<p>Back</p>
				</button>

				<form
					onSubmit={handleSubmit}
					className='p-6 pt-2 pb-12'
					encType='multipart/form-data'
				>
					{/* Action Specifier (Add-Edit-Details)  */}
					<div className='flex justify-between items-center'>
						<h1 className='text-3xl font-semibold leading-7 text-gray-900'>
							{action === EDIT_PRODUCT_ACTION_TYPE && 'Edit Product'}

							{action === DETAILS_PRODUCT_ACTION_TYPE && 'Product Details'}

							{action === ADD_PRODUCT_ACTION_TYPE &&
								`Add New Product ${
									category?.category_name && 'in ' + category?.category_name
								}`}
						</h1>

						<div className='mt-6 flex items-center justify-end gap-x-6 text-sm font-semibold leading-6 text-gray-900'>
							{action === EDIT_PRODUCT_ACTION_TYPE && (
								<>
									<a
										target='_blank'
										href={`${
											import.meta.env.VITE_WEBSITE_URL
										}/details/${productID}`}
									>
										Preview
									</a>

									<Button type='submit' disabled={isLoading}>
										Update Product
									</Button>
								</>
							)}

							{action === DETAILS_PRODUCT_ACTION_TYPE && (
								<>
									<a
										target='_blank'
										href={`${
											import.meta.env.VITE_WEBSITE_URL
										}/details/${productID}`}
									>
										Preview
									</a>

									<Button
										as={Link}
										to={`/products/${categoryID}/edit-product/${productID}`}
									>
										Edit Product
									</Button>
								</>
							)}

							{action === ADD_PRODUCT_ACTION_TYPE && (
								<Button type='submit' disabled={isLoading}>
									Add Product
								</Button>
							)}
						</div>
					</div>

					{/* Main Content */}
					<div>
						<div className='gap-4 pb-4'>
							<div className=' border-b border-gray-900/10 w-full'>
								<h2 className='text-base font-semibold leading-7 text-gray-900'>
									Basic Details
								</h2>

								<div className='mt-4 grid grid-cols-6 gap-x-6 gap-y-8 sm:grid-cols-6'>
									{/* Product Name & Product Status */}
									<NameAndStatusComponent
										action={action}
										productData={productData}
									/>

									{/* Product Unique ID */}
									<UniqueId action={action} productData={productData} />

									{/* Product Description */}
									<DescriptionComponent
										action={action}
										productData={productData}
									/>

									{/* Media */}
									<MediaComponent
										action={action}
										// images={images}
										// setImages={setImages}
										sendImages={sendImages}
										deletedImages={deletedImages}
										setSendImages={setSendImages}
										showEditImage={showEditImage}
										detailPageImages={detailPageImages}
										setShowEditImage={setShowEditImage}
										setDeletedImages={setDeletedImages}
									/>
									{/* Pricing */}
									<PricingComponent
										action={action}
										maxRange={maxRange}
										isPricing={isPricing}
										productData={productData}
										setMaxRange={setMaxRange}
										variantData={variantData}
										setIsPricing={setIsPricing}
										priceInputRef={priceInputRef}
										variablePricing={variablePricing}
										setVariablePricing={setVariablePricing}
										showDiscountedPrice={showDiscountedPrice}
										setVariablePriceModal={setVariablePriceModal}
										setShowDiscountedPrice={setShowDiscountedPrice}
									/>
									{/* Inventory Management */}
									<InventoryComponent
										action={action}
										productData={productData}
										inventoryAvailable={inventoryAvailable}
										setInventoryAvailable={setInventoryAvailable}
									/>
									{/* Weight */}
									<WeightComponent action={action} productData={productData} />
									{/* Variants */}
									{/* <VariantComponent
										action={action}
										variantData={variantData}
										setVariantData={setVariantData}
										variablePricing={variablePricing}
										openVariantModal={openVariantModal}
										setOpenVariantModal={setOpenVariantModal}
										deletedVariants={deletedVariants}
										setDeletedVariants={setDeletedVariants}
									/> */}
									{/* TAGS */}
									<TagsComponent
										tags={tags}
										action={action}
										setTags={setTags}
										showTags={showTags}
										categoryID={categoryID}
										setShowTags={setShowTags}
										disabledTags={disabledTags}
										selectedTags={selectedTags}
										setDisabledTags={setDisabledTags}
										setSelectedTags={setSelectedTags}
									/>
								</div>
							</div>
						</div>

						<MoreFields action={action} productData={productData} />
					</div>
				</form>
			</div>
		</>
	)
}
