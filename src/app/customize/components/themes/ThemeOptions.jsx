import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { Button } from 'flowbite-react'
import { useParams } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRef, useReducer, useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import Reviews from '../reviews'
import SlideShow from '../slideShow'
import Tagline from '../../components/tagLines/tagLine'
import { AddReviewModal } from '../reviews/addReviewModal'
import { ThemeModal } from '../productCollection/ThemeModal'
import { ThemeType, theme } from '../../../constant/dashboard/constant'

import CropperReact from '../../../cropper/cropperReact'
import { initialState, reducer } from './reducer/themeReducer'
import { capitalizeFirstLetter } from '../../../../utils/function'
import BackConfirmation from '../../../products/modal/backConfirmation'
import { sendMultipleImagesSlideShow } from '../../../utilis/sendMultipleImagesSlideShow'
import CategoriesCollection from '../productCollection/CategoriesCollection'
import {
	addThemePreview,
	bindOfferWithProducts,
	editThemePreview,
	getOffersList,
	getThemePreviewbyId,
} from '../../../../api/function'
import {
	mapProductIds,
	moveItem,
} from '../../../../utils/dashboard/customizeWebsite/function'

import { IoArrowBack } from 'react-icons/io5'
import { IoMdAddCircle } from 'react-icons/io'
import { FaCheckCircle } from 'react-icons/fa'
import Offer from '../offers/offer'

