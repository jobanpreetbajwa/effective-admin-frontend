import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
	Button,
	FileInput,
	Table,
	Avatar,
	Label,
	TextInput,
} from 'flowbite-react'

import { IoIosArrowRoundBack } from 'react-icons/io'

import CropperReact from '../../../cropper/cropperReact'
import BulkCollectionTabelBody from './bulkCollectionTabel'
import BackConfirmation from '../../modal/backConfirmation'
import { capitalizeFirstLetter } from '../../../../utils/function'
import { sendMultipleImages } from '../../../utilis/sendMultipleImages'
import { addBulkCollection, deleteImages } from '../../../../api/function'
import { addBulkCategoriesToList } from '../../../../store/slices/categoryList'

export default function AddBulkCollection() {
	const { categoryID } = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [showModal, setShowModal] = useState(false)
	const [isCollectionAdding, setIsCollectionAdding] = useState(false)
	const [bulkCollection, setBulkCollection] = useState([])

	const [collectionName, setCollectionName] = useState('')
	const [collectionBlurOut, setCollectionBlurOut] = useState(false)
	const [collection_img, setCollection_Img] = useState([])
	const [banner_img, setBanner_Img] = useState([])
	const [tempFile, setTempFile] = useState(null)
	const [tempFileBanner, setTempFileBanner] = useState(null)
	const bannerInputRef = useRef(null)
	const collectionInputRef = useRef(null)

	//deleteRowHandler function delete row from bulkCollection list.
	const deleteRowHandler = (index) => {
		const updatedBulkCollection = [...bulkCollection]
		updatedBulkCollection.splice(index, 1)
		setBulkCollection(updatedBulkCollection)
	}

	//triggers the addDataToList function when essential fields are filled correctly.
	useEffect(() => {
		if (
			collectionName &&
			collectionBlurOut &&
			collection_img.length &&
			banner_img.length
		) {
			addDataToList()
		}
	}, [collectionName, collection_img, banner_img, collectionBlurOut])

	//addProductsHandler function makes api call to save data in db.
	const addProductsHandler = async () => {
		try {
			let data = [...bulkCollection]
			if (collectionName && collection_img?.length && banner_img?.length) {
				const name = collectionName
				if (bulkCollection.some((item) => item.collectionName === name)) {
					return toast.warning('Collection name must be unique', {
						duration: 2000,
					})
				}
				data = [
					...data,
					{
						collectionName: collectionName,
						collection_img: collection_img,
						banner_img: banner_img,
					},
				]
			}

			setIsCollectionAdding(true)
			let img_ids = []
			let banner_ids = []
			const newData = await Promise.all(
				data.map(async (element) => {
					const elementImgIds = await sendMultipleImages(
						element?.collection_img
					)

					if (!elementImgIds?.length) {
						toast.error(`cannot upload image of ${element?.collectionName}`)
						return null
					}
					const elementBannerIds = await sendMultipleImages(element?.banner_img)
					if (!elementBannerIds?.length) {
						toast.error(`cannot upload image of ${element?.collectionName}`)
						return null
					}
					img_ids = img_ids.concat(elementImgIds)
					banner_ids = banner_ids.concat(elementBannerIds)
					const newData = {
						name: element?.collectionName,
						img_ids: elementImgIds,
						banner_ids: elementBannerIds,
						collection_img: element?.collection_img,
						banner_img: element?.banner_img,
					}
					return newData
				})
			)
			const filteredData = newData.filter((element) => element !== null)

			if (!filteredData?.length) {
				setIsCollectionAdding(false)
				setBulkCollection([])
				return
			}

			const promise = addBulkCollection(filteredData)
				.then(async (response) => {
					setIsCollectionAdding(false)
					setBulkCollection([])
					dispatch(addBulkCategoriesToList(response?.data?.categories))

					if (response?.data?.alreadyExist.length) {
						response.data.alreadyExist.forEach((item, i) => {
							const delay = i === 0 ? 0 : 1500 * i
							setTimeout(() => {
								toast.error(`${item} already exists!`)
							}, delay)
						})
						const deleteImg_Ids = []

						const filteredBulkCollection = newData
							.map((item) => {
								if (response.data.alreadyExist.includes(item?.name)) {
									deleteImg_Ids.push(...item?.banner_ids)
									deleteImg_Ids.push(...item?.img_ids)
									const newItem = { ...item }
									newItem.collectionName = newItem.name
									delete newItem.name
									return newItem
								}
							})
							.filter(Boolean)

						try {
							const response = await deleteImages(
								(img_ids = [...deleteImg_Ids])
							)
						} catch (error) {
							console.log('Error while deleting images', error)
						}
					} else {
						setBulkCollection([])
					}
				})
				.catch(async (error) => {
					try {
						const response = await deleteImages(
							(img_ids = [...img_ids, ...banner_ids])
						)
					} catch (error) {
						console.log('Error while deleting images', error)
					}

					console.error('Error while creating collection in bulk', error)
					throw new Error('Something went wrong')
				})

			toast.promise(promise, {
				loading: 'Loading...',
				success: () => {
					return `collections created successfully`
				},
				error: (err) => err || 'Error',
				finally: () => {
					setIsCollectionAdding(false)
				},
			})
		} catch (error) {
			console.log('Error while creating collection in bulk', error)
			setIsCollectionAdding(false)
			toast.error(error || 'Error')
		}
	}

	//AddDataToList function verifies that essential fields are filled and then adds a new entry to the bulk collection list.
	const addDataToList = () => {
		if (
			!collectionName.trim() ||
			!collection_img?.length ||
			!banner_img?.length
		) {
			return toast.warning('All fields required')
		}
		if (bulkCollection.some((item) => item.collectionName === collectionName)) {
			return toast.warning('Collection name must be unique', {
				duration: 2000,
			})
		}
		setBulkCollection((prev) => {
			return [
				...prev,
				{
					collectionName: collectionName,
					collection_img: collection_img,
					banner_img: banner_img,
				},
			]
		})
		setCollection_Img([])
		setCollectionBlurOut(false)
		setCollectionName('')
		setBanner_Img([])
	}

	//collectionHandler function updates the collection image state with the provided file, clears the file input field, and resets the temporary file state.
	const collectionHandler = async (file) => {
		if (file) {
			setCollection_Img([file])
		}
		collectionInputRef.current.value = ''
		setTempFile(null)
	}

	//bannerHandler function updates the collection image state with the provided file, clears the file input field, and resets the temporary file state.
	const bannerHandler = async (file) => {
		if (file) {
			setBanner_Img([file])
		}
		bannerInputRef.current.value = ''
		setTempFileBanner(null)
	}

	//navigateHandler,if there is no changes in the list,moves back without asking for user confirmation.
	const navigateHandler = () => {
		if (bulkCollection && bulkCollection?.length) {
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

	return (
		<>
			<BackConfirmation openModal={showModal} onConfirm={handleModalConfirm} />

			<div className='flex flex-col gap-8 p-8'>
				<div
					className={`flex flex-col gap-3 ${
						isCollectionAdding ? 'opacity-50' : 'opacity-100'
					}`}
				>
					<button
						className={`flex items-center `}
						onClick={isCollectionAdding ? null : navigateHandler}
					>
						<IoIosArrowRoundBack size={32} />
						<p>Back </p>
					</button>

					<div className='flex justify-between items-center'>
						<h1 className='text-2xl font-semibold'>Add collections in bulk</h1>
						<Button
							disabled={
								isCollectionAdding
									? true
									: bulkCollection?.length
									? false
									: true
							}
							onClick={addProductsHandler}
						>
							Add Collections
						</Button>
					</div>
				</div>

				<div className='w-full max-h-[80vh] overflow-auto'>
					<Table>
						<Table.Head>
							<Table.HeadCell>
								<div className='flex gap-4'>
									<span>Sr. No.</span>
									<div>
										Collection Name
										<span className='text-rose-600'>*</span>
									</div>
								</div>
							</Table.HeadCell>

							<Table.HeadCell>
								Collection Image
								<span className='text-rose-600'>*</span>
							</Table.HeadCell>

							<Table.HeadCell>
								Banner Image
								<span className='text-rose-600'>*</span>
							</Table.HeadCell>

							<Table.HeadCell></Table.HeadCell>
						</Table.Head>

						<Table.Body className='divide-y'>
							{bulkCollection?.map((item, index) => {
								return (
									<BulkCollectionTabelBody
										key={index}
										item={item}
										index={index}
										onDelete={() => deleteRowHandler(index)}
										setBulkCollection={setBulkCollection}
									/>
								)
							})}

							<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
								<Table.Cell className='w-1/4 font-medium'>
									<div className='w-full flex gap-12'>
										<span className='flex items-center justify-center'>
											{bulkCollection?.length + 1}
										</span>

										<div className='w-full min-w-64'>
											<TextInput
												placeholder='Collection name'
												value={collectionName}
												onChange={(e) => setCollectionName(e.target.value)}
												onBlur={() => {
													setCollectionName(
														capitalizeFirstLetter(collectionName.trim())
													)
													if (collectionName.trim()) {
														setCollectionBlurOut(true)
													} else {
														setCollectionBlurOut(false)
													}
												}}
											/>
										</div>
									</div>
								</Table.Cell>

								<Table.Cell className='w-1/4 '>
									<FileInput
										ref={collectionInputRef}
										id='media'
										name='file1'
										className='hidden '
										onChange={(e) => setTempFile(e.target.files[0])}
										accept='.jpg, .jpeg, .png,'
									/>

									{collectionInputRef && tempFile && (
										<CropperReact
											file={URL.createObjectURL(tempFile)}
											handler={collectionHandler}
											banner={false}
											fileName={tempFile?.name}
										/>
									)}

									<Label htmlFor='media' className='cursor-pointer'>
										<Avatar.Group>
											{collection_img?.map((img, i) => {
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
											{collection_img?.length ? null : (
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

								<Table.Cell className='w-1/4 '>
									<FileInput
										ref={bannerInputRef}
										id='banner'
										name='file2'
										className='hidden '
										onChange={(e) => setTempFileBanner(e.target.files[0])}
										accept='.jpg, .jpeg, .png,'
										multiple
									/>

									{bannerInputRef && tempFileBanner && (
										<CropperReact
											file={URL.createObjectURL(tempFileBanner)}
											handler={bannerHandler}
											banner={true}
											fileName={tempFileBanner?.name}
										/>
									)}

									<Label htmlFor='banner' className='cursor-pointer'>
										<Avatar.Group>
											{banner_img?.map((img, i) => {
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

											{banner_img?.length ? null : (
												<Label
													htmlFor='banner'
													className='rounded-full border w-12 h-12 z-40  bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'
												>
													+
												</Label>
											)}
										</Avatar.Group>
									</Label>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</div>
			</div>
		</>
	)
}
