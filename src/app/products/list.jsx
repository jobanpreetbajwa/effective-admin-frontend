import { useState } from 'react'
import { Dropdown } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import DeleteCollection from './modal/deleteCollection'
import { clearProductList } from '../../store/slices/currentProductList'

import { IoEllipsisVerticalSharp } from 'react-icons/io5'

export default function List({
  searchedItem,
  item,
  index,
  currentPage,
  setSearchedItem,
  setIsFetchingProducts,
  editCategory,
  setEditCategoryData,
  setEditCategory,
  selectedCategoryId,
  searchedList,
  setSearchedList,

  setObjectToEdit,
  setSelectedProductsData,
  setAllProductSelected,
  setFilterTags,
}) {
  const [openModal, setOpenModal] = useState(false)

  const dispatch = useDispatch()
  const productListSelector = useSelector((state) => state.currentProductList)
  const navigate = useNavigate()

  //categoryClickedHandler select new category and pass its ID in params.
  const categoryClickedHandler = (e) => {
    e.stopPropagation()
    setIsFetchingProducts(true)
    currentPage.current = 1
    setFilterTags([])
    // setSearchedItem('')
    setObjectToEdit({})
    setSelectedProductsData([])
    setAllProductSelected(false)

    navigate(`/products/${item?._id}`)

    if (!productListSelector[selectedCategoryId]) {
      dispatch(clearProductList())
    }
  }

  return (
    <>
      {openModal && (
        <DeleteCollection
          openModal={openModal}
          setOpenModal={setOpenModal}
          id={item?._id}
          name={item?.category_name || 'name'}
          searchedList={searchedList}
          setSearchedList={setSearchedList}
        />
      )}

      {searchedList ? (
        searchedList[item?._id] ? (
          <div
            index={index}
            className={`flex items-center bg-slate-100  border-b hover:bg-slate-200 cursor-pointer ${
              selectedCategoryId === item?._id ? 'bg-slate-300' : ''
            }`}
            onClick={categoryClickedHandler}
          >
            <div className='flex gap-3 p-3'>
              <img
                alt='img'
                src={item?.img_ids?.[0]?.url}
                className='rounded-full h-12 w-12'
              />
              <div className='flex flex-col w-32 truncate'>
                <h2 className='max-w-24 truncate'>
                  {item?.category_name || 'deault_name'}
                </h2>
                <p className='font-extralight text-xs'>
                  {+searchedList[item?._id] <= 1
                    ? `${searchedList[item?._id]} item`
                    : `${searchedList[item?._id]} items`}{' '}
                </p>
              </div>
            </div>
            <div
              className='relative ml-auto px-4 '
              onClick={(e) => e.stopPropagation()}
            >
              <Dropdown
                size='sm'
                placement='left'
                renderTrigger={() => {
                  return (
                    <IoEllipsisVerticalSharp
                      className=' hover:bg-slate-300 rounded p-1'
                      size={25}
                    />
                  )
                }}
                className='-ml-24'
              >
                <Dropdown.Item
                  className='border-b'
                  onClick={() => {
                    setEditCategory(!editCategory)
                    setEditCategoryData(item)
                  }}
                >
                  Edit Collection
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setOpenModal(!openModal)}>
                  Delete Collection
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        ) : null
      ) : (
        <div
          index={index}
          className={`flex items-center bg-slate-100  border-b hover:bg-slate-200 cursor-pointer ${
            selectedCategoryId === item?._id && !searchedItem.length
              ? 'bg-slate-300'
              : ''
          }`}
          onClick={categoryClickedHandler}
        >
          <div className='flex gap-3 p-3'>
            <img
              alt='img'
              src={item?.img_ids?.[0]?.url}
              className='rounded-full h-12 w-12'
            />
            <div className='flex flex-col w-32 truncate'>
              <h2 className='max-w-24 truncate'>
                {item?.category_name || 'deault_name'}
              </h2>
              <p className='font-extralight text-xs'>
                {+item?.items <= 1
                  ? `${item?.items} item`
                  : `${item?.items} items`}{' '}
              </p>
            </div>
          </div>
          <div
            className='relative ml-auto px-4 '
            onClick={(e) => e.stopPropagation()}
          >
            <Dropdown
              size='sm'
              placement='left'
              renderTrigger={() => {
                return (
                  <IoEllipsisVerticalSharp
                    className=' hover:bg-slate-300 rounded p-1'
                    size={25}
                  />
                )
              }}
              className='-ml-24'
            >
              <Dropdown.Item
                className='border-b'
                onClick={() => {
                  setEditCategory(!editCategory)
                  setEditCategoryData(item)
                }}
              >
                Edit Collection
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setOpenModal(!openModal)}>
                Delete Collection
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      )}
    </>
  )
}
