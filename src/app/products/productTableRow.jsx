import { useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Checkbox, Dropdown, Table } from 'flowbite-react'

import DeleteProduct from './modal/deleteProduct'
import ToggleSwitch from '../components/toggleSwitch'
import { toggleProductStatus } from '../../api/function'
import { MRP_PRICE_FIXED_VALUE } from '../constant/products/constant'
import { updateProductStatus } from '../../store/slices/currentProductList'

import { IoEllipsisVerticalSharp } from 'react-icons/io5'
import { toast } from 'sonner'

export default function ProductTableRow({
  searchedItem,
  item,
  index,
  isChecked,
  allProductSelected,
  selectedProductsData,
  selectedProductHandler,
  setSelectedProductsData,
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { categoryID } = useParams()
  const [openModal, setOpenModal] = useState(false)
  const switchRef = useRef(item?.prod_status)
  const [switch1, setSwitch1] = useState(item?.prod_status)

  //toggleStatus function toggles the status (active/inactive) of a product, updating it in the backend and reflecting the change in the application's state
  const toggleStatus = () => {
    try {
      toggleProductStatus({ id: item?._id, state: switchRef.current ? 1 : 0 })
        .then((response) => {
          dispatch(
            updateProductStatus({ data: response.data, categoryID: categoryID })
          )
        })
        .catch((error) => {
          setSwitch1(false)
          console.error(error)
        })
    } catch (error) {
      console.log('Error while toggling product status ', error)
      toast.error('Error while toggling product status')
    }
  }

  //clickHandler function invokes a selected product handler function, passing the clicked item as an argument
  const clickHandler = (e) => {
    e.stopPropagation()
    selectedProductHandler(e, item)
  }

  //useEffect hook triggers a product selection handler when all products are selected, ensuring synchronization between the selection state and the application's overall selection status
  useEffect(() => {
    if (allProductSelected) {
      selectedProductHandler({ target: { checked: true } }, item)
    }
  }, [allProductSelected])

  return (
    <>
      {openModal && (
        <DeleteProduct
          id={item?._id}
          name={item?.name}
          openModal={openModal}
          setOpenModal={setOpenModal}
          selectedProductsData={selectedProductsData}
          setSelectedProductsData={setSelectedProductsData}
        />
      )}
      <Table.Cell
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className='flex items-center gap-6'>
          <Checkbox
            value=''
            type='checkbox'
            className='w-4 h-4'
            onChange={clickHandler}
            checked={allProductSelected || isChecked}
          />
          <span className='ml-4'>{index + 1}</span>
        </div>
      </Table.Cell>

      <Table.Cell
        className={`min-w-40 flex col-span-full items-center py-4 gap-4 font-medium text-gray-900 dark:text-white `}
      >
        <div className='flex items-center justify-between gap-4 hover:cursor-pointer'>
          <img
            alt='product_image'
            src={
              item?.img_ids ? item?.img_ids[0]?.url : 'no_image_available.png'
            }
            className='h-10 w-10 rounded-full object-contain'
          />
          <div className='flex flex-col '>
            <div className='text-pretty line-clamp-3'>{item?.name}</div>
            {!!searchedItem && item?.category?.length && (
              <div className='text-pretty line-clamp-3 font-bold'>
                Category Name :{' '}
                <span className='font-bold'>{item?.category}</span>
              </div>
            )}
          </div>
        </div>
      </Table.Cell>

      <Table.Cell
        className='px-6 py-4 w-1/5'
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <ToggleSwitch
          ref={switchRef}
          checked={switch1}
          label={switch1 ? 'Visible' : 'Hidden'}
          onChange={() => {
            switchRef.current = !switchRef.current
            setSwitch1(!switch1)
            toggleStatus()
          }}
        />
      </Table.Cell>

      <Table.Cell className='px-6 py-4 w-1/5'>
        {item?.inventory_available ? 'Available' : 'Limited'}
      </Table.Cell>

      <Table.Cell
        className='px-6 py-4 relative  h-full'
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className='flex items-center'>
          <span className='w-24'>
            ₹{item?.mrp_price?.toFixed(MRP_PRICE_FIXED_VALUE)}
          </span>

          <Dropdown
            size='sm'
            placement='auto'
            renderTrigger={() => {
              return (
                <IoEllipsisVerticalSharp
                  className='hover:bg-slate-300 cursor-pointer rounded px-1'
                  size={25}
                />
              )
            }}
          >
            <Dropdown.Item
              onClick={() => {
                navigate(`/products/${categoryID}/edit-product/${item?._id}`, {
                  state: {
                    product: item,
                  },
                })
              }}
            >
              Edit Product
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setOpenModal(!openModal)}>
              Delete Product
            </Dropdown.Item>
          </Dropdown>
        </div>
      </Table.Cell>
    </>
  )
}
