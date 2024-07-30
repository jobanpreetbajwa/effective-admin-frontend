import { toast } from 'sonner'
import { Modal } from 'flowbite-react'
import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, FileInput } from 'flowbite-react'

import Chips from '../../chips/chips'
import ImageLabel from '../imageLabel/imageLabel'
import CropperReact from '../../../cropper/cropperReact'
import { editCollection } from '../../../../api/function'
import BannerImagesComponent from './components/bannerImages'
import { capitalizeFirstLetter } from '../../../../utils/function'
import { sendMultipleImages } from '../../../utilis/sendMultipleImages'
import { editCategoryListData } from '../../../../store/slices/categoryList'
import {
	ADD_PRODUCT_ACTION_TYPE,
	DELETE_ACTION_TYPE,
} from '../../../staticData/constantActions'

import { FaEdit } from 'react-icons/fa'
import { CiCircleRemove } from 'react-icons/ci'
import ChangeTagNameModal from './components/changeTagNameModal'

export default function EditCategory({
	item,
	setEditCategory,
	searchedList,
	setSearchedList,
}) {
	const dispatch = useDispatch()
	const { categoryID } = useParams()
	const [tags, setTags] = useState(item?.subcategories || [])
	const [inputField, setInputField] = useState(false)
	const [newTag, setNewTag] = useState('')

	const [changedName, setChangedName] = useState(null)
	const [collectionImage, setCollectionImage] = useState(
		item?.img_ids && item?.img_ids[0]?.url
	)
	const [collectionImageSend, setCollectionImageSend] = useState(null)

	const bannerImageObject = JSON.parse(JSON.stringify(item?.banner_ids))

	const [bannerImage, setBannerImage] = useState(bannerImageObject || [])
	const [bannerImageSend, setBannerImageSend] = useState([])
	const [deletedBannerImages, setDeletedBannerImages] = useState([])

	const [subcategories, setSubcategories] = useState([])
	const [deleted, setDeleted] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const [tempFile, setTempFile] = useState(null)

	const collectionInputRef = useRef(null)

	const editTagNameIndex = useRef(null)
	const [editedTags, setEditedTags] = useState([])

	const [openEditTagModal, setOpenEditTagModal] = useState(false)

	// Close the drawer
	const closeHandler = () => {
		setEditCategory(false)
	}

	// Handle the change in the name of the collection
	const nameChangeHandler = (e) => {
		e.stopPropagation()

		setChangedName(e.target.value.trim())
	}

	// Handle the collection image
	const collectionImageHandler = async (file) => {
		if (file) {
			setCollectionImageSend(file)
			setCollectionImage(file)
		}

		collectionInputRef.current.value = ''
		setTempFile(null)
	}

	// Handle the tags Click
	const handleClick = (val, action) => {
		const tagExists = tags?.some((tag) => tag.name === val)

		if (tagExists) {
			if (action === DELETE_ACTION_TYPE) {
				const updatedTags = tags?.filter((tag) => {
					if (tag?.name !== val) {
						return tag
					} else {
						if (tag?._id) {
							setDeleted((prev) => {
								return [...prev, tag?._id]
							})
						}
					}
				})
				if (subcategories.includes(val)) {
					const updatedTags = subcategories?.filter((tag) => tag !== val)

					setSubcategories(updatedTags)
				}
				setTags(updatedTags)
			}
		} else {
			const newTag = { _id: '', name: val.trim() }
			setSubcategories((prev) => {
				return [...prev, val]
			})
			setTags((prevTags) => [...prevTags, newTag])
		}
	}

	// Handle the new tag
	const newTagHandler = (e) => {
		if (e.target.value) {
			setNewTag(e.target.value)
		}
	}

	// OnSubmit the edit category
	const editCategoryHandler = async (event) => {
		event.preventDefault()
		try {
			setIsLoading(true)

			if (!collectionImage) {
				toast.error('Please upload collection image')
				setIsLoading(false)
				return
			}

			if (!bannerImage.length && !bannerImageSend.length) {
				toast.error('Please upload banner image')
				setIsLoading(false)
				return
			}

			let bannerUploads = []
			if (bannerImageSend?.length) {
				bannerUploads = await sendMultipleImages(bannerImageSend)
			}

			let collectionUploads = []
			if (collectionImageSend) {
				collectionUploads = await sendMultipleImages([collectionImageSend])
			}

			const data = {
				update: {
					category_name: changedName ? changedName : item?.category_name,
				},
				deletes: deleted,
				bannerUpdate: bannerUploads,
				bannerDelete: deletedBannerImages,
				subcategoryName: subcategories,
				editSubcategories: editedTags,
			}

			if (collectionUploads.length) {
				data.imageUpdate = collectionUploads
			}

			console.log('data', data)

			const promise = editCollection({ id: item?._id, data: data })
				.then((response) => {
					const updated = {
						...response.data?.updatedCategory,
						subcategories: [...response.data?.subcategories],
					}
					dispatch(editCategoryListData(updated))
					if (searchedList) {
						setSearchedList((prev) => {
							return prev?.map((item) => {
								if (item?._id === updated?._id) {
									return updated
								} else {
									return item
								}
							})
						})
					}
				})
				.catch((error) => {
					console.error('Axios Error while editing category:', error?.message)
					if (
						error.response &&
						error.response.data &&
						error.response.data.message
					) {
						const errorMessage = error.response.data.message

						throw new Error(errorMessage)
					}
				})

			toast.promise(promise, {
				loading: 'Loading...',
				success: () => {
					closeHandler()
					return `Category edited successfully`
				},
				error: (err) => {
					return err || 'Error'
				},
				finally: () => {
					setIsLoading(false)
				},
			})
		} catch (error) {
			console.log('Error while editing category ', error)
			setIsLoading(false)
		}
		setIsLoading(false)
	}

	const handleTagNameChange = (index) => {
		editTagNameIndex.current = index
		setOpenEditTagModal(true)
	}

	console.log('editedTags', editedTags)
	return (
		<>
			<ChangeTagNameModal
				tags={tags}
				setTags={setTags}
				setSubcategories={setSubcategories}
				editedTags={editedTags}
				index={editTagNameIndex.current}
				openModal={openEditTagModal}
				setEditedTags={setEditedTags}
				setOpenModal={setOpenEditTagModal}
			/>
			<div
				id='drawer-form'
				className='fixed flex flex-col gap-4 top-0 right-0 z-40 h-full w-96 p-4 overflow-y-auto border-l drop-shadow bg-white cursor-auto  dark:bg-gray-800'
				tabIndex='-1'
				aria-labelledby='drawer-form-label'
				onClick={(e) => e.stopPropagation()}
			>
				<h5
					id='drawer-label'
					className='inline-flex items-center gap-1 text-base font-semibold text-gray-500 uppercase dark:text-gray-400'
				>
					<FaEdit size={20} />
					Edit Collection
				</h5>
				<button
					type='button'
					data-drawer-hide='drawer-form'
					aria-controls='drawer-form'
					className=' text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white'
					onClick={closeHandler}
				>
					<svg
						className='w-3 h-3 '
						aria-hidden='true'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 14 14'
					>
						<path
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
						/>
					</svg>
					<span className='sr-only'>Close menu</span>
				</button>

				<form className='mb-6' onSubmit={editCategoryHandler}>
					<div className='mb-6'>
						<label
							htmlFor='title'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
						>
							COLLECTION NAME<span className='text-rose-600'>*</span>
						</label>
						<input
							type='text'
							id='title'
							className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
							defaultValue={item?.category_name}
							required
							value={changedName}
							maxLength={50}
							onChange={nameChangeHandler}
							onBlur={() => {
								setChangedName(capitalizeFirstLetter(changedName))
							}}
						/>
					</div>

					<div className='col-span-full pb-6'>
						<h2 className='text-sm font-medium leading-7 text-gray-900 mb-2'>
							COLLECTION IMAGE<span className='text-rose-600'>*</span>
						</h2>

						<FileInput
							ref={collectionInputRef}
							id='categoryCollectionImage'
							name='file'
							className='hidden'
							onChange={(e) => {
								setTempFile(e.target.files[0])
							}}
							accept='.jpg, .jpeg, .png,'
						/>
						{collectionInputRef && tempFile && (
							<CropperReact
								file={URL.createObjectURL(tempFile)}
								handler={collectionImageHandler}
								banner={false}
								fileName={tempFile?.name}
							/>
						)}
						{collectionImage ? (
							<div className='flex gap-4 h-64 items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-auto px-4'>
								<div className='flex gap-4'>
									<div className='relative w-40 h-40 bg-gray-50'>
										<img
											src={
												collectionImageSend
													? URL.createObjectURL(collectionImageSend)
													: collectionImage
											}
											alt='product'
											className='w-full h-full object-contain'
										/>
										<button
											type='button'
											className='absolute -top-2 -right-2 bg-white rounded-full cursor-pointer hover:bg-red-100'
											onClick={() => {
												setCollectionImage(null)
											}}
										>
											<CiCircleRemove size={28} color='red' />
										</button>
									</div>
								</div>
							</div>
						) : (
							<ImageLabel id={'categoryCollectionImage'} />
						)}
					</div>

					<BannerImagesComponent
						bannerImage={bannerImage}
						setBannerImage={setBannerImage}
						bannerImageSend={bannerImageSend}
						setBannerImageSend={setBannerImageSend}
						deletedBannerImages={deletedBannerImages}
						setDeletedBannerImages={setDeletedBannerImages}
					/>

					<div className='mb-2 flex flex-col gap-1'>
						<h2 className='text-sm font-medium leading-7 text-gray-900 '>
							COLLECTION TAGS
						</h2>

						<div className='flex gap-2 flex-wrap  overflow-y-auto py-2'>
							{tags?.map((item, i) => {
								return (
									<>
										<Chips
											key={i}
											editable={true}
											variant={'abcd'}
											label={item?.name}
											handleClick={handleClick}
											onClick={() => handleTagNameChange(i)}
										/>
									</>
								)
							})}
							<div
								className={`inline-block border border-black/40 bg-white rounded-full py-1 px-2 text-xs font-semibold cursor-pointer transition-all duration-300 ${
									inputField ? 'max-w-48 w-24' : 'w-fit'
								}`}
								onClick={() => setInputField(true)}
							>
								{inputField ? (
									<>
										<input
											className='w-full border-none bg-transparent focus:outline-none font-normal'
											autoFocus
											onChange={newTagHandler}
											maxLength={50}
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													if (e.target.value) {
														handleClick(e.target.value, ADD_PRODUCT_ACTION_TYPE)
													}
													setInputField(false)
												}
											}}
											onBlur={(e) => {
												if (e.target.value) {
													handleClick(e.target.value, ADD_PRODUCT_ACTION_TYPE)
												}
												setInputField(false)
											}}
										/>
									</>
								) : (
									'+'
								)}
							</div>
						</div>
					</div>
					<div className='flex justify-between gap-2'>
						<Button type='button' onClick={closeHandler} outline>
							Cancel
						</Button>

						<Button type='submit' disabled={isLoading}>
							Save Collection
						</Button>
					</div>
				</form>
			</div>
		</>
	)
}
