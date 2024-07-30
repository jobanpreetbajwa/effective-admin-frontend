import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import categoryListSlice from './slices/categoryList'
import currentProductListSlice from './slices/currentProductList'
const store = configureStore({
	reducer: {
		categoryList: categoryListSlice,
		currentProductList: currentProductListSlice,
	},
})
export const StoreProvider = ({ children }) => {
	return <Provider store={store}>{children}</Provider>
}

export default store
