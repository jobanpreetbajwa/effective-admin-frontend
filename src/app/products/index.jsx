import TopBar from './topBar'
import { useState, useRef } from 'react'
import CategorySection from './categorySection'

export default function ContentSection() {
  const [productSelected, setProductSelected] = useState(false)

  const [searchedList, setSearchedList] = useState(null)
  const [isSearchListLoading, setIsSearchListLoading] = useState(false)
  //searchedItem will store the searched text in the search bar.
  const [searchedItem, setSearchedItem] = useState('')

  // saveChanges will store the changes made in the products and categories when Reordering.
  const [saveChanges, setSaveChanges] = useState({
    show: false,
    productList: [],
    categoryList: [],
    category_id: null,
  })

  //toggleProductState will toggle all product selected state in product list.
  const toggleProductState = (selected) => {
    setProductSelected(selected)
  }

  //hasMorePages will store the state of the pagination.
  const [hasMorePages, setHasMorePages] = useState(false)

  // const [deletedProductIds, setDeletedProductIds] = useState([])
  const [allProductSelected, setAllProductSelected] = useState(false)

  //filterTags will store the tags selected in the filter.
  const [filterTags, setFilterTags] = useState([])

  //allFilterTags will store the state of the All Selected Items.
  const [allFilterTags, setAllFilterTags] = useState(false)

  const limit = 20
  const currentPage = useRef(1)

  //selectedProductsData will store the selected products data.
  const [selectedProductsData, setSelectedProductsData] = useState([])

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='w-full grid grid-cols-1 xl:grid-cols-1 dark:bg-gray-900'>
        <TopBar
          setIsSearchListLoading={setIsSearchListLoading}
          limit={limit}
          filterTags={filterTags}
          currentPage={currentPage}
          searchedItem={searchedItem}
          setSearchedItem={setSearchedItem}
          allProductSelected={allProductSelected}
          setAllProductSelected={setAllProductSelected}
          selectedProductsData={selectedProductsData}
          setSelectedProductsData={setSelectedProductsData}
          setHasMorePages={setHasMorePages}
          productSelected={productSelected}
          setProductSelected={setProductSelected}
          setSearchedList={setSearchedList}
          setSaveChanges={setSaveChanges}
          saveChanges={saveChanges}
        />
        <CategorySection
          isSearchListLoading={isSearchListLoading}
          currentPage={currentPage}
          allProductSelected={allProductSelected}
          setAllProductSelected={setAllProductSelected}
          selectedProductsData={selectedProductsData}
          setSelectedProductsData={setSelectedProductsData}
          searchedItem={searchedItem}
          setSearchedItem={setSearchedItem}
          searchedList={searchedList}
          setSearchedList={setSearchedList}
          hasMorePages={hasMorePages}
          setHasMorePages={setHasMorePages}
          toggleProductState={toggleProductState}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          allFilterTags={allFilterTags}
          setAllFilterTags={setAllFilterTags}
          setSaveChanges={setSaveChanges}
          limit={limit}
        />
      </div>
    </div>
  )
}
