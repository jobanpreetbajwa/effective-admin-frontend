import { useState, useRef } from 'react'

import TopBar from './topBar'
import CategorySection from './categorySection'
import { PRODUCTS_FETCH_LIMIT } from '../constant/products/constant'
import { useEffect } from 'react'

export default function ContentSection() {
	const [searchedList, setSearchedList] = useState(null)
	//searchedItem will store the searched text in the search bar.
	const [searchedItem, setSearchedItem] = useState('')

	// saveChanges will store the changes made in the products and categories when Reordering.
	const [saveChanges, setSaveChanges] = useState({
		show: false,
		productList: [],
		categoryList: [],
		category_id: null,
	})

	//hasMorePages will store the state of the pagination.
	const [hasMorePages, setHasMorePages] = useState(false)

	// const [deletedProductIds, setDeletedProductIds] = useState([])
	const [allProductSelected, setAllProductSelected] = useState(false)

	//filterTags will store the tags selected in the filter.
	const [filterTags, setFilterTags] = useState([])

	//allFilterTags will store the state of the All Selected Items.
	const [allFilterTags, setAllFilterTags] = useState(false)

	const limit = PRODUCTS_FETCH_LIMIT
	const currentPage = useRef(1)

	//selectedProductsData will store the selected products data.
	const [selectedProductsData, setSelectedProductsData] = useState([])

	return (
		<div className='flex flex-col items-center w-full'>
			<div className='w-full grid grid-cols-1 xl:grid-cols-1 dark:bg-gray-900'>
				<TopBar
					limit={limit}
					filterTags={filterTags}
					saveChanges={saveChanges}
					currentPage={currentPage}
					searchedItem={searchedItem}
					setSaveChanges={setSaveChanges}
					setHasMorePages={setHasMorePages}
					setSearchedList={setSearchedList}
					setSearchedItem={setSearchedItem}
					allProductSelected={allProductSelected}
					selectedProductsData={selectedProductsData}
					setAllProductSelected={setAllProductSelected}
					setSelectedProductsData={setSelectedProductsData}
				/>
				<CategorySection
					limit={limit}
					filterTags={filterTags}
					currentPage={currentPage}
					searchedItem={searchedItem}
					searchedList={searchedList}
					hasMorePages={hasMorePages}
					setFilterTags={setFilterTags}
					allFilterTags={allFilterTags}
					setSaveChanges={setSaveChanges}
					setSearchedList={setSearchedList}
					setHasMorePages={setHasMorePages}
					setAllFilterTags={setAllFilterTags}
					allProductSelected={allProductSelected}
					selectedProductsData={selectedProductsData}
					setAllProductSelected={setAllProductSelected}
					setSelectedProductsData={setSelectedProductsData}
				/>
			</div>
		</div>
	)
}
