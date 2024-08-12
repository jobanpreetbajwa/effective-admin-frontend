const { VITE_BASE_URL } = import.meta.env

import { toast } from 'sonner'
import { Dropdown, Button } from 'flowbite-react'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'

import SearchBar from '../search/searchBar'
import reorderList from './utils/reorderList'
import ExcelExport from './components/excelExport'
import SortSearchedList from './utils/sortSearchedList'
import BulkDeleteProducts from './modal/bulkDeleteProducts'
import {
	syncCategoryList,
	updateCategoryItemsCount,
} from '../../store/slices/categoryList'

import {
	deleteBulkProduct,
	getCategoryProducts,
	searchProducts,
} from '../../api/function'

import {
	syncProductList,
	clearProductList,
	removeProductFromList,
} from '../../store/slices/currentProductList'

import { FaEye } from 'react-icons/fa'

export default function TopBar({
	limit,
	filterTags,
	saveChanges,
	currentPage,
	searchedItem,
	setSaveChanges,
	setHasMorePages,
	setSearchedList,
	setSearchedItem,
	allProductSelected,
	selectedProductsData,
	setAllProductSelected,
	setSelectedProductsData,
}) {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	let { categoryID } = useParams()
	const productListSelector = useSelector((state) => state.currentProductList)
	const categoryListSelector = useSelector((state) => state.categoryList)

	const timerId = useRef(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const [editButtons, setEditButtons] = useState(false)
	const [tempProductList, setTempProductList] = useState(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [tempCategoryList, setTempCategoryList] = useState(null)

	//debounce function returns a debounced version of a given function, delaying its execution until after a specified wait time has passed since the last invocation.
	const debounce = (func, delay) => {
		return function (...args) {
			clearTimeout(timerId.current)

			timerId.current = setTimeout(() => {
				func.apply(this, args)
			}, delay)

			//   dispatch(
			//     syncProductList({
			//       id: categoryID,
			//       element: [],
			//     })
			//   )
		}
	}
	//searchHandler function, created using debounce, updates the search criteria with a delay of 400 milliseconds to prevent excessive execution during user input
	const searchHandler = debounce((e) => {
		if (!e.target.value) {
			setSearchedList(null)
			const id = categoryListSelector[0]?._id
			navigate(`/products/${id ? id : ''}`)
			return
		}

		const data = {
			name: e.target.value,
		}

		searchProducts({ data, currentPage: currentPage.current, limit }).then(
			(response) => {
				if (response?.data?.length) {
					const result = response?.data.reduce((acc, item) => {
						acc[item.category_id] = item.count
						return acc
					}, {})

					const sortedResult = SortSearchedList(categoryListSelector, result)
					setSearchedList(sortedResult)
					const categoryAtTop = Object.keys(sortedResult)[0]

					navigate(`/products/${categoryAtTop}`, {
						state: { render: true },
					})
				} else {
					setSearchedList({})
				}
			}
		)
	}, 500)

	//   useEffect(() => {
	//     if (!searchedItem) {
	//       setSearchedList({})
	//     }
	//   }, [searchedItem])

	//getProductList that fetches a list of products based on a given category ID.
	const getProductList = async (categoryID) => {
		try {
			// setIsProductListLoading(true)

			const response = await getCategoryProducts({
				categoryID,
				limit,
				currentPage: 1,
				filterTags,
			})

			// setIsProductListLoading(false)

			if (response?.data?.totalProducts < limit) {
				setHasMorePages(false)
			} else {
				setHasMorePages(true)
			}

			currentPage.current = 1

			dispatch(
				syncProductList({
					id: categoryID,
					element: response?.data,
				})
			)
		} catch (error) {
			// setIsProductListLoading(false)
			toast.error('Something went wrong')
			console.log('Error while getting product list based on id ', error)
		}
	}

	//handleBulkDelete used to delete products in bulk.
	const handleBulkDelete = async () => {
		setIsDeleting(true)

		if (allProductSelected) {
			const selectedProductIds = selectedProductsData.map(
				(product) => product._id
			)

			deleteBulkProduct(categoryID, selectedProductIds)
				.then((res) => {
					setIsDeleting(false)
					setShowDeleteModal(false)
					setSelectedProductsData([])
					toast.success('Products deleted successfully')

					for (const id of selectedProductIds) {
						dispatch(removeProductFromList({ id, categoryID }))

						dispatch(
							updateCategoryItemsCount({ _id: categoryID, type: 'decrement' })
						)
					}
				})
				.then(async () => {
					await getProductList(categoryID)
				})

			setAllProductSelected(false)
		} else {
			const selectedProductIds = selectedProductsData.map(
				(product) => product._id
			)

			deleteBulkProduct(categoryID, selectedProductIds)
				.then((response) => {
					setIsDeleting(false)
					setShowDeleteModal(false)
					setSelectedProductsData([])
					toast.success('Products deleted successfully')

					for (const id of selectedProductIds) {
						dispatch(
							updateCategoryItemsCount({ _id: categoryID, type: 'decrement' })
						)
					}
				})
				.then(async () => {
					await getProductList(categoryID)
				})
		}

		setSelectedProductsData([])
	}
	//handleBulkDelete used to edit prices of products in bulk.
	const handleBulkEditPrice = () => {
		if (allProductSelected) {
			navigate('/products/edit-bulk-price', {
				state: productListSelector[categoryID]?.products,
			})
		} else {
			navigate('/products/edit-bulk-price', { state: selectedProductsData })
		}
	}
	//performs several operations based on the length of selectedProductsData and the product list associated with a specific category ID
	useEffect(() => {
		if (selectedProductsData?.length) {
			setEditButtons(true)
		} else {
			setEditButtons(false)
			setAllProductSelected(false)
		}
		if (
			selectedProductsData?.length === 1 &&
			productListSelector[categoryID]?.products?.length === 1
		) {
			setAllProductSelected(true)
		}
	}, [selectedProductsData])

	//runs whenever the product list for a specific category changes and checks for more products for pagination.
	useEffect(() => {
		if (productListSelector[categoryID]?.products?.length < limit) {
			setHasMorePages(false)
		}

		if (
			selectedProductsData?.length &&
			productListSelector[categoryID]?.products?.length
		) {
			setAllProductSelected(true)
		}
	}, [productListSelector[categoryID]?.products])

	//makes api hit to save changes of reorder in category list and product list.
	const saveChangesHandler = async () => {
		try {
			const categoryPromise = saveChanges?.categoryList?.length
				? reorderList(saveChanges.categoryList, null)
				: null
			const productPromise = saveChanges?.productList?.length
				? reorderList(saveChanges.productList, saveChanges.category_id)
				: null

			const [categoryResponse, productResponse] = await Promise.all([
				categoryPromise,
				productPromise,
			])

			if (categoryResponse) {
				toast.success('Successfully reordered category list')
				setTempCategoryList(null)
			}

			if (productResponse) {
				toast.success('Successfully reordered product list')
				setTempProductList(null)
			}
			if (categoryResponse || productResponse) {
				setSaveChanges({
					show: false,
					category_id: null,
					productList: [],
					categoryList: [],
				})
			}
		} catch (error) {
			console.error('Error while reordering:', error)
			toast.error('Something went wrong, failed to reorder')
		}
	}
	//used to store original productlist & category list for a temporary basis while reordering,to restore original list if discard button is clicked.
	useEffect(() => {
		if (saveChanges?.show && tempProductList === null) {
			setTempProductList(productListSelector[categoryID])
		}
		if (saveChanges?.show && tempCategoryList === null) {
			setTempCategoryList(categoryListSelector)
		}
	}, [saveChanges?.show, saveChanges?.productList, saveChanges?.categoryList])

	//discard reorder changes made for categorylist and product list.
	const discardChangesHandler = () => {
		setSaveChanges({
			show: false,

			category_id: null,
			productList: [],
			categoryList: [],
		})
		if (saveChanges?.productList?.length) {
			dispatch(
				syncProductList({
					id: saveChanges?.category_id,
					element: tempProductList,
				})
			)
		}
		if (saveChanges?.categoryList?.length) {
			dispatch(syncCategoryList(tempCategoryList))
		}
		setTempCategoryList(null)
		setTempProductList(null)
	}

	return (
		<>
			{showDeleteModal && (
				<BulkDeleteProducts
					openModal={showDeleteModal}
					setOpenModal={setShowDeleteModal}
					deleteHandler={handleBulkDelete}
					setIsDeleting={setIsDeleting}
					isDeleting={isDeleting}
					setSelectedProductsData={setSelectedProductsData}
				/>
			)}

			<div className='flex gap-8 w-full justify-between items-center h-24 px-4 bg-slate-200'>
				<SearchBar
					currentPage={currentPage}
					searchedItem={searchedItem}
					searchHandler={searchHandler}
					setSearchedItem={setSearchedItem}
					setSearchedList={setSearchedList}
				/>
				{saveChanges?.show ? (
					<div className='flex gap-1 flex-nowrap h-full items-center'>
						<Button onClick={saveChangesHandler}>Save Changes</Button>

						<Button onClick={discardChangesHandler} outline>
							Discard Changes
						</Button>
					</div>
				) : editButtons ? (
					<div className='flex gap-1 flex-nowrap h-full items-center'>
						{/* <EditButtons /> */}

						<Button onClick={handleBulkEditPrice}>Bulk Edit Price</Button>

						<Button
							onClick={() => {
								setShowDeleteModal(true)
							}}
						>
							Bulk Delete
						</Button>
					</div>
				) : (
					<div className='flex gap-x-2 flex-nowrap h-full items-center bg-slate-200'>
						<ExcelExport currentPage={currentPage} />

						<a
							className=''
							href={`${
								categoryID
									? import.meta.env.VITE_WEBSITE_URL +
									  '/categories/' +
									  categoryID
									: ''
							}`}
							onClick={(e) => !categoryID && e.preventDefault()}
							target={categoryID ? '_blank' : null}
						>
							<Button className='text-nowrap w-[180px]' disabled={!categoryID}>
								<span className='flex items-center gap-1  '>
									Preview Collection
									<FaEye size={16} />
								</span>
							</Button>
						</a>

						<Dropdown
							className='z-20 '
							dismissOnClick={false}
							label={<span className='text-nowrap'>Add Collection</span>}
						>
							<Dropdown.Item className='hover:cursor-pointer border-b'>
								<Link to={`/products/${categoryID}/Add-collection`}>
									Single Collection
								</Link>
							</Dropdown.Item>

							<Link to={`/products/${categoryID}/Add-bulk-collection`}>
								<Dropdown.Item className='hover:cursor-pointer '>
									Bulk Collection
								</Dropdown.Item>
							</Link>
						</Dropdown>

						<Dropdown
							className='z-20'
							label={<span className='text-nowrap'>Add Product</span>}
							dismissOnClick={false}
							disabled={categoryID ? false : true}
						>
							<Link to={`/products/${categoryID}/add-product`}>
								<Dropdown.Item className='hover:cursor-pointer border-b'>
									Single Product
								</Dropdown.Item>
							</Link>

							<Link to={`/products/${categoryID}/add-bulk-product`}>
								<Dropdown.Item className='hover:cursor-pointer '>
									Bulk Products
								</Dropdown.Item>
							</Link>
						</Dropdown>
					</div>
				)}
			</div>
		</>
	)
}
