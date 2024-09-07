import makeApiCall from './BaseApi'

const { VITE_BASE_URL } = import.meta.env

let headers = {
	'Content-Type': 'application/json',
}

const adminLogIn = async (data) => {
	const url = `${VITE_BASE_URL}/admin/login`
	return await makeApiCall('POST', url, data, headers)
}

const getCategory = async () => {
	const url = `${VITE_BASE_URL}/category/get/`
	const cache = true

	return await makeApiCall('GET', url, null, headers, cache)
}

const getCategoryProducts = async ({
	categoryID,
	limit,
	currentPage,
	filterTags,
	searchedItem,
}) => {
	let url = ''
	let method = ''
	const data = filterTags?.length
		? {
				subcategory: filterTags,
				product_name: searchedItem,
		  }
		: {
				product_name: searchedItem,
		  }

	if (limit === undefined && currentPage === undefined) {
		url = `${VITE_BASE_URL}/category/get/${categoryID}`
		method = 'GET'
	} else {
		url = `${VITE_BASE_URL}/category/get/${categoryID}/${limit}/${currentPage}`

		method = 'POST'
	}

	return await makeApiCall(method, url, data, headers)
}

const searchProductsByCategory = async ({ categoryID, data }) => {
	const url = `${VITE_BASE_URL}/product/search_by_category/${categoryID}`

	return await makeApiCall('POST', url, data)
}

export const searchProducts = async ({ data, limit, currentPage }) => {
	const url = `${VITE_BASE_URL}/product/search`

	return await makeApiCall('POST', url, data)
}

const toggleProductStatus = async ({ id, state }) => {
	const url = `${VITE_BASE_URL}/product/${id}/${state ? 1 : 0}`
	return await makeApiCall('PATCH', url, headers)
}

const reorderCategoryList = async (data) => {
	const url = `${VITE_BASE_URL}/category/reorder`
	return await makeApiCall('POST', url, data, headers)
}

const reorderProductList = async (data) => {
	const url = `${VITE_BASE_URL}/category/reorder-product-category`
	return await makeApiCall('POST', url, data, headers)
}

const deleteCollection = async (id) => {
	const url = `${VITE_BASE_URL}/category/delete/${id}`
	return await makeApiCall('DELETE', url, headers)
}

const deleteProduct = async ({ categoryID, productID }) => {
	const url = `${VITE_BASE_URL}/product/delete/${categoryID}/${productID}`
	return await makeApiCall('DELETE', url, null, headers)
}

const addBulkCollection = async (data) => {
	const url = `${VITE_BASE_URL}/category/add-bulk`
	return await makeApiCall('POST', url, data, headers)
}

const addBulkProduct = async ({ data, categoryID }) => {
	const url = `${VITE_BASE_URL}/product/add-bulk/${categoryID}`
	return await makeApiCall('POST', url, data, headers)
}

const addSingleCollection = async (data) => {
	const url = `${VITE_BASE_URL}/category/add`
	return await makeApiCall('POST', url, data, headers)
}

const addSingleProduct = async ({ path, data, method }) => {
	const url = `${VITE_BASE_URL}${path}`

	return await makeApiCall(method, url, data, headers)
}

const editCollection = async ({ data, id }) => {
	const url = `${VITE_BASE_URL}/category/update/${id}`
	return await makeApiCall('PUT', url, data, headers)
}

const getOrderList = async ({ limit, currentPage, data }) => {
	const url = `${VITE_BASE_URL}/admin/get-order/${limit}/${currentPage}`
	return await makeApiCall('POST', url, data, headers)
}

const searchOrders = async (data) => {
	const url = `${VITE_BASE_URL}/admin/search-order`
	return await makeApiCall('POST', url, data, headers)
}

const updateOrderStatus = async ({ orderID, data }) => {
	const url = `${VITE_BASE_URL}/admin/update-status/${orderID}`
	return await makeApiCall('PUT', url, data, headers)
}

const getOrderSummary = async ({ orderID, showPrice }) => {
	const url = `${VITE_BASE_URL}/admin/summary/${orderID}/${showPrice}`
	return await makeApiCall('PATCH', url, null, headers)
}

const getOrderById = async (orderID) => {
	const url = `${VITE_BASE_URL}/admin/get-orderById/${orderID}`
	return await makeApiCall('GET', url, null, headers)
}

const addAdminNote = async ({ orderID, data }) => {
	const url = `${VITE_BASE_URL}/admin/add-note/${orderID}`
	return await makeApiCall('PATCH', url, data, null, headers)
}

