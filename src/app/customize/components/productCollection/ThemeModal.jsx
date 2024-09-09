import { Button, Modal } from 'flowbite-react'
import { IoArrowBack } from 'react-icons/io5'
import { useState } from 'react'
import { useReducer } from 'react'
import { initialState, reducer } from '../themes/reducer/themeReducer'
import { getCategory, getCategoryProducts } from '../../../../api/function'
import { toast } from 'sonner'
import {
	filterByProductIds,
	mapProductIds,
} from '../../../../utils/dashboard/customizeWebsite/function'
import { useEffect } from 'react'
import ThemeModalContent from './ThemeModalContent'

export const ThemeModal = ({
	image,
	isOpen,
	themeOptionList,
	setOptionList,
	setIsChange,
	setModal,
	themeRender,
	onSingleItemClick,
	selectedCategoryId,
	selectedBannerId,
	onSelectBannerCategoryId,
}) => {
	const [state, dispatch] = useReducer(reducer, initialState)
	const [hasProduct, setHasProduct] = useState(true)

	const {
		subCategories,
		categoryId,
		subCategoryIds,
		isCategorySelected,
		isLoadingCategoryList,
		allSelectedCategories,
		categories,
	} = state

	useEffect(() => {
		if (themeOptionList?.length) {
			let product_id = mapProductIds(themeOptionList)
			dispatch({
				type: 'SET_SUB_CATEGORY_IDS',
				payload: product_id,
			})
		}
		categoryGet()
	}, [])

	const ResetState = () => {
		setModal()
		dispatch({ type: 'SET_IS_CATEGORY_SELECTED', payload: false })
		dispatch({ type: 'SET_CATEGORY_ID', payload: '' })
		dispatch({ type: 'SET_SELECTED_CATEGORY', payload: '' })
	}

	const onClose = () => {
		const product_id = mapProductIds(themeOptionList)
		dispatch({
			type: 'SET_SUB_CATEGORY_IDS',
			payload: product_id,
		})
		ResetState()
	}

	const onCloseSlide = () => {
		let data = { banner_id: selectedBannerId, category_id: selectedCategoryId }
		onSelectBannerCategoryId(data)
		onClose()
	}

	// Back Button Click Reset State
	const handleOnBackClick = () => {
		dispatch({ type: 'SET_SUB_CATEGORIES', payload: [] })
		dispatch({ type: 'SET_CATEGORY_ID', payload: '' })
		dispatch({ type: 'SET_IS_CATEGORY_SELECTED', payload: false })
	}

	// Fetch Category
	const categoryGet = async () => {
		dispatch({ type: 'SET_IS_LOADING_CATEGORY_LIST', payload: true })
		try {
			let res = await getCategory()
			if (res?.data?.categories) {
				if (
					themeRender?.nav === 'catalog' ||
					themeRender?.nav === 'slideshow'
				) {
					dispatch({
						type: 'SET_SUB_CATEGORIES',
						payload: res?.data?.categories,
					})
					dispatch({ type: 'SET_IS_CATEGORY_SELECTED', payload: true })
				} else {
					dispatch({ type: 'SET_CATEGORIES', payload: res?.data?.categories })
					dispatch({ type: 'SET_IS_CATEGORY_SELECTED', payload: false })
				}
			}
		} catch (error) {
			toast.error(`Error while fetching category`)
		} finally {
			dispatch({ type: 'SET_IS_LOADING_CATEGORY_LIST', payload: false })
		}
	}

	const categoryClickedHandler = (id) => {
		dispatch({ type: 'SET_CATEGORY_ID', payload: id })
	}

	// get Category Products for modal
	const handleCategorySubmit = async () => {
		if (categoryId) {
			dispatch({ type: 'SET_IS_LOADING_CATEGORY_LIST', payload: true })
			try {
				let res = await getCategoryProducts({ categoryID: categoryId })
				if (res?.data?.products) {
					dispatch({ type: 'SET_IS_CATEGORY_SELECTED', payload: true })
					dispatch({
						type: 'SET_SUB_CATEGORIES',
						payload: res?.data?.products,
					})
				}
			} catch (error) {
				toast.error(`Error while fetching products`)
			} finally {
				dispatch({ type: 'SET_IS_LOADING_CATEGORY_LIST', payload: false })
			}
		}
	}

	const productClickedHandler = (id) => {
		const checkIfIdPresent = allSelectedCategories?.findIndex(
			(item) => item?._id === id
		)
		if (checkIfIdPresent === -1) {
			const concatIds = [...allSelectedCategories, ...subCategories]
			dispatch({ type: 'SET_ALL_SELECTED_CATEGORIES', payload: concatIds })
		}

		if (subCategoryIds.includes(id)) {
			dispatch({
				type: 'SET_SUB_CATEGORY_IDS',
				payload: subCategoryIds.filter((itemId) => itemId !== id),
			})
		} else {
			dispatch({
				type: 'SET_SUB_CATEGORY_IDS',
				payload: [...subCategoryIds, id],
			})
		}
	}

	const handleProductSubmit = () => {
		if (subCategoryIds?.length) {
			const filteredData = filterByProductIds(
				allSelectedCategories,
				subCategoryIds
			)
			const filterProduct = filterByProductIds(themeOptionList, subCategoryIds)

			const alreadyList = [...filterProduct, ...filteredData]
			const uniqueObjects = Array.from(
				new Set(alreadyList.map((obj) => obj._id))
			).map((id) => {
				return alreadyList.find((obj) => obj._id === id)
			})
			setOptionList(uniqueObjects)
			setIsChange(true)
		}

		ResetState()
	}

	let items = isCategorySelected ? subCategories : categories

	let selectedItem =
		themeRender.nav === 'slideshow'
			? selectedCategoryId
			: isCategorySelected
			? subCategoryIds
			: categoryId

	const onItemClick = (id) => {
		isCategorySelected ? productClickedHandler(id) : categoryClickedHandler(id)
	}

	return (
		<Modal show={isOpen} size='sm' onClose={onClose}>
			<Modal.Header className='p-6 text-center'>
				{themeRender?.nav === 'tagline' ? (
					<div className='flex text-center '>Enter TagLine</div>
				) : (
					<div className='flex text-center '>
						{isCategorySelected && themeRender?.nav == 'products' && (
							<IoArrowBack
								size={20}
								className='mr-1 cursor-pointer text-slate-400 mt-1 place-content-between'
								onClick={() => handleOnBackClick()}
							/>
						)}

						{isCategorySelected 
							? 'Select Products'
							: 'Select Collection'}
					</div>
				)}
			</Modal.Header>

			<Modal.Body>
				<ThemeModalContent
					isLoadingCategoryList={isLoadingCategoryList}
					items={items}
					setHasProduct={setHasProduct}
					selectedItem={selectedItem}
					onItemClick={onItemClick}
					onSingleItemClick={onSingleItemClick}
				/>
			</Modal.Body>
			<Modal.Footer>
				<p>
					{subCategoryIds?.length && isCategorySelected
						? `You have selected ${subCategoryIds?.length} items`
						: ''}
				</p>
				{hasProduct ? (
					<Button
						onClick={
							themeRender.nav === 'slideshow'
								? onCloseSlide
								: isCategorySelected
								? handleProductSubmit
								: handleCategorySubmit
						}
						disabled={
							themeRender.nav === 'slideshow'
								? !selectedCategoryId
								: isCategorySelected
								? !subCategoryIds?.length
								: !categoryId?.length
						}
					>
						Select
					</Button>
				) : (
					<span className='text-red-500'>
						Sorry, no products in this collection!
					</span>
				)}
			</Modal.Footer>
		</Modal>
	)
}
