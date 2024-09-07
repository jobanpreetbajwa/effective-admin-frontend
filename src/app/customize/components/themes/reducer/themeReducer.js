export const initialState = {
	isModalOpen: false,
	categories: [],
	subCategories: [],
	categoryId: '',
	subCategoryIds: [],
	title: '',
	isCategorySelected: false,
	themeOptionList: [],
	isLoadingCategoryList: false,
	image: [],
	tempFile: null,
	isDragging: false,
	list: [],
	allSelectedCategories: [],
	tagline: '',
	reviews: [],
	selectedCategoryId: '',
	selectedBannerId: '',
	selectedBannerCategoryId: [],
	offers:[],
}

export const reducer = (state, action) => {
	switch (action.type) {
		case 'SET_MODAL':
			return { ...state, isModalOpen: !state.isModalOpen }
		case 'SET_CATEGORIES':
			return { ...state, categories: action.payload }
		case 'SET_SUB_CATEGORIES':
			return { ...state, subCategories: action.payload }
		case 'SET_CATEGORY_ID':
			return { ...state, categoryId: action.payload }
		case 'SET_SUB_CATEGORY_IDS':
			return { ...state, subCategoryIds: action.payload }
		case 'SET_TITLE':
			return { ...state, title: action.payload }
		case 'SET_IS_CATEGORY_SELECTED':
			return { ...state, isCategorySelected: action.payload }
		case 'SET_THEME_OPTION_LIST':
			return { ...state, themeOptionList: action.payload }
		case 'SET_IS_LOADING_CATEGORY_LIST':
			return { ...state, isLoadingCategoryList: action.payload }
		case 'SET_IMAGE':
			return { ...state, image: action.payload }
		case 'SET_TEMP_FILE':
			return { ...state, tempFile: action.payload }
		case 'SET_IS_DRAGGING':
			return { ...state, isDragging: action.payload }
		case 'SET_LIST':
			return { ...state, list: action.payload }
		case 'SET_ALL_SELECTED_CATEGORIES':
			return { ...state, allSelectedCategories: action.payload }
		case 'SET_TAGLINE':
			return { ...state, tagline: action.payload }
		case 'SET_REVIEWS':
			return { ...state, reviews: action.payload }
		case 'SET_SELECTED_CATEGORY_ID':
			return {
				...state,
				selectedCategoryId: action.payload,
			}
		case 'SET_SELECTED_BANNER_ID':
			return {
				...state,
				selectedBannerId: action.payload,
			}

		case 'SET_SELECTED_BANNER_CATEGORY_ID':
			return {
				...state,
				selectedBannerCategoryId: action.payload,
			}
		case 'SET_OFFERS':
			return {
				...state,
				offers: action.payload,
			}
		default:
			return state
	}
}
