import React from 'react'
import { Table, Avatar, Label, FileInput } from 'flowbite-react'
import { MdOutlineDelete } from 'react-icons/md'
import { useState } from 'react'
import { CiCircleRemove } from 'react-icons/ci'
import { useRef } from 'react'
import ToggleSwitch from '../../../../components/toggleSwitch'
import { useEffect } from 'react'
export default function ExcelList({ item, itemIndex }) {
  const [image, setImage] = useState(null)
  const fileRef = useRef(null)
  const switchRef = useRef(null)
  const [switch1, setSwitch1] = useState(
    item?.['Product Status'] ? true : false
  )

  //handleFileChange function sets the image state with the selected file.
  const handleFileChange = (e) => {
    setImage([e.target.files[0]])
    fileRef.current.value = null
  }

  //handleRemoveImage removes the image from the state.
  const handleRemoveImage = (e) => {
    e.stopPropagation()
    setImage(null)
  }
  return (
    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
      <Table.Cell className='whitespace-nowrap w-1/4 font-medium text-gray-900  dark:text-white'>
        <input
          className='p-3'
          name='productName'
          placeholder='Product name'
          value={item?.['Product Name'] ? item?.['Product Name'] : ''}
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
            setSwitch1(!switch1)
            // toggleStatus()
          }}
        />
      </Table.Cell>

      <Table.Cell className='w-1/4'>
        <input
          className='p-3'
          name='price'
          placeholder='Price'
          value={item?.['Price'] ? item?.['Price'] : ''}
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

          {image?.map((image, i) => (
            <div key={i} className='flex justify-start relative w-12 h-12 '>
              <Avatar
                className='object-fit'
                img={URL.createObjectURL(image)}
                rounded
                stacked
                key={i}
              />
              <CiCircleRemove
                className='absolute left-6 -top-1 bg-white rounded-full hover:cursor-pointer'
                onClick={handleRemoveImage}
                size={25}
                color='red'
              />
            </div>
          ))}

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

      <Table.Cell className='w-1/4'>
        {/* <MdOutlineDelete
          color='red'
          // size={20}
          onClick={onDelete}
          className='hover:cursor-pointer hover:bg-gray-100 rounded p-1 text-3xl'
      /> */}
      </Table.Cell>
    </Table.Row>
  )
}
