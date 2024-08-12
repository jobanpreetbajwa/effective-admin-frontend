import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox, Table, Spinner } from 'flowbite-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import ProductTableRow from './productTableRow'
import { fetchMoreProducts } from '../../api/function'
import FilterProducts from './components/filterProducts'
import InfiniteScroll from 'react-infinite-scroll-component'
import ProductTableBodyShimmer from '../shimmer/productTableBodyShimmer'

import {
	syncProductList,
	reOrderProductList,
} from '../../store/slices/currentProductList'

const ProductSection = ({
	limit,
	filterTags,
	categoryID,
	currentPage,
	searchedItem,
	hasMorePages,
	setFilterTags,
	allFilterTags,
	setSaveChanges,
	setHasMorePages,
	setAllFilterTags,
	allProductSelected,
	isFetchingProducts,
	isProductListLoading,
	selectedProductsData,
	setAllProductSelected,
	setIsFetchingProducts,
	setSelectedProductsData,
}) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const productListSelector = useSelector((state) => state.currentProductList)

	const categoryListSelector = useSelector((state) => state.categoryList)

	const currentCategory = categoryListSelector?.find(
		(item) => categoryID === item?._id
	)

	const [isDragging, setIsDragging] = useState(false)

	//if the filterTags array length is equal to the current category's subcategories length, set allFilterTags to true
	useEffect(() => {
		if (filterTags?.length === currentCategory?.subcategories?.length) {
			setAllFilterTags(true)
		} else {
			setAllFilterTags(false)
		}
	}, [filterTags, currentCategory])

	//allProductsHandler function handles the selection of all products.
	const allProductsHandler = (e) => {
		if (e.target.checked) {
			setSelectedProductsData(productListSelector[categoryID]?.products || [])
		} else {
			setSelectedProductsData([])
		}
	}

	useEffect(() => {
		if (allProductSelected) {
			setSelectedProductsData(productListSelector?.[categoryID]?.products || [])
		}
	}, [allProductSelected])

	useEffect(() => {
		if (
			productListSelector[categoryID]?.products?.length ===
				selectedProductsData?.length &&
			!allProductSelected
		) {
			console.log('All products selected')
			setAllProductSelected(true)
		}
	}, [selectedProductsData])

	//moveProduct function facilitates the reordering of products within a category list, updating the order of items based on drag-and-drop interactions and reflecting the changes in the application's state
	const moveProduct = async (result) => {
		if (!result || !result.destination) return

		const { source, destination } = result

		const items = Array.from(productListSelector[categoryID]?.products)
		const [reorderedItem] = items.splice(source.index, 1)
		items.splice(destination.index, 0, reorderedItem)

		dispatch(reOrderProductList({ id: categoryID, element: items }))
		const data = items.map((item) => {
			return item?._id
		})

		setSaveChanges((prev) => {
			if (
				source.index === destination.index &&
				!prev?.productList?.length &&
				!prev?.categoryList?.length
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

				categoryList: prev?.categoryList ? prev?.categoryList : [],
				productList: data,
				category_id: categoryID ? categoryID : null,
			}
		})
	}

	const isListAvailable =
		productListSelector[categoryID] &&
		productListSelector[categoryID]?.products?.length
			? true
			: false

	// getItemStyle function sets the style of the draggable product item based on whether it is being dragged or not
	const getItemStyle = (isDragging, draggableStyle) => ({
		userSelect: 'none',
		background: isDragging ? 'lightgray' : '',
		tableLayout: 'fixed',
		...draggableStyle,
	})

	// fetchNextProducts function fetches the next set of products from the backend on trigger of scroll, updating the application's state with the new data and reflecting the changes in the UI
	const fetchNextProducts = async () => {
		setIsFetchingProducts(true)

		fetchMoreProducts({
			categoryID,
			limit,
			currentPage: currentPage.current + 1,
			filterTags,
			searchedItem,
		})
			.then((response) => {
				currentPage.current = currentPage.current + 1

				if (!response?.data?.products?.length) {
					setHasMorePages(false)
					setIsFetchingProducts(false)
				} else if (response?.data?.totalProducts < limit) {
					currentPage.current = currentPage.current + 1
					setHasMorePages(false)
					setIsFetchingProducts(false)
				} else {
					setHasMorePages(true)
				}

				const element = {
					products: [
						...productListSelector[categoryID]?.products,
						...response?.data?.products,
					],
				}

				dispatch(
					syncProductList({
						id: categoryID,
						element,
					})
				)
			})
			.finally(() => {
				setIsFetchingProducts(false)
			})
	}

	return (
		<div className='relative flex flex-col gap-4 w-full'>
			<DragDropContext
				onDragStart={() => {
					setIsDragging(true)
					setHasMorePages(false)
					setSaveChanges((prev) => {
						return {
							show: true,

							categoryList: prev?.categoryList ? prev?.categoryList : [],
							productList: [],
							category_id: categoryID ? categoryID : null,
						}
					})
				}}
				onDragEnd={(e) => {
					moveProduct(e)
					setHasMorePages(true)
					setIsDragging(false)
				}}
			>
				<div
					className='relative flex flex-col w-full h-full max-h-[84vh] overflow-y-scroll'
					id='scrollableProductDiv'
				>
					<Table hoverable striped className='w-full h-full'>
						<Table.Head>
							<Table.HeadCell className='col-span-1 pr-0'>
								<div className='flex items-center gap-6'>
									<Checkbox
										value=''
										type='checkbox'
										id='default-checkbox'
										onChange={allProductsHandler}
										checked={allProductSelected}
										className='disabled:cursor-not-allowed'
										disabled={
											isFetchingProducts ||
											productListSelector[categoryID]?.products?.length === 0
										}
									/>
									<span className='text-nowrap'>Sr. No.</span>
								</div>
							</Table.HeadCell>
							<Table.HeadCell>Product</Table.HeadCell>
							{/* <Table.HeadCell>
								<span className='relative flex gap-2 items-center'>
									Product ID
									<Clipboard
										disabled={
											productListSelector[categoryID]?.products?.length === 0
										}
										className='w-5 h-8 bg-cyan-700 disabled:opacity-50 hover:bg-cyan-800 disabled:cursor-not-allowed'
										valueToCopy={productListSelector[categoryID]?.products
											?.map((item) => item?.unique_id)
											.join('\n')}
										label={<FaClipboardList />}
									/>
								</span>
							</Table.HeadCell> */}
							<Table.HeadCell>STATUS</Table.HeadCell>

							<Table.HeadCell>INVENTORY</Table.HeadCell>
							<Table.HeadCell>
								<div className='flex justify-between items-center gap-4'>
									<span>PRICE</span>

									<div className='flex items-center justify-end  mr-1'>
										<FilterProducts
											filterTags={filterTags}
											searchedItem={searchedItem}
											allFilterTags={allFilterTags}
											setFilterTags={setFilterTags}
											setAllFilterTags={setAllFilterTags}
											tags={currentCategory?.subcategories}
										/>
									</div>
								</div>
							</Table.HeadCell>
						</Table.Head>

						<Droppable droppableId='product-list'>
							{(provided) => (
								<Table.Body
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									{!isProductListLoading ? (
										isListAvailable ? (
											productListSelector[categoryID]?.products.map(
												(item, index) => (
													<Draggable
														key={item._id}
														draggableId={item._id}
														index={index}
														isDragDisabled={
															productListSelector[categoryID]?.products
																?.length === 1 || !!searchedItem
														}
													>
														{(provided, snapshot) => (
															<Table.Row
																className={`hover:cursor-pointer ${
																	snapshot.isDragging
																		? 'flex justify-between items-center'
																		: 'hover:bg-gray-100'
																}`}
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																style={{
																	...getItemStyle(
																		snapshot.isDragging,
																		provided.draggableProps.style
																	),
																}}
																onClick={(e) => {
																	e.stopPropagation()

																	navigate(
																		`/products/${categoryID}/details/${item?._id}`
																	)
																}}
															>
																<ProductTableRow
																	item={item}
																	index={index}
																	allProductSelected={allProductSelected}
																	setAllProductSelected={setAllProductSelected}
																	setSelectedProductsData={
																		setSelectedProductsData
																	}
																	selectedProductsData={selectedProductsData}
																/>
															</Table.Row>
														)}
													</Draggable>
												)
											)
										) : (
											<Table.Row>
												<Table.Cell colSpan={6} className='text-center'>
													<span className='text-rose-500 p-4 text-lg'>
														{searchedItem
															? 'No Products Found'
															: !isFetchingProducts && 'No Products Available'}
													</span>
												</Table.Cell>
											</Table.Row>
										)
									) : (
										<ProductTableBodyShimmer />
									)}
									{provided.placeholder}
								</Table.Body>
							)}
						</Droppable>
					</Table>

					<InfiniteScroll
						//This is important field to render the next data it needs to know the length of the data
						dataLength={limit * currentPage.current}
						hasMore={hasMorePages}
						next={fetchNextProducts}
						scrollableTarget='scrollableProductDiv'
						loader={
							isFetchingProducts && (
								<div className='mt-2 flex justify-center items-center'>
									<Spinner aria-label='Default status example' />
								</div>
							)
						}
						endMessage={
							!isDragging &&
							productListSelector[categoryID]?.products?.length ? (
								<p className='mt-2 text-center'>
									<b>End Of Product List</b>
								</p>
							) : null
						}
					/>
				</div>
			</DragDropContext>
		</div>
	)
}

export default ProductSection
