import List from './list'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CollectionList from '../shimmer/collectionList'
import { useDispatch, useSelector } from 'react-redux'
import { syncCategoryList } from '../../store/slices/categoryList'
import {
  clearProductList,
  syncProductList,
} from '../../store/slices/currentProductList'
import ProductSection from './productSection'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import EditCategory from './components/editCollection/editCategory'
import { getCategory, getCategoryProducts } from '../../api/function'

import ProductSearchList from '../shimmer/productSearchList'
export default function CategorySection({
  isSearchListLoading,
  allFilterTags,
  setAllFilterTags,
  currentPage,
  searchedItem,
  setSearchedItem,
  searchedList,
  setSearchedList,
  toggleProductState,
  hasMorePages,
  setHasMorePages,
  allProductSelected,
  setAllProductSelected,
  selectedProductsData,
  setSelectedProductsData,
  filterTags,
  setFilterTags,
  setSaveChanges,

  limit,
}) {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const categoryListSelector = useSelector((state) => state.categoryList)
  const productListSelector = useSelector((state) => state.currentProductList)

  const [isDragging, setIsDragging] = useState(false)
  const [objectToEdit, setObjectToEdit] = useState({})
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
        console.log('fetching category list')
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
  }, [params?.categoryID, searchedItem, filterTags])

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

      <div className={`relative flex gap-2 w-full p-3 `}>
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
                className='flex flex-col min-w-64 max-h-[88vh] overflow-y-auto pb-10 rounded-lg '
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
                              index={index}
                              currentPage={currentPage}
                              searchedItem={searchedItem}
                              setSearchedItem={setSearchedItem}
                              editCategory={editCategory}
                              setObjectToEdit={setObjectToEdit}
                              setEditCategory={setEditCategory}
                              selectedCategoryId={params.categoryID}
                              setEditCategoryData={setEditCategoryData}
                              setAllProductSelected={setAllProductSelected}
                              setIsFetchingProducts={setIsFetchingProducts}
                              setSelectedProductsData={setSelectedProductsData}
                              setFilterTags={setFilterTags}
                              searchedList={searchedList}
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
            currentPage={currentPage}
            searchedItem={searchedItem}
            objectToEdit={objectToEdit}
            hasMorePages={hasMorePages}
            categoryID={params.categoryID}
            setObjectToEdit={setObjectToEdit}
            setHasMorePages={setHasMorePages}
            productState={toggleProductState}
            allProductSelected={allProductSelected}
            isFetchingProducts={isFetchingProducts}
            isProductListLoading={isProductListLoading}
            selectedProductsData={selectedProductsData}
            setAllProductSelected={setAllProductSelected}
            setIsFetchingProducts={setIsFetchingProducts}
            setSelectedProductsData={setSelectedProductsData}
            filterTags={filterTags}
            setFilterTags={setFilterTags}
            allFilterTags={allFilterTags}
            setAllFilterTags={setAllFilterTags}
            setSaveChanges={setSaveChanges}
          />
        ) : null}
      </div>
    </>
  )
}
