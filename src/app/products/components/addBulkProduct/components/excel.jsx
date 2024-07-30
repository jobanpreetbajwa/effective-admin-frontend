import { toast } from 'sonner'
import { useState, useRef } from 'react'
import { Table, Avatar, Label, FileInput, Button } from 'flowbite-react'

import ToggleSwitch from '../../../../components/toggleSwitch'
import { capitalizeFirstLetter } from '../../../../../utils/function'
import { ONLY_FLOATING_POINT_HANDLER } from '../../../../utilis/regex'

import { CiCircleRemove } from 'react-icons/ci'
import { IoIosArrowRoundBack } from 'react-icons/io'

const ExcelContent = ({ item, itemIndex, error, setExcelData, setPreview }) => {
  const [image, setImage] = useState(item?.image)

  const fileRef = useRef(null)
  const [name, setName] = useState(
    item?.['Product Name'] ? item?.['Product Name'] : ''
  )

  const [price, setPrice] = useState(item?.['Price'] ? item?.['Price'] : '')
  const switchRef = useRef(null)
  const [switch1, setSwitch1] = useState(true)
  const switchShowPriceRef = useRef(null)
  const [switchShowPrice, setswitchShowPrice] = useState(true)

  //HandleFileChange function updates the image associated with a product and triggers an update to the product list with the new image data
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setImage(selectedFile)
    fileRef.current.value = null
    const newData = {
      'Product Name': name,
      'Product Status': switch1,
      Price: price,
      image: selectedFile,
      showPrice: switchShowPrice,
      uuid: item?.uuid,
    }

    updateList(newData)
  }

  //HandleRemoveImage function removes the image associated with a product and triggers an update to the product list
  const handleRemoveImage = (e) => {
    e.stopPropagation()
    setImage(null)
    const newData = {
      'Product Name': name,
      'Product Status': switch1,
      Price: price,
      showPrice: switchShowPrice,
      image: null,
      uuid: item?.uuid,
    }
    updateList(newData)
  }

  //handlePriceChange function updates the price state based on user input, enforcing floating-point number input and restricting the value to a maximum of 999999, while notifying users of any input exceeding this limit
  const priceHandler = (e) => {
    ONLY_FLOATING_POINT_HANDLER(e)
    if (+e.target.value > 999999) {
      toast.warning('Price should not be more than 999999', {
        id: 'price',
      })
      e.target.value = e.target.value.slice(0, -1)
      return
    }
    setPrice(e.target.value)
    const newData = {
      'Product Name': name,
      'Product Status': switch1,
      Price: e.target.value,
      image: image,
      showPrice: switchShowPrice,
      uuid: item?.uuid,
    }
    updateList(newData)
  }

  //HandleFileChange function updates the product name and triggers an update to the product list with the new name.
  const nameHandler = (e) => {
    setName(e.target.value)
    const newData = {
      'Product Name': e.target.value,
      'Product Status': switch1,
      Price: price,
      showPrice: switchShowPrice,
      image: image,
      uuid: item?.uuid,
    }

    updateList(newData)
  }

  //Updating the Excel data list.
  const updateList = (newData) => {
    setExcelData((prevData) => {
      const updatedData = prevData.map((item, index) => {
        if (index === itemIndex) {
          return newData
        }
        return item
      })
      return updatedData
    })
  }

  //toggleHandler will toggle product status.
  const toggleHandler = (value) => {
    setSwitch1(!switch1)
    const newData = {
      'Product Name': name,
      'Product Status': value,
      Price: price,
      showPrice: switchShowPrice,
      image: image,
      uuid: item?.uuid,
    }

    updateList(newData)
  }

  //toggleShowPriceHandler will toggle show price to customer.
  const toggleShowPriceHandler = (value) => {
    setswitchShowPrice(!switchShowPrice)
    const newData = {
      'Product Name': name,
      'Product Status': switch1,
      Price: price,
      showPrice: value,
      image: image,
      uuid: item?.uuid,
    }

    updateList(newData)
  }
  return (
    <Table.Row
      className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${
        error ? 'bg-rose-100 ' : ' '
      }`}
    >
      <Table.Cell className='flex gap-2  whitespace-nowrap  font-medium text-gray-900  dark:text-white'>
        <p className='w-12 text-nowrap flex justify-center items-center'>
          {itemIndex + 1}
        </p>
        <input
          className='p-3 rounded-lg'
          name='productName'
          value={name}
          onChange={nameHandler}
          maxLength={50}
        ></input>
      </Table.Cell>

      <Table.Cell className='w-1/4'>
        <ToggleSwitch
          ref={switchRef}
          checked={switch1}
          label={switch1 ? 'Visible' : 'Hidden'}
          onChange={() => {
            switchRef.current = !switchRef.current
            toggleHandler(switchRef.current)
          }}
        />
      </Table.Cell>
      <Table.Cell className='w-1/4'>
        <ToggleSwitch
          ref={switchShowPriceRef}
          checked={switchShowPrice}
          label={switchShowPrice ? 'Visible' : 'Hidden'}
          onChange={() => {
            switchShowPriceRef.current = !switchShowPriceRef.current
            toggleShowPriceHandler(switchShowPriceRef.current)
          }}
        />
      </Table.Cell>

      <Table.Cell className='w-1/4'>
        <input
          className='p-3 rounded-lg'
          name='price'
          value={price}
          onChange={priceHandler}
        ></input>
      </Table.Cell>

      <Table.Cell className=' w-1/4'>
        <div>
          <FileInput
            ref={fileRef}
            id={`file-upload-${itemIndex}`}
            accept='.jpg, .jpeg, .png'
            onChange={handleFileChange}
            className='hidden'
          />

          {image ? (
            <div className='flex justify-start relative w-12 h-12 '>
              <Avatar
                className='object-fit'
                img={URL.createObjectURL(image)}
                rounded
                stacked
              />
              <CiCircleRemove
                className='absolute left-6 -top-1 bg-white rounded-full hover:cursor-pointer'
                onClick={(e) => handleRemoveImage(e)}
                size={25}
                color='red'
              />
            </div>
          ) : null}

          {!image && (
            <Label
              htmlFor={`file-upload-${itemIndex}`}
              className='flex hover:bg-gray-200 hover:cursor-pointer rounded-full border bg-gray-50 w-12 h-12 justify-center items-center'
            >
              +
            </Label>
          )}
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default function Excel({
  excelData,
  setBulkProducts,
  setExcelData,
  setPreview,
}) {
  const checkValidations = (item) => {
    const productStatus = item['Product Status']

    const isValidProductStatus =
      productStatus === 0 || productStatus === 1
        ? true
        : productStatus === true || productStatus === false
        ? true
        : false

    const isValidPrice = /^\d{1,6}(?:\.\d{1,2})?$/.test(item.Price)
    const isValidName = item['Product Name'] !== ''
    const isValidImage = item['image'] ? true : false
    if (
      !isValidProductStatus ||
      !isValidPrice ||
      !isValidName ||
      !isValidImage
    ) {
      return true
    }

    return false
  }
  const saveHandler = () => {
    const updatedData = excelData
      .filter((item) => {
        return (
          item['Product Name'] &&
          item['Product Status'] !== undefined &&
          item['Price'] &&
          (Array.isArray(item['image'])
            ? item['image'].length > 0
            : item['image'] !== null)
        )
      })
      .map((item) => ({
        name: capitalizeFirstLetter(item['Product Name']),
        prod_status: item['Product Status'],
        mrp_price: item['Price'],
        images: [item['image']],
        is_pricing: item['showPrice'],
        uuid: item?.uuid,
      }))

    const remainingData = excelData.filter((item) => {
      const existsInUpdatedData = updatedData.some((updatedItem) => {
        return updatedItem.uuid === item.uuid
      })

      return !existsInUpdatedData
    })

    setExcelData(remainingData)
    setBulkProducts((prev) => [...prev, ...updatedData])
  }

  const discardHandler = () => {
    setExcelData(null)
    setPreview(false)
  }

  return (
    <div className='p-4'>
      <div className=' '>
        <div className='flex justify-between items-center pr-8'>
          <button className='flex gap-1 ' onClick={() => setPreview(false)}>
            <IoIosArrowRoundBack size={32} />
            <p className=' text-xl'> Back </p>
          </button>
          <div className='flex gap-3'>
            <Button className='w-28' onClick={discardHandler}>
              Discard
            </Button>
            <Button className='w-28' onClick={saveHandler}>
              Save
            </Button>
          </div>
        </div>
        <div className='flex gap-3'>
          <h1 className='font-bold text-2xl'>Excel Preview </h1>

          <p className='text-rose-400 text-sm font-bold flex flex-col justify-end'>
            Rows with background in red are incomplete.
          </p>
        </div>
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell className='flex gap-2 '>
            <p className='w-12 text-nowrap'>Sr No.</p>
            <p>Product name</p>
            <span className='text-rose-600'>*</span>
          </Table.HeadCell>
          <Table.HeadCell>
            Product Status
            <span className='text-rose-600'>*</span>
          </Table.HeadCell>
          <Table.HeadCell>
            Show Price To Customer
            <span className='text-rose-600'>*</span>
          </Table.HeadCell>
          <Table.HeadCell>
            Price
            <span className='text-rose-600'>*</span>
          </Table.HeadCell>

          <Table.HeadCell>
            media
            <span className='text-rose-600'>*</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className='divide-y '>
          {excelData && excelData?.length
            ? excelData.map((item, index) => {
                const error = checkValidations(item)

                return (
                  <ExcelContent
                    item={item}
                    key={item?.uuid}
                    itemIndex={index}
                    error={error}
                    setExcelData={setExcelData}
                  />
                )
              })
            : null}
        </Table.Body>
      </Table>
    </div>
  )
}