export default function ThemeOptions() {
	const tempFileRef = useRef(null)
	const [state, dispatch] = useReducer(reducer, initialState)
	const [showModal, setShowModal] = useState(false)
	const [showAddReviewModal, setShowAddReviewModal] = useState(false)

	const { id } = useParams()
	const location = useLocation()
	const navigate = useNavigate()

	const imageInputRef = useRef(null)
	const [isChange, setIsChange] = useState(false)

	const parts = location?.pathname?.split('/')
	const path = parts?.slice(2)[0]
	const themeRender = theme.find((theme) => theme.nav === path)

	//offers
	
    const [selectedOffer, setSelectedOffer] = useState('');
    const [availableOffersList, setAvailableOffersList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

	const {
		isModalOpen,
		title,
		themeOptionList,
		image,
		tempFile,
		isDragging,
		tagline,
		reviews,
		selectedCategoryId,
		selectedBannerId,
		selectedBannerCategoryId,
	} = state

	// Fetch data for edit and provide it to the state (Modify According to the THEME)
	const getDataForEdit = async (id) => {
		try {
			let res = await getThemePreviewbyId({ id })

			if (res) {
				const {
					title,
					product_ids,
					slideshow,
					tagline,
					reviews,
					category_ids,
				} = res?.data ?? {}

				let product_id = null

				switch (themeRender?.nav) {
					case 'products':
						product_id = mapProductIds(product_ids)
						dispatch({ type: 'SET_TITLE', payload: title })
						dispatch({ type: 'SET_THEME_OPTION_LIST', payload: product_ids })
						dispatch({
							type: 'SET_SUB_CATEGORY_IDS',
							payload: product_id,
						})
						break
					case 'catalog':
						product_id = mapProductIds(category_ids)
						dispatch({ type: 'SET_TITLE', payload: title })
						dispatch({ type: 'SET_THEME_OPTION_LIST', payload: category_ids })
						dispatch({
							type: 'SET_SUB_CATEGORY_IDS',
							payload: product_id,
						})
						break

					case 'slideshow':
						const slideshowIDs = slideshow?.map((item) => {
							return {
								banner_id: item?._id,
								category_id: item?.category_id,
							}
						})

						dispatch({ type: 'SET_IMAGE', payload: slideshow })
						dispatch({
							type: 'SET_SELECTED_BANNER_CATEGORY_ID',
							payload: slideshowIDs,
						})

						break

					case 'tagline':
						dispatch({ type: 'SET_TAGLINE', payload: tagline })
						break

					case 'reviews':
						dispatch({ type: 'SET_REVIEWS', payload: reviews })
						break

					default:
						break
				}
			}
		} catch (error) {
			toast.error(`Error while fetching data`)
		}
	}

	// call data for edit if id is present
	useEffect(() => {
		if (id) {
			getDataForEdit(id)
		}
	}, [id])

	// OnSubmit Add/Edit Theme
	const addEditCategories = () => {
		try {
			let concatenatedIds = themeOptionList?.map((item) => item._id)

			let data = {
				type: ThemeType[themeRender?.nav.toUpperCase()],
				[themeRender?.nav === 'products' ? 'product_ids' : 'category_ids']:
					concatenatedIds,
				hidden: false,
				title: capitalizeFirstLetter(title),
			}
			let res = null
			if (id) {
				res = editThemePreview(data, id)
			} else {
				res = addThemePreview(data)
			}
			toast.promise(res, {
				loading: 'Loading...',
				success: () => {
					if (!id) {
						dispatch({ type: 'SET_THEME_OPTION_LIST', payload: [] })
						dispatch({ type: 'SET_TITLE', payload: '' })
					}
					setIsChange(false)
					return `${id ? 'Updated' : 'Added'} ${themeRender.nav} successfully!`
				},
				error: (err) =>
					err || `Error while ${id ? 'updating' : 'adding'}  data`,
			})
		} catch (error) {
			toast.error(`Error while ${id ? 'updating' : 'adding'}  data`)
		}
	}

	// Modal Click
	const handleModalClick = () => {
		dispatch({ type: 'SET_MODAL' })
	}

	// SlideShow Modal Click
	const handleSlideModalClick = (id) => {
		dispatch({ type: 'SET_SELECTED_BANNER_ID', payload: id })
		dispatch({ type: 'SET_MODAL' })
	}

	// Move Selected Category
	const moveSelectedCategory = async (result, reviews) => {
		let response = null

		if (!result || !result.destination) return

		if (themeRender.nav === 'products') {
			const { source, destination } = result
			const items = Array.from(themeOptionList)
			const [reorderedItem] = items.splice(source.index, 1)
			items.splice(destination.index, 0, reorderedItem)

			response = items
		} else if (themeRender.nav === 'reviews') {
			response = moveItem(reviews, result)
		} else {
			response = moveItem(themeOptionList, result)
		}

		if (response) {
			if (themeRender.nav === 'reviews') {
				dispatch({ type: 'SET_REVIEWS', payload: response })
			} else {
				dispatch({ type: 'SET_THEME_OPTION_LIST', payload: response })
			}

			setIsChange(true)
		}
	}

	// Change Title
	const handleTitleChange = (e) => {
		setIsChange(true)
		dispatch({ type: 'SET_TITLE', payload: e.target.value })
	}

	// Change Tagline
	const handleTaglineChange = (e) => {
		setIsChange(true)
		dispatch({ type: 'SET_TAGLINE', payload: e.target.value })
	}

	//Offers handler
	const handleOffers = (e) => {
		setIsChange(true)
		dispatch({ type: 'SET_OFFERS', payload: e.target.value })
	}

	// OnSubmit Tagline CRUD
	const handleTaglineCrud = async () => {
		let promise = null

		const data = {
			type: 4,
			tagline: tagline,
			title: '',
		}

		if (id) {
			promise = editThemePreview(data, id)
		} else {
			promise = addThemePreview(data)
		}

		toast.promise(promise, {
			loading: 'Loading...',
			success: () => {
				setIsChange(false)
				navigate(-1)
				return `Tagline ${id ? 'Updated' : 'Added'} Successfully`
			},
			error: (err) =>
				err || `Error while ${id ? 'Updating' : 'Adding'} Tagline`,
		})
	}

	// Delete Category
	const deleteCategory = (categoryId) => {
		const updatedCategories = themeOptionList.filter(
			(category) => category._id !== categoryId
		)
		dispatch({ type: 'SET_THEME_OPTION_LIST', payload: updatedCategories })
		const product_id = mapProductIds(updatedCategories)
		setIsChange(true)
		dispatch({
			type: 'SET_SUB_CATEGORY_IDS',
			payload: product_id,
		})
	}

	// Image Handler for SlideShow Image having Unique _id
	const imageHandler = (file) => {
		if (file) {
			const type = file.type.split('/')[1]
			const newName = file?.name + '.' + type
			const updatedFile = new File([file], newName, {
				type: file.type,
				lastModified: file.lastModified,
			})
			updatedFile._id = uuidv4()
			dispatch({
				type: 'SET_IMAGE',
				payload: [...image, { formdata: updatedFile, _id: updatedFile._id }],
			})
			setIsChange(true)
		}
		dispatch({ type: 'SET_TEMP_FILE', payload: null })
		if (imageInputRef.current) {
			imageInputRef.current.value = null
		}
	}

	// OnSubmit Add/Edit SlideShow
	const addSlideShow = async () => {
		try {
			dispatch({ type: 'SET_IS_SLIDESHOW_ADDING', payload: true })
			// Filter the images that are already uploaded
			let imgArr = image
				?.filter((obj) => !obj?.img_id?.url)
				.map((obj) => obj.formdata)

			let img_ids = []

			if (imgArr?.length) {
				img_ids = await sendMultipleImagesSlideShow(imgArr)

				if (img_ids?.length === 0) {
					toast.error('Error while uploading slideShow images')
					dispatch({ type: 'SET_IS_SLIDESHOW_ADDING', payload: false })
					return
				}
			}

			const sortedImgIds = image?.map((img) => {
				const imgId = img_ids?.find(
					(imgId) => imgId?.uuid === img?.formdata?._id
				)

				let catalogId = null

				// If slideshow is already uploaded

				if (!img?.formdata) {
					return {
						img_id: img?.img_id?._id,
						category_id: img?.category_id,
					}
				} else {
					return { img_id: imgId._id, category_id: img?.category_id }
				}
			})

			const data = {
				slideshow: sortedImgIds,
				type: 3,
				title: '',
				hidden: false,
			}

			let promise = null
			if (id) {
				promise = editThemePreview(data, id)
			} else {
				promise = addThemePreview(data)
			}

			toast.promise(promise, {
				loading: 'Loading...',
				success: () => {
					dispatch({ type: 'SET_IS_SLIDESHOW_ADDING', payload: false })
					if (!id) {
						dispatch({ type: 'SET_IMAGE', payload: [] })
					}
					setIsChange(false)
					return `SlideShow ${id ? 'Updated' : 'Added'} Successfully`
				},
				error: (err) => err || 'Error while creating new collection',
			})
		} catch (error) {
			dispatch({ type: 'SET_IS_SLIDESHOW_ADDING', payload: false })
		}
	}

	// Verified Toggle In Reviews
	const handleVerifiedToggle = (index, toggle) => {
		setIsChange(true)

		const updatedReviews = reviews?.map((review, i) => {
			if (i === index) {
				return { ...review, verifiedBadge: toggle }
			}
			return review
		})

		dispatch({ type: 'SET_REVIEWS', payload: updatedReviews })
	}

	// OnSubmit Add/Edit Review
	const handleReviewCrud = async () => {
		let promise = null

		const data = {
			type: 5,
			reviews: reviews,
			title: 'What Our Customer Say',
		}

		if (id) {
			promise = editThemePreview(data, id)
		} else {
			promise = addThemePreview(data)
		}

		toast.promise(promise, {
			loading: 'Loading...',
			success: () => {
				setIsChange(false)
				return `Review ${id ? 'Updated' : 'Added'} Successfully`
			},
			error: (err) => err || `Error while ${id ? 'Updating' : 'Adding'} Review`,
		})
	}

	// Delete Handler for SlideShow
	const deleteHandler = (index) => {
		const newArray = image.filter((item, i) => {
			return i !== index
		})
		dispatch({ type: 'SET_IMAGE', payload: newArray })
		setIsChange(true)
	}

	// Save Products
	const saveProducts = (data) => {
		dispatch({ type: 'SET_THEME_OPTION_LIST', payload: data })
	}

	const dragStart = (event) => {
		if (!tempFileRef.current) {
			tempFileRef.current = event
		}
		dispatch({ type: 'SET_IS_DRAGGING', payload: true })
	}

	const dragEnd = () => {
		dispatch({ type: 'SET_IS_DRAGGING', payload: false })
	}

	const moveProduct = (result) => {
		if (tempFileRef.current) {
			tempFileRef.current = null
		}

		if (!result || !result.destination) return

		const { source, destination } = result
		const copyListItems = [...image]
		const [removedItem] = copyListItems.splice(source.index, 1)

		copyListItems.splice(destination.index, 0, removedItem)
		dispatch({ type: 'SET_IMAGE', payload: copyListItems })
		setIsChange(true)
		dispatch({ type: 'SET_IS_DRAGGING', payload: false })
	}

	// Go Back Confirmation Modal
	const handleGoBack = () => {
		if (
			(themeOptionList?.length || image?.length || reviews?.length) &&
			isChange
		) {
			setShowModal(true)
		} else {
			navigate(-1)
		}
	}

	// On Modal Confirm
	const handleModalConfirm = (confirmed) => {
		if (confirmed) {
			navigate(-1)
		} else {
			setShowModal(false)
		}
	}

	// On single item click
	const onSingleItemClick = (id) => {
		dispatch({ type: 'SET_SELECTED_CATEGORY_ID', payload: id })
	}

	// On select banner category id
	const onSelectBannerCategoryId = (data) => {
		setIsChange(true)

		const newData = selectedBannerCategoryId?.map((item) => {
			return { ...item, category_id: data?.category_id }
		})

		const newImage = image?.map((item) => {
			if (item?._id === data?.banner_id && item?.img_id) {
				return { ...item, category_id: data?.category_id }
			}
			if (item?.formdata?._id === data?.banner_id) {
				return { ...item, category_id: data?.category_id }
			}
			return item
		})

		dispatch({
			type: 'SET_SELECTED_BANNER_CATEGORY_ID',
			payload: newData,
		})

		dispatch({
			type: 'SET_IMAGE',
			payload: newImage,
		})
	}

	useEffect(() => {
        const getOffers = async () => {
            try{
                setIsLoading(true);
                const response =await getOffersList();
                setIsLoading(false);
            
                if(response.data.success){
                    setAvailableOffersList(response.data.data);
                }
            }
            catch(error){
                console.log(error);
                setIsLoading(false);
                toast.error(response.data.message || 'Internal server error');
            }
    }
        getOffers()
    },[])

	const handleOfferSelection = (offer) => {   
		setSelectedOffer(offer);
	
	}

	const bindOfferProductsHandler = async() => {	
		try{
			const productIds = themeOptionList.map(product => product._id);
			const offerId = selectedOffer._id;
			const response = await bindOfferWithProducts({offerId,productIds});
			if(response.data.success){
				toast.success(response.data.message);
				setSelectedOffer('');
				dispatch({ type: 'SET_THEME_OPTION_LIST', payload: [] });
			}
		}
		catch(error){
			console.log(error);
			toast.error(response.data.message || 'Internal server error');
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
			{showAddReviewModal && (
				<AddReviewModal
					state={state}
					dispatch={dispatch}
					setIsChange={setIsChange}
					showAddReviewModal={showAddReviewModal}
					setShowAddReviewModal={setShowAddReviewModal}
				/>
			)}

			<div className='flex  justify-center'>
				<div className=' container bg-white border border-gray-200  dark:bg-gray-800 dark:border-gray-700 '>
					<div className=' p-6  bg-white flex justify-between  border-b-2'>
						<button
							type='button'
							className='text-black bg-[#edf1f7] hover:bg-[#f7f9fc]  focus:bg-[#edf1f7] font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick={handleGoBack}
						>
							<IoArrowBack size={20} className='mr-1' />
							GO BACK
						</button>
						{themeRender.nav === 'tagline' ? (
							<h2 className='text-2xl'>Tagline</h2>
						) : themeRender.nav === 'about-us' ? (
							<h2 className='text-2xl'>About Us</h2>
						) : themeRender.nav === 'reviews' ? (
							<Button
								type='button'
								className='relative w-fit'
								onClick={() => setShowAddReviewModal(true)}
							>
								<IoMdAddCircle size={20} className='mr-1' />
								ADD {themeRender?.nav?.toUpperCase()}
							</Button>
						) : 
						themeRender.nav === 'offers' ? (
							<Button
							type='button'
							className='relative w-fit'
							onClick={
								themeRender.nav === 'offers' ? handleModalClick : null
							}
						>
							<IoMdAddCircle size={20} className='mr-1' />
							ADD
							{` ${themeRender?.nav?.toUpperCase()}`}
						</Button>
						) : 
						(
							<Button
								type='button'
								className='relative w-fit'
								onClick={
									themeRender.nav != 'slideshow' ? handleModalClick : null
									// handleModalClick
								}
							>
								<IoMdAddCircle size={20} className='mr-1' />
								ADD
								{themeRender.nav === 'slideshow'
									? ' IMAGE'
									: ` ${themeRender?.nav?.toUpperCase()}`}
								<input
									ref={imageInputRef}
									type='file'
									className={`${
										themeRender.nav === 'slideshow'
											? 'visible opacity-0'
											: 'hidden'
									} absolute w-fit`}
									onChange={(e) =>
										dispatch({
											type: 'SET_TEMP_FILE',
											payload: e.target.files[0],
										})
									}
									accept='.jpg, .jpeg, .png,'
								></input>
							</Button>
						)}
						{imageInputRef && tempFile && (
							<CropperReact
								file={URL.createObjectURL(tempFile)}
								handler={imageHandler}
								banner={true}
								fileName={tempFile?.name}
							/>
						)}

						{themeRender.nav === 'slideshow' ? (
							<Button
								type='button'
								disabled={(image && image?.length ? false : true) || !isChange}
								onClick={addSlideShow}
							>
								<FaCheckCircle size={20} className='mr-1' />
								SAVE COLLECTION
							</Button>
						) : themeRender.nav === 'tagline' ? (
							<Button
								type='button'
								disabled={!isChange}
								onClick={handleTaglineCrud}
							>
								<FaCheckCircle size={20} className='mr-1' />
								SAVE TAGLINE
							</Button>
						) : themeRender.nav === 'reviews' ? (
							<Button
								type='button'
								disabled={!isChange}
								onClick={handleReviewCrud}
							>
								<FaCheckCircle size={20} className='mr-1' />
								SAVE REVIEW
							</Button>
						) : themeRender.nav === 'offers' ?
						(
						<Button
							type='button'
							onClick={bindOfferProductsHandler}
							disabled={!themeOptionList?.length && !selectedOffer}
						>
							<FaCheckCircle size={20} className='mr-1' />
							BIND OFFER
						</Button>
						):
						(
							<Button
								type='button'
								onClick={addEditCategories}
								disabled={!title || !themeOptionList?.length || !isChange}
							>
								<FaCheckCircle size={20} className='mr-1' />
								SAVE COLLECTION
							</Button>
						)}
					</div>

					{(themeRender?.nav === 'products' ||
						themeRender?.nav === 'catalog') && (
						<CategoriesCollection
							themeRender={themeRender}
							themeOptionList={themeOptionList}
							moveSelectedCategory={moveSelectedCategory}
							title={title}
							handleTitleChange={handleTitleChange}
							deleteCategory={deleteCategory}
							handleModalClick={handleModalClick}
						/>
					)}

					{themeRender?.nav === 'tagline' && (
						<Tagline
							title={tagline}
							themeRender={themeRender}
							handleTaglineChange={handleTaglineChange}
						/>
					)}

					{themeRender?.nav === 'reviews' && (
						<Reviews
							dispatch={dispatch}
							setIsChange={setIsChange}
							reviews={state?.reviews}
							themeRender={themeRender}
							deleteCategory={deleteCategory}
							handleVerifiedToggle={handleVerifiedToggle}
							moveSelectedCategory={moveSelectedCategory}
						/>
					)}

					{isModalOpen && (
						<ThemeModal
							image={image}
							isOpen={isModalOpen}
							themeOptionList={themeOptionList}
							setOptionList={saveProducts}
							setIsChange={setIsChange}
							setModal={handleModalClick}
							themeRender={themeRender}
							onSingleItemClick={onSingleItemClick}
							selectedCategoryId={selectedCategoryId}
							selectedBannerId={selectedBannerId}
							onSelectBannerCategoryId={onSelectBannerCategoryId}
						/>
					)}

					{themeRender?.nav === 'offers' && (
						<Offer
							selectedOffer={selectedOffer}
							availableOffersList={availableOffersList}
							handleOfferSelection={handleOfferSelection}	
							themeOptionList={themeOptionList}
							deleteCategory={deleteCategory}
						/>
					)}
					<div>
						<DragDropContext onDragEnd={moveProduct} onDragStart={dragStart}>
							<Droppable droppableId='product-list'>
								{(provided) => (
									<div
										className='max-h-[86vh] overflow-auto bg-slate-100'
										ref={provided.innerRef}
										{...provided.droppableProps}
									>
										{themeRender.nav === 'slideshow' && image?.length
											? image?.map((item, i) => {
													return (
														<Draggable
															key={item?._id}
															draggableId={item?._id}
															index={i}
														>
															{(provided) => (
																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																	// draggable={!isDragging}
																	onDragStart={dragStart}
																	onDragEnd={dragEnd}
																>
																	<SlideShow
																		dispatch={dispatch}
																		tempFileRef={tempFileRef.current}
																		isDragging={isDragging}
																		key={i}
																		item={item}
																		index={i}
																		deleteHandler={deleteHandler}
																		list={image}
																		handleModalClick={handleSlideModalClick}
																	/>
																</div>
															)}
														</Draggable>
													)
											  })
											: null}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>
				</div>
			</div>
		</>
	)
}
