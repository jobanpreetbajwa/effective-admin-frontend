export default function SortSearchedList(categoryList, searchedList) {
  const categoryIndexMap = {}
  categoryList.forEach((category, index) => {
    categoryIndexMap[category._id] = index
  })

  const sortedResult = {}
  Object.keys(searchedList)
    .sort((idA, idB) => {
      return categoryIndexMap[idA] - categoryIndexMap[idB]
    })
    .forEach((id) => {
      sortedResult[id] = searchedList[id]
    })

  return sortedResult
}