const addAdminNoteForBulkOrders = async ({ data }) => {
	const url = `${VITE_BASE_URL}/admin/update-bulk-orders`
	return await makeApiCall('POST', url, data, null, headers)
}
export const singleOrderStatus = async ({ data, orderID }) => {
	const url = `${VITE_BASE_URL}/admin/add-cancellation-reason/${orderID}`
	return await makeApiCall('PATCH', url, data, null, headers)
}

export const changeBulkOrderStatus = async (data) => {
	const url = `${VITE_BASE_URL}/admin/update-bulk-orders`
	return await makeApiCall('POST', url, data, null, headers)
}

const uploadMultipleImages = async ({ data }) => {
	const headers = {
		'Content-Type': 'multipart/form-data',
	}

	console.log('data', data.get('file'))
	const url = `${VITE_BASE_URL}/image/upload`
	return await makeApiCall('POST', url, data, headers)
}

const addTagsInCategory = async ({ categoryID, data }) => {
	const url = `${VITE_BASE_URL}/subcategory/add/${categoryID}`
	return await makeApiCall('POST', url, data, headers)
}

const getProductData = async (productID) => {
	const url = `${VITE_BASE_URL}/product/${productID}`
	return await makeApiCall('GET', url, null, headers)
}

const getCategoryTags = async (categoryID) => {
	const url = `${VITE_BASE_URL}/category/subcategory/${categoryID}`
	return await makeApiCall('GET', url, null, headers)
}

const deleteImages = async (img_ids) => {
	const data = {
		img_ids: img_ids,
	}

	const url = `${VITE_BASE_URL}/image/delete`
	return await makeApiCall('DELETE', url, data, headers)
}

const getThemePreview = async () => {
	const url = `${VITE_BASE_URL}/theme-preview`
	return await makeApiCall('GET', url, null, headers)
}
const deleteThemePreview = async ({ id }) => {
	const url = `${VITE_BASE_URL}/theme-preview/${id}`
	return await makeApiCall('DELETE', url, null, headers)
}

const addThemePreview = async (data) => {
	const url = `${VITE_BASE_URL}/theme-preview/add`
	return await makeApiCall('POST', url, data, headers)
}

const reorderThemeList = async (data) => {
	const url = `${VITE_BASE_URL}/theme-preview/reorder`
	return await makeApiCall('POST', url, data, headers)
}

const hideUnhideThemePreview = async ({ id, isHide }) => {
	const url = `${VITE_BASE_URL}/theme-preview/${id}/${isHide ? 1 : 0}`
	return await makeApiCall('GET', url, null, headers)
}

const getThemePreviewbyId = async ({ id }) => {
	const url = `${VITE_BASE_URL}/theme-preview/${id}`
	return await makeApiCall('PUT', url, null, headers)
}

const deleteBulkProduct = async (categoryID, product_ids) => {
	const data = {
		product_ids,
	}

	const url = `${VITE_BASE_URL}/product/delete-bulk/${categoryID}`
	return await makeApiCall('DELETE', url, data, headers)
}

const getGlobalPricingSwitchAPI = async () => {
	const url = `${VITE_BASE_URL}/admin/summary`

	return await makeApiCall('GET', url)
}

const setGlobalPricingSwitchAPI = async (flag) => {
	const url = `${VITE_BASE_URL}/admin/summary/${flag}`
	return await makeApiCall('POST', url)
}

const fetchMoreProducts = async ({
	categoryID,
	limit,
	currentPage,
	filterTags,
	searchedItem,
}) => {
	const data = {
		subcategory: filterTags,
		product_name: searchedItem ? searchedItem : '',
	}

	const url = `${VITE_BASE_URL}/category/get/${categoryID}/${limit}/${currentPage}`
	return await makeApiCall('POST', url, data, headers)
}

const editThemePreview = async (data, id) => {
	const url = `${VITE_BASE_URL}/theme-preview/${id}`
	return await makeApiCall('PUT', url, data, headers)
}

const getReportData = async (data, date) => {
	const url = `${VITE_BASE_URL}/admin/report-section/${date}/${data}`
	return await makeApiCall('GET', url, headers)
}

const getStatsData = async (date) => {
	const url = `${VITE_BASE_URL}/admin/total-summary/${date}`

	return await makeApiCall('GET', url, headers)
}

const getProductQuantityStats = async ({ limit, currentPage }) => {
	const url = `${VITE_BASE_URL}/admin/pending-order-products/${limit}/${currentPage}`

	return await makeApiCall('GET', url, headers)
}

