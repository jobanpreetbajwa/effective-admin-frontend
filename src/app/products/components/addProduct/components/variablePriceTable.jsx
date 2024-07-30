import React from 'react'
import { Table } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  DETAILS_PRODUCT_ACTION_TYPE,
  VARIABLE_MAX_RANGE_ANY,
} from '../../../../staticData/constantActions'

const VariablePriceBody = ({ item, setVariablePricing, action }) => {
  const [editable, setEditable] = useState(false)

  const handleRemoveItem = () => {
    setVariablePricing((prevVariablePricing) => {
      const updatedVariablePricing = prevVariablePricing.filter(
        (element, i) => element['from'] != item['from']
      )

      return updatedVariablePricing
    })
  }

  return (
    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
      <Table.Cell>
        <input
          value={`${item['from']} - ${item['to']}`}
          className='w-32 rounded'
          disabled={
            action === DETAILS_PRODUCT_ACTION_TYPE
              ? true
              : editable
              ? false
              : true
          }
        />
      </Table.Cell>
      <Table.Cell>
        <input
          value={item['price']}
          className='w-32 rounded p-1'
          disabled={
            action === DETAILS_PRODUCT_ACTION_TYPE
              ? true
              : editable
              ? false
              : true
          }
        />
      </Table.Cell>

      <Table.Cell>
        {action === DETAILS_PRODUCT_ACTION_TYPE ? null : (
          <button
            type='button'
            className='hover:text-rose-600 w-16'
            disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
            onClick={() => handleRemoveItem()}
          >
            Delete
          </button>
        )}
      </Table.Cell>
    </Table.Row>
  )
}

export default function VariablePriceTable({
  action,
  mustGreaterThan,
  variablePricing,
  setVariablePricing,
  setMaxRange,
  maxRange,
}) {
  const positiveIntegerRegEx = /^$|^[1-9]\d*$/
  const [maxValue, setMaxValue] = useState('')

  const validateHandler = (e) => {
    const inputValue = e.target.value
    return positiveIntegerRegEx.test(inputValue)
  }

  useEffect(() => {
    if (variablePricing) {
      const lastEnteredPrice = variablePricing.length
        ? variablePricing[variablePricing.length - 1]?.price
        : ''

      setMaxValue(maxRange?.price || lastEnteredPrice)

      setMaxRange([
        {
          from: mustGreaterThan,
          to: VARIABLE_MAX_RANGE_ANY,
          price: lastEnteredPrice,
        },
      ])
    }
  }, [variablePricing])

  const maxRangeHandler = (e) => {
    if (e.target.value.length <= 10) {
      setMaxValue(e.target.value)
      setMaxRange([
        {
          from: mustGreaterThan,
          to: VARIABLE_MAX_RANGE_ANY,
          price: e.target.value,
        },
      ])
    } else {
      toast.info('Price cannot be greater than 10 digits.')
    }
  }
  return (
    <div className='flex flex-col gap-2'>
      <div className='overflow-x-auto  '>
        <Table striped>
          <Table.Head>
            <Table.HeadCell>range</Table.HeadCell>
            <Table.HeadCell>price</Table.HeadCell>

            <Table.HeadCell>
              <span className='sr-only'>Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className='w-fit'>
            {variablePricing.map((item, i) => {
              return (
                <VariablePriceBody
                  key={i}
                  item={item}
                  action={action}
                  setVariablePricing={setVariablePricing}
                />
              )
            })}
            {mustGreaterThan ? (
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell className='flex gap-1'>
                  <p className='text-rose-600'>*</p>
                  <input
                    value={'>' + mustGreaterThan}
                    disabled={true}
                    className='w-16 rounded '
                  />
                </Table.Cell>

                <Table.Cell>
                  <input
                    placeholder='Enter max range'
                    value={
                      maxRange?.price
                        ? maxRange?.price
                        : maxValue
                        ? maxValue
                        : maxRange
                        ? maxRange?.from
                        : ''
                    }
                    disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
                    className='w-32 rounded p-1 bg-gray-300'
                    onChange={(e) => {
                      if (validateHandler(e)) {
                        maxRangeHandler(e)
                      } else {
                        toast.warning('Only numbers are allowed')
                      }
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            ) : null}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}
