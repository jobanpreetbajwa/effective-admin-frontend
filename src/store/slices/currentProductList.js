import { createSlice } from '@reduxjs/toolkit'

const currentProductListSlice = createSlice({
	name: 'CurrentProductList',
	initialState: {},
	reducers: {
		syncProductList: (state, action) => {
			const id = action.payload.id
			return { ...state, [id]: action.payload.element }
		},

		updateProductStatus: (state, action) => {
			const { _id, prod_status } = action.payload.data
			const categoryID = action.payload.categoryID

			if (!categoryID || !state[categoryID]) {
				console.log(`No product list found with id: ${categoryID}`)
				return state
			}

			const updatedProducts = state[categoryID].products.map((product) => {
				if (product._id === _id) {
					return {
						...product,
						prod_status: prod_status,
					}
				}
				return product
			})

			return {
				...state,
				[categoryID]: {
					...state[categoryID],
					products: updatedProducts,
				},
			}
		},

		addProductToList: (state, action) => {
			const { categoryID, product } = action.payload

			const category = state[categoryID]

			if (!category) {
				console.log(`No product list found with id: ${categoryID}`)
				return state
			}

			const updatedProducts = [...(category.products || []), product]

			return {
				...state,
				[categoryID]: {
					...category,
					products: updatedProducts,
				},
			}
		},
		addBulkProductsToList: (state, action) => {
			const { categoryID, product } = action.payload

			const category = state[categoryID]

			if (!category) {
				console.log(`No product list found with id: ${categoryID}`)
				return state
			}

			const updatedProducts = [...(category.products ?? []), ...product] // Concatenate the arrays

			return {
				...state,
				[categoryID]: {
					...category,
					products: updatedProducts,
				},
			}
		},

		updateProductList: (state, action) => {
			const { categoryID, updatedProduct } = action.payload

			const category = state[categoryID]

			if (!category) {
				console.log(`No product list found with id: ${categoryID}`)
				return state
			}

			const updatedProducts = category.products.map((product) => {
				if (product._id === updatedProduct._id) {
					return updatedProduct
				}
				return product
			})

			return {
				...state,
				[categoryID]: {
					...category,
					products: updatedProducts,
				},
			}
		},

		removeProductFromList: (state, action) => {
			const productID = action.payload.id
			const categoryID = action.payload.categoryID

			if (!state[categoryID]) {
				console.log(`No product list found with id: ${categoryID}`)
				return state
			}

			const updatedProducts = state[categoryID]?.products?.filter(
				(product) => product?._id !== productID
			)
			const newState = {
				...state,
				[categoryID]: {
					...state[categoryID],
					products: updatedProducts,
				},
			}
			return newState
		},

		reOrderProductList: (state, action) => {
			const { id, element } = action.payload

			state[id].products = element
		},

		clearProductList: () => {
			return {}
		},
	},
})

export const {
	syncProductList,
	updateProductStatus,
	clearProductList,
	addProductToList,
	removeProductFromList,
	reOrderProductList,
	updateProductList,
	addBulkProductsToList,
} = currentProductListSlice.actions
export default currentProductListSlice.reducer
