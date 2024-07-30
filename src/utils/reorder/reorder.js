import { reorderCategoryList, reorderProductList } from '../../api/function'
import { syncCategoryList } from '../../store/slices/categoryList'
import { reOrderProductList } from '../../store/slices/currentProductList'

const reorder = async (result, list, type, dispatch, categoryID) => {
  if (!result || !result.destination) return

  const { source, destination, draggableId } = result
  const copyListItems = [...list]
  const [removedItem] = copyListItems.splice(source.index, 1)

  copyListItems.splice(destination.index, 0, removedItem)

  const from = source?.index + 1
  const to = destination?.index + 1
  if (from === to) {
    return
  }
  const data = {
    from: from,
    to: to,
    category_id: draggableId,
  }
  switch (type) {
    case 'CategoryList':
      dispatch(syncCategoryList(copyListItems))
      try {
        await reorderCategoryList(data)
      } catch (error) {
        console.log('Error while moving product:', error)
        // Handle error if needed
      }
      break
    case 'ProductList':
      dispatch(reOrderProductList({ id: categoryID, element: copyListItems }))
      try {
        const product_id = result?.draggableId
        await reorderProductList({ data, categoryID, product_id })
      } catch (error) {
        console.log('Error while moving product:', error)
        // Handle error if needed
      }
      break
  }
}

export default reorder
