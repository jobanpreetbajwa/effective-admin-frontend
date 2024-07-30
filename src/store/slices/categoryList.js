import { createSlice } from '@reduxjs/toolkit'
import { INCREMENT_ACTION_TYPE } from '../../app/staticData/constantActions'

const categoryListSlice = createSlice({
	name: 'categoryList',
	initialState: [],
	reducers: {
		syncCategoryList: (state, action) => {
			return (state = action.payload)
		},
		editCategoryList: (state, action) => {
			const idToRemove = action.payload
			const newState = state?.filter((elem) => elem?._id !== idToRemove)
			return newState
		},
		editCategoryListData: (state, action) => {
			const { _id } = action.payload
			const newState = state?.map((elem) => {
				if (elem?._id === _id) {
					return action.payload
				}
				return elem
			})

			return newState
		},

		updateCategoryItemsCount: (state, action) => {
			const { _id } = action.payload
			const actionType = action.payload.type
			let count = action.payload?.count

			if (!count) {
				count = 1
			}
			const newState = state?.map((elem) => {
				if (elem?._id === _id) {
					if (actionType === INCREMENT_ACTION_TYPE) {
						return { ...elem, items: elem?.items + count }
					} else {
						if (elem.items > 0) {
							return { ...elem, items: elem?.items - count }
						}
					}
				} else {
					return elem
				}
			})
			return newState
		},
		addNewSubcategoryIn_Category: (state, action) => {
			const { _id, newTag } = action.payload

			const newState = state?.map((elem) => {
				if (elem?._id === _id) {
					const updatedElem = {
						...elem,
						subcategories: elem.subcategories
							? [...elem.subcategories, newTag]
							: [newTag],
					}
					return updatedElem
				} else {
					return elem
				}
			})

			return newState
		},
		addCategoryToList: (state, action) => {
			const newList = [...state, action.payload]
			return newList
		},
		addBulkCategoriesToList: (state, action) => {
			const newList = [...state, ...action.payload]
			return newList
		},
		clearCategoryList: (state) => {
			return (state.length = 0)
		},
	},
})

export const {
	syncCategoryList,
	clearCategoryList,
	editCategory,
	editCategoryList,
	addCategoryToList,
	editCategoryListData,
	updateCategoryItemsCount,
	addBulkCategoriesToList,
	addNewSubcategoryIn_Category,
} = categoryListSlice.actions
export default categoryListSlice.reducer
