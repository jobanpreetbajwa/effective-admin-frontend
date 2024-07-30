import { reorderProductList } from '../../../api/function'

const reorderList = (list, categoryId) => {
	const data = {
		list: list,
		category_id: categoryId,
	}
	return reorderProductList(data)
}
export default reorderList
