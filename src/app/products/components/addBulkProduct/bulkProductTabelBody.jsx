import { useSelector } from 'react-redux'
import { Table, Avatar } from 'flowbite-react'
import { useState, useEffect, useMemo } from 'react'

import Tags from './components/tags'
import { ONLY_FLOATING_POINT_HANDLER } from '../../../utilis/regex'

import { MdOutlineDelete } from 'react-icons/md'

export default function BulkProductTabelBody({
  item,
  index,
  onDelete,
  categoryID,
  isProductsAdding,
  setBulkProducts,
}) {
  const [productName, setProductName] = useState(item?.name || '')
  // const [images, setImages] = useState(item?.images || [])
  const [price, setPrice] = useState(item?.mrp_price)

  // const [anyChanges, setAnyChanges] = useState(false)
  const categoryListSelector = useSelector((state) => state.categoryList)

  const currentCategory = categoryListSelector?.find(
    (item) => categoryID === item?._id
  )

  const onChangeHandler = (e) => {
    // setAnyChanges(true)

    switch (e.target.name) {
      case 'productName':
        setProductName(e.target.value)

        break
      case 'image':
        // setImage(e.target.files[0])
        setBulkProducts((prev) => {
          const updatedBulkProducts = [...prev]
          updatedBulkProducts[index].images = e.target.files[0]

          return updatedBulkProducts
        })
        break

      case 'price':
        ONLY_FLOATING_POINT_HANDLER(e)

        if (+e.target.value > 999999) {
          toast.warning('Price should not be more than 999999', {
            id: 'price',
          })
          e.target.value = e.target.value.slice(0, -1)
        }

        setPrice(e.target.value)
        break
      default:
        break
    }
  }
  // const memoizedAnyChanges = useMemo(() => anyChanges, [anyChanges])

  // useEffect(() => {
  // 	if (memoizedAnyChanges) {
  // 		console.log('anyChanges is now true')
  // 	}
  // }, [memoizedAnyChanges])

  const setSelectedTags = (tags) => {
    // setSelectedTags function sets the selected tags in the state
    setBulkProducts((prev) => {
      const updatedBulkProducts = [...prev]
      updatedBulkProducts[index].subcategories = tags
      return updatedBulkProducts
    })
  }

  return (
    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
      <Table.Cell className='w-1/4 min-w-1/5 font-medium '>
        <div className='flex gap-4'>
          <p className='flex justify-center items-center text-nowrap w-10'>
            {index + 1}
          </p>

          <input
            className='p-3'
            name='productName'
            disabled={item?.name}
            onChange={onChangeHandler}
            placeholder='Product name'
            value={productName}
            maxLength={50}
          />
        </div>
      </Table.Cell>

      <Table.Cell className='w-fit'>
        <input
          className='w-full p-3'
          name='visibility_status'
          onChange={onChangeHandler}
          disabled={true}
          value={item?.prod_status ? 'Visible' : 'Hidden'}
        />
      </Table.Cell>

      <Table.Cell className='w-fit'>
        <input
          className='w-full p-3'
          name='price_To_Customer'
          disabled={true}
          value={item?.is_pricing ? 'Visible' : 'Hidden'}
        />
      </Table.Cell>

      <Table.Cell className='w-1/6'>
        <input
          className='w-full min-w-24 p-3'
          name='price'
          onChange={onChangeHandler}
          disabled={item?.mrp_price}
          placeholder='Price'
          value={price}
        ></input>
      </Table.Cell>

      <Table.Cell className='overflow-auto w-fit'>
        {
          // here this avatar rerenders on every change in
        }
        <Avatar.Group>
          {item?.images.map((img, i) => (
            <Avatar
              className='object-fit'
              img={URL.createObjectURL(img)}
              rounded
              stacked
              key={i}
            />
          ))}
        </Avatar.Group>
      </Table.Cell>

      <Table.Cell className='overflow-auto w-fit'>
        <Tags
          disabled={false}
          selectedTags={item?.subcategories}
          setSelectedTags={setSelectedTags}
          tags={currentCategory?.subcategories}
        />
      </Table.Cell>

      <Table.Cell className='w-1/7'>
        <MdOutlineDelete
          color='red'
          onClick={isProductsAdding ? null : onDelete}
          className='hover:cursor-pointer hover:bg-gray-100 rounded p-1 text-3xl'
        />
      </Table.Cell>
    </Table.Row>
  )
}
