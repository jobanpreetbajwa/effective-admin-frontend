import { toast } from 'sonner'
import Chips from '../../chips/chips'
import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import ImageLabel from '../imageLabel/imageLabel'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, FileInput, Label, TextInput } from 'flowbite-react'
import { addCategoryToList } from '../../../../store/slices/categoryList'

import { sendMultipleImages } from '../../../utilis/sendMultipleImages'
import { DELETE_ACTION_TYPE } from '../../../staticData/constantActions'

import CropperReact from '../../../cropper/cropperReact'
import BackConfirmation from '../../modal/backConfirmation'
import { capitalizeFirstLetter } from '../../../../utils/function'
import {
	addSingleCollection,
	addTagsInCollection,
} from '../../../../api/function'

import { CiCircleRemove } from 'react-icons/ci'
import { IoIosArrowRoundBack } from 'react-icons/io'

export default function AddCollection({ setAddCollection }) {
	const { categoryID } = useParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [showModal, setShowModal] = useState(false)
	const [collectionName, setCollectionName] = useState('')

	const [sendImages, setSendImages] = useState([])
	const [collectionTags, setCollectionTags] = useState({})

	const [bannerImage, setBannerImage] = useState([])
	const [sendBannerImages, setSendBannerImages] = useState([])

	const [tempFiles, setTempFiles] = useState()
	const [inputField, setInputField] = useState(false)
	const [tempFilesBanner, setTempFilesBanner] = useState(null)
	const [isAddingCollection, setIsAddingCollection] = useState(false)

	const bannerInputRef = useRef(null)
	const collectionInputRef = useRef(null)

	// on closemodal trigger setCollectionName to empty string
	function onCloseModal() {
		setCollectionName('')
	}

	//handleClick function updates the collection tags state based on the specified action, either deleting the tag if it exists or adding it if it doesn't. It manages the state of collection tags within a component
	const handleClick = (val, action) => {
		if (action === DELETE_ACTION_TYPE) {
			setCollectionTags((prev) => {
				const newTags = { ...prev }
				delete newTags[val]
				return newTags
			})
		} else if (collectionTags[val]) {
		} else {
			setCollectionTags((prev) => {
				return { ...prev, [val]: val }
			})
		}
	}

	//handleFileChange function sets the collection image state with the selected file.
	const handleFileChange = (files) => {
		if (files) {
			setSendImages((prevImages) => [...prevImages, files])
		}

		setTempFiles(null)
		collectionInputRef.current.value = ''
	}

	//bannerImageHandler function sets the banner image state with the selected file.
	const bannerImageHandler = async (files) => {
		if (files) {
			setSendBannerImages((prevImages) => [...prevImages, files])
			setBannerImage((prevImages) => [...prevImages, files])
		}

		setTempFilesBanner(null)
		bannerInputRef.current.value = ''
	}

	// handleAddTagsInCollection makes api call call to add tags in a collection with given collection ID.
	const handleAddTagsInCollection = async (categoryID) => {
		const data = new URLSearchParams()
		data.append('names', JSON.stringify(Object.keys(collectionTags)))

		return addTagsInCollection({ categoryID, data })
			.then((response) => response.data)
			.catch((error) => {
				console.error('Error while adding tags to collection:', error)
			})
	}

	// createCollection makes api call call to create collection.
	const createCollection = async (event) => {
		event.preventDefault()
		try {
			setIsAddingCollection(true)
			if (sendImages?.length === 0) {
				toast.error('Please upload collection image')
				setIsAddingCollection(false)
				return
			}

			if (sendBannerImages?.length === 0) {
				toast.error('Please upload banner images')
				setIsAddingCollection(false)
				return
			}

			// FileObject to get the imageIds
			const img_ids = await sendMultipleImages(sendImages)

			if (img_ids?.length === 0) {
				toast.error('Error while uploading collection image')
				setIsAddingCollection(false)
				return
			}

			const banner_ids = await sendMultipleImages(sendBannerImages)
			if (banner_ids?.length === 0) {
				toast.error('Error while uploading banner images')
				setIsAddingCollection(false)
				return
			}

			// Generate payload to send to api
			const data = {
				name: collectionName,
				img_ids: img_ids,
				banner_ids: banner_ids,
			}

			// addSingleCollection makes api call to add single collection.
			const promise = addSingleCollection(data)
				.then(async (response) => {
					const result = response?.data
					const subCategoriesData = await handleAddTagsInCollection(result?._id)

					setSendImages([])
					setBannerImage([])
					setSendBannerImages([])
					setCollectionName('')
					setCollectionTags({})
					dispatch(
						addCategoryToList({
							...result,
							subcategories: subCategoriesData?.subCategoriesAdded,
						})
					)
				})
				.catch((error) => {
					setIsAddingCollection(false)
					console.error('Error while creating collection:', error)
					if (error.response?.data?.message === 'ALREADY_EXIST') {
						throw new Error('Collection already exists')
					}
					throw new Error('Error while creating new collection')
				})

			toast.promise(promise, {
				loading: 'Loading...',
				success: () => {
					setIsAddingCollection(false)
					onCloseModal()
					event.target.reset()
					return 'Collection added successfully'
				},
				error: (err) => err || 'Error while creating new collection',
			})
		} catch (error) {
			console.log('Error  while creating new collection', error)
		}
	}

	//isEmpty function checks if essential fields and data within a collection are empty, returning true if no data is present, otherwise false.
	const isEmpty = () => {
		if (
			collectionName ||
			sendImages?.length ||
			bannerImage?.length ||
			Object.keys(collectionTags).length
		) {
			return false
		} else {
			return true
		}
	}

	//navigateHandler,if there is no changes in the list,moves back without asking for user confirmation.
	const navigateHandler = () => {
		if (!isEmpty()) {
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
			{showModal && (
				<BackConfirmation
					openModal={showModal}
					onConfirm={handleModalConfirm}
				/>
			)}

			<div className='flex flex-col gap-4 justify-start w-full h-max-full p-4 pb-14'>
				<button
					className={`flex items-center `}
					onClick={isAddingCollection ? null : navigateHandler}
				>
					<IoIosArrowRoundBack size={32} />
					<p>Back </p>
				</button>
				<form className='space-y-6' onSubmit={createCollection}>
					<div>
						<div className='mb-2 block'>
							<Label htmlFor='collectionName' value='Collection Name' />
							<Label
								value='*'
								htmlFor='collectionName'
								className='text-rose-600'
							/>
						</div>
						<TextInput
							className='w-2/4'
							id='collectionName'
							value={collectionName}
							placeholder='Collection Name'
							onChange={(event) => setCollectionName(event.target.value)}
							onBlur={() =>
								setCollectionName(capitalizeFirstLetter(collectionName))
							}
							maxLength={50}
							required
						/>
					</div>
					<div>
						<div className='mb-2 block'>
							<Label htmlFor='image' value='Collection Image' />
							<Label htmlFor='image' value='*' className='text-rose-600' />
						</div>

						<FileInput
							ref={collectionInputRef}
							id='dropzone-file'
							name='file'
							className='hidden'
							onChange={(event) => {
								setTempFiles(event.target.files[0])
							}}
							accept='.jpg, .jpeg, .png,'
						/>

						{collectionInputRef && tempFiles && (
							<CropperReact
								banner={false}
								handler={handleFileChange}
								fileName={tempFiles?.name}
								file={URL.createObjectURL(tempFiles)}
							/>
						)}

						{sendImages && sendImages?.length ? (
							<div className='flex gap-4 h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-auto px-4'>
								<div className='flex items-center gap-4'>
									{sendImages.map((image, index) => (
										<div
											key={index}
											className='relative max-h-44 w-48 bg-gray-50'
										>
											<img
												alt='product'
												src={URL.createObjectURL(image)}
												className='w-full object-contain'
											/>
											<button
												type='button'
												className='absolute -top-2 -right-2 bg-white rounded-full cursor-pointer hover:bg-red-100'
												onClick={() => {
													setSendImages(
														sendImages.filter((_, i) => i !== index)
													)
												}}
											>
												<CiCircleRemove size={28} color='red' />
											</button>
										</div>
									))}
								</div>
							</div>
						) : (
							<ImageLabel id='dropzone-file' />
						)}
					</div>
					<div className='col-span-full  pb-6'>
						<div className='mb-2 block'>
							<Label htmlFor='image' value='Banner Image' />
							<Label htmlFor='image' value='*' className='text-rose-600' />
						</div>

						<FileInput
							name='file2'
							className='hidden'
							id='dropzone-file2'
							ref={bannerInputRef}
							accept='.jpg, .jpeg, .png,'
							onChange={(e) => setTempFilesBanner(e.target.files[0])}
						/>

						{bannerInputRef && tempFilesBanner && (
							<CropperReact
								banner={true}
								handler={bannerImageHandler}
								fileName={tempFilesBanner?.name}
								file={URL.createObjectURL(tempFilesBanner)}
							/>
						)}

						{bannerImage && bannerImage?.length ? (
							<div className='flex justify-center gap-4 h-64 items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-auto px-4'>
								<div className='flex items-center gap-4'>
									{bannerImage?.length < 5 ? (
										<Label
											htmlFor='dropzone-file2'
											className='rounded border w-40 h-40 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'
										>
											Add More
										</Label>
									) : null}

									{bannerImage?.map((image, index) => (
										<div
											key={index}
											className='relative max-h-44 w-48 bg-gray-50'
										>
											<img
												src={URL.createObjectURL(image)}
												alt='product'
												className='w-full h-full object-contain'
											/>
											<button
												type='button'
												className='absolute -top-2 -right-2 bg-white rounded-full cursor-pointer hover:bg-red-100'
												onClick={() => {
													setBannerImage(
														bannerImage.filter((img, i) => i !== index)
													)
													setSendBannerImages(
														sendBannerImages.filter((img, i) => i !== index)
													)
												}}
											>
												<CiCircleRemove size={28} color='red' />
											</button>
										</div>
									))}
								</div>
							</div>
						) : (
							<ImageLabel id={'dropzone-file2'} />
						)}
					</div>
					<div className='mb-2 flex flex-col gap-1'>
						<Label htmlFor='collectionTags' value='Collection Tags' />
						<div className='flex gap-2 flex-wrap max-h-16 overflow-auto py-2'>
							{Object.keys(collectionTags).map((item, i) => {
								return (
									<Chips
										key={i}
										label={item}
										variant={'abcd'}
										handleClick={handleClick}
									/>
								)
							})}
							<div
								onClick={() => setInputField(true)}
								className={`relative inline-block border border-black/40 bg-white rounded-full py-1 px-2 text-xs font-semibold cursor-pointer transition-all duration-300 ${
									inputField ? 'max-w-48 w-24' : 'w-fit'
								}`}
							>
								{inputField ? (
									<input
										autoFocus
										className='w-full border-none bg-transparent focus:outline-none font-normal'
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												if (e.target.value) {
													handleClick(e.target.value)
												}
												setInputField(false)
											}
										}}
										onBlur={(e) => {
											if (e.target.value) {
												handleClick(e.target.value)
											}
											setInputField(false)
										}}
									/>
								) : (
									'+'
								)}
							</div>
						</div>
					</div>

					<Button type='submit' disabled={isAddingCollection}>
						Add Collection
					</Button>
				</form>
			</div>
		</>
	)
}