const getProductViewsStats = async ({ limit, currentPage, sortBit }) => {
	const url = `${VITE_BASE_URL}/admin/products-status-report/${limit}/${currentPage}/${sortBit}`

	return await makeApiCall('GET', url, null, headers)
}

export const addTagsInCollection = async ({ categoryID, data }) => {
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
	}

	const url = `${
		import.meta.env.VITE_BASE_URL
	}/subcategory/add-mul/${categoryID}`

	return await makeApiCall('POST', url, data, headers)
}

export const updateProductPrices = async ({ data }) => {
	const url = `${VITE_BASE_URL}/product/edit-bulk`
	return await makeApiCall('PATCH', url, data, headers)
}

const getCustomers = async (limit, currentPage, type) => {
	const url = `${VITE_BASE_URL}/customers/get/${limit}/${currentPage}/${type}`

	return await makeApiCall('GET', url, headers)
}

const getSampleProductExcelFile = async (options) => {
	const headers = options?.headers || {}
	const url = `${VITE_BASE_URL}/product/excel/sample`

	return await makeApiCall('GET', url, headers)
}
const getSampleCustomersExcelFile = async (options) => {
	const headers = options?.headers || {}
	const url = `${VITE_BASE_URL}/customers/customer-excel`

	return await makeApiCall('GET', url, headers)
}

const getSampleBulkUploadExcelFile = async (options) => {
	const headers = options?.headers || {}
	const url = `${VITE_BASE_URL}/product/excel/sample`

	return await makeApiCall('GET', url, headers)
}

const searchCustomers = async ({ data, limit, currentPage, type }) => {
	const url = `${VITE_BASE_URL}/customers/search/${limit}/${currentPage}/${type}`

	return await makeApiCall('POST', url, data, headers)
}

const getVisitorGraphData = async ({ formattedDate, type }) => {
	const url = `${VITE_BASE_URL}/admin/visitors-graph/${formattedDate}/${type}`

	return await makeApiCall('GET', url, headers)
}

// Settings
export const getSettingsData = async () => {
	const url = `${VITE_BASE_URL}/admin/profile`
	return await makeApiCall('GET', url, headers)
}

export const updateSettingsData = async (data) => {
	const url = `${VITE_BASE_URL}/admin/setting-update`

	return await makeApiCall('PATCH', url, data, headers)
}

export const broadcastMessage = async (data) => {
	const url = `${VITE_BASE_URL}/admin/broadcast-message`

	return await makeApiCall('POST', url, data, headers)
}

export const getOrderStatusMessageData = async () => {
	const url = `${VITE_BASE_URL}/message-setting`

	return await makeApiCall('GET', url, headers)
}

export const postOrderStatusMessageData = async ({ data, id }) => {
	const url = `${VITE_BASE_URL}/message-setting/${id}`

	return await makeApiCall('PATCH', url, data, headers)
}

export const createOffer = async (data) => {
	const url = `${VITE_BASE_URL}/offers/create`

	return await makeApiCall('POST', url, data, headers)
}
export const getOffersList = async () => {
	const url = `${VITE_BASE_URL}/offers`

	return await makeApiCall('GET', url, headers)
}

export const bindOfferWithProducts = async ({offerId,productIds}) => {
	const url = `${VITE_BASE_URL}/offers/bind-products/${offerId}`

	return await makeApiCall('POST', url, productIds, headers)
}

export {
	fetchMoreProducts,
	deleteBulkProduct,
	getGlobalPricingSwitchAPI,
	setGlobalPricingSwitchAPI,
	searchProductsByCategory,
	adminLogIn,
	getCategory,
	getCategoryProducts,
	toggleProductStatus,
	reorderCategoryList,
	reorderProductList,
	deleteCollection,
	deleteProduct,
	addBulkCollection,
	addBulkProduct,
	addSingleCollection,
	addSingleProduct,
	editCollection,
	getOrderList,
	searchOrders,
	updateOrderStatus,
	getOrderSummary,
	getOrderById,
	addAdminNote,
	addAdminNoteForBulkOrders,
	uploadMultipleImages,
	addTagsInCategory,
	getProductData,
	getCategoryTags,
	deleteImages,
	getThemePreview,
	deleteThemePreview,
	addThemePreview,
	reorderThemeList,
	hideUnhideThemePreview,
	getThemePreviewbyId,
	editThemePreview,
	getReportData,
	getStatsData,
	getProductQuantityStats,
	getProductViewsStats,
	getCustomers,
	getSampleProductExcelFile,
	getSampleCustomersExcelFile,
	getSampleBulkUploadExcelFile,
	searchCustomers,
	getVisitorGraphData,
}
