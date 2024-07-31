import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import List from './list'
import ProductSection from './productSection'
import CollectionList from '../shimmer/collectionList'
import { syncCategoryList } from '../../store/slices/categoryList'
import EditCategory from './components/editCollection/editCategory'
import { getCategory, getCategoryProducts } from '../../api/function'
import {
	clearProductList,
	syncProductList,
} from '../../store/slices/currentProductList'

export default function CategorySection({
	limit,
	filterTags,
	currentPage,
	searchedItem,
	searchedList,
	hasMorePages,
	setFilterTags,
	allFilterTags,
	setSaveChanges,
	setSearchedList,
	setHasMorePages,
	setAllFilterTags,
	allProductSelected,
	selectedProductsData,
	setAllProductSelected,
	setSelectedProductsData,
}) {
	const params = useParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { state } = useLocation()

	const categoryListSelector = useSelector((state) => state.categoryList)
	const productListSelector = useSelector((state) => state.currentProductList)

	const [isDragging, setIsDragging] = useState(false)
	const [editCategory, setEditCategory] = useState(false)
	const [editCategoryData, setEditCategoryData] = useState(null)
	const [isFetchingProducts, setIsFetchingProducts] = useState(false)
	const [isProductListLoading, setIsProductListLoading] = useState(false)

	const [isCategoryListLoading, setIsCategoryListLoading] = useState(false)

	//fetch category list based on first categoryID
	useEffect(() => {
		const getCategoryList = async () => {
			try {
				setIsCategoryListLoading(true)

				const response = await getCategory()

				setIsCategoryListLoading(false)
				const responseData = response?.data

				if (responseData?.categories) {
					dispatch(syncCategoryList(responseData?.categories))
					navigate('/products/' + responseData?.categories[0]?._id)
				} else {
					navigate('/products/')
				}
			} catch (error) {
				setIsCategoryListLoading(false)

				console.log('Error while getting category list ', error)
			}
		}
		if (categoryListSelector?.length && !params?.categoryID) {
			navigate('/products/' + categoryListSelector[0]?._id)
		} else if (!categoryListSelector?.length || !params?.categoryID) {
			getCategoryList()
		}
	}, [])

	//fetch product list based on first categoryID
	useEffect(() => {
		if (!categoryListSelector?.length) {
			dispatch(clearProductList())

			navigate('/products/')
		} else {
			if (categoryListSelector.length === 1 && !searchedList) {
				navigate('/products/' + categoryListSelector[0]?._id)
			}
		}
	}, [categoryListSelector])

	//fetch product list based on categoryID selected
	useEffect(() => {
		const getProductList = async (categoryID) => {
			try {
				setIsFetchingProducts(true)
				setIsProductListLoading(true)

				const response = await getCategoryProducts({
					categoryID,
					limit,
					currentPage: currentPage.current,
					filterTags,
					searchedItem,
				})

				setIsProductListLoading(false)

				if (!response?.data?.products?.length) {
					setHasMorePages(false)
				} else if (response?.data?.totalProducts < limit) {
					setHasMorePages(false)
				} else {
					setHasMorePages(true)
				}

				dispatch(
					syncProductList({
						id: categoryID,
						element: response?.data,
					})
				)
			} catch (error) {
				setIsProductListLoading(false)

				console.log('Error while getting product list based on id ', error)
			} finally {
				setIsFetchingProducts(false)
			}
		}

		if (params?.categoryID) {
			if (
				Object.keys(productListSelector).length &&
				productListSelector?.[params.categoryID]
			) {
				if (!searchedItem?.length) {
					currentPage.current = 1
					dispatch(clearProductList())
					getProductList(params?.categoryID)
				} else {
					getProductList(params?.categoryID)
				}
			} else {
				dispatch(clearProductList())
				setSaveChanges({ show: false, data: [], category_id: null })
				getProductList(params?.categoryID)
			}
		} else if (categoryListSelector.length) {
			navigate('/products/' + categoryListSelector[0]?._id)
		}
	}, [params?.categoryID, filterTags, state])

	const dragStart = () => {
		setIsDragging(true)
	}

	const dragEnd = () => {
		setIsDragging(false)
	}

	//moveProduct function facilitates the reordering of category list , updating the order of items based on drag-and-drop interactions and reflecting the changes in the application's state
	const moveProduct = async (result) => {
		if (!result || !result.destination) return

		const { source, destination } = result
		const copyListItems = [...categoryListSelector]
		const [removedItem] = copyListItems.splice(source.index, 1)

		copyListItems.splice(destination.index, 0, removedItem)

		dispatch(syncCategoryList(copyListItems))
		const data = copyListItems.map((item) => {
			return item?._id
		})

		setSaveChanges((prev) => {
			if (
				source.index === destination.index &&
				!prev?.productList?.length &&
				!prev?.categoryList.length
			) {
				return {
					show: false,
					categoryList: [],
					productList: [],
					category_id: null,
				}
			}
			return {
				show: true,
				categoryList: data,
				productList: prev?.productList ? prev?.productList : [],
				category_id: prev?.category_id ? prev?.category_id : null,
			}
		})
	}

	const shouldRenderProductSection = searchedList
		? Object.keys(searchedList)?.length && categoryListSelector?.length
		: categoryListSelector.length

	const isSearchEmpty =
		searchedItem && (searchedList ? !Object.keys(searchedList)?.length : false)

	if (isSearchEmpty) {
		return (
			<div className='relative w-full  h-full z-10 text-rose-500'>
				<div className='absolute top-80 flex justify-center items-center w-full  '>
					<p className='bg-slate-200 rounded p-3 w-fit'>
						No product found in any category!
					</p>
				</div>
			</div>
		)
	}
	return (
		<>
			{editCategory && (
				<div
					className='fixed left-0 h-full top-0 w-full z-10'
					onClick={() => setEditCategory(false)}
				>
					<EditCategory
						item={editCategoryData}
						searchedList={searchedList}
						setSearchedList={setSearchedList}
						setEditCategory={setEditCategory}
					/>
				</div>
			)}

			<div className={`relative flex gap-2 w-full p-3 pb-0`}>
				<DragDropContext
					onDragEnd={moveProduct}
					onDragStart={() =>
						setSaveChanges((prev) => {
							return {
								show: true,
								categoryList: [],
								productList: prev?.productList ? prev?.productList : [],
								category_id: prev?.category_id ? prev?.category_id : null,
							}
						})
					}
				>
					<Droppable droppableId='product-list'>
						{(provided) => (
							<div
								className='flex flex-col min-w-64 max-h-[81vh] overflow-auto pb-10 rounded-lg'
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{categoryListSelector && !isCategoryListLoading ? (
									categoryListSelector.length ? (
										categoryListSelector.map((item, index) => (
											<Draggable
												index={index}
												key={item?._id}
												draggableId={item?._id}
												isDragDisabled={searchedItem ? true : false}
											>
												{(provided) => (
													<div
														onDragEnd={dragEnd}
														draggable={!isDragging}
														onDragStart={dragStart}
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<List
															key={index}
															item={item}
															currentPage={currentPage}
															searchedList={searchedList}
															searchedItem={searchedItem}
															editCategory={editCategory}
															setFilterTags={setFilterTags}
															setSearchedList={setSearchedList}
															setEditCategory={setEditCategory}
															selectedCategoryId={params.categoryID}
															setEditCategoryData={setEditCategoryData}
															setAllProductSelected={setAllProductSelected}
															setIsFetchingProducts={setIsFetchingProducts}
															setSelectedProductsData={setSelectedProductsData}
														/>
													</div>
												)}
											</Draggable>
										))
									) : (
										<div className='absolute top-80 flex w-full h-full z-10 justify-center items-center text-rose-500 '>
											<p className='p-3 bg-slate-200 rounded'>
												No collection and product list available at this moment!
											</p>
										</div>
									)
								) : (
									<CollectionList />
								)}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>

				{shouldRenderProductSection ? (
					<ProductSection
						limit={limit}
						filterTags={filterTags}
						currentPage={currentPage}
						searchedItem={searchedItem}
						hasMorePages={hasMorePages}
						setFilterTags={setFilterTags}
						allFilterTags={allFilterTags}
						categoryID={params.categoryID}
						setSaveChanges={setSaveChanges}
						setHasMorePages={setHasMorePages}
						setAllFilterTags={setAllFilterTags}
						allProductSelected={allProductSelected}
						isFetchingProducts={isFetchingProducts}
						isProductListLoading={isProductListLoading}
						selectedProductsData={selectedProductsData}
						setAllProductSelected={setAllProductSelected}
						setIsFetchingProducts={setIsFetchingProducts}
						setSelectedProductsData={setSelectedProductsData}
					/>
				) : null}
			</div>
		</>
	)
}
