import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { Button, Modal } from 'flowbite-react'

import {
  ONLY_FLOATING_POINT_HANDLER,
  ONLY_NUMBERS_HANDLER,
} from '../../utilis/regex'

export default function VariablePriceModal({
  variablePricing,
  defaultStartRange,
  variablePriceModal,
  setVariablePriceModal,
  addVariablePricing,
}) {
  const [price, setPrice] = useState('')
  const [endRange, setEndRange] = useState('')
  const [startRange, setStartRange] = useState('')
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  //rangeMustBeUnique function ensures that the start and end range values for variable pricing are unique compared to existing ranges, displaying an error toast if a duplicate range is detected
  const rangeMustBeUnique = () => {
    if (+startRange && +endRange) {
      variablePricing?.forEach((element) => {
        if (element.from > +startRange && element.to < +endRange) {
          setStartRange('')
          setEndRange('')
          return toast.error(
            'This range is already in use.Please try another !!',
            {
              duration: 3000,
            }
          )
        }
      })
    }
  }

  // Function to check if all fields are filled
  const areFieldsFilled = () => {
    return (
      startRange !== '' &&
      endRange !== '' &&
      price !== '' &&
      !isNaN(startRange) &&
      !isNaN(endRange) &&
      !isNaN(price)
    )
  }

  // Function to set the start range
  useEffect(() => {
    if (defaultStartRange != null) {
      setStartRange(+defaultStartRange + 1)
    }
  }, [defaultStartRange])

  // Function to check if the button should be disabled
  useEffect(() => {
    setIsButtonDisabled(
      !areFieldsFilled() ||
        (+endRange && +startRange >= +endRange) ||
        (+endRange && +startRange >= +endRange)
    )
  }, [startRange, endRange, price])

  // Function to add variable pricing
  const addVariable = (e) => {
    e.preventDefault()
    if (!areFieldsFilled()) {
      return
    }

    const pricingArray = {
      from: '' + startRange,
      to: '' + endRange,
      price: '' + price,
    }

    // Call the function to add variable pricing
    addVariablePricing(pricingArray)

    setStartRange('')
    setEndRange('')
    setPrice('')

    setVariablePriceModal(false)
  }

  // Function to check if the end range is greater than the start range
  const checkEndRangeHandler = () => {
    if (+endRange) {
      variablePricing?.forEach((element) => {
        if (element?.from <= +endRange && element?.to >= +endRange) {
          setEndRange('')
          return toast.error(
            'This range is already in use. Please try another!',
            {
              duration: 3000,
            }
          )
        }
      })
    }

    if (+endRange && +startRange && +endRange <= +startRange) {
      toast.error('end range must be greater than start', {
        duration: 2000,
      })
      setEndRange('')
    }
  }

  // Function to check if the start range is less than the end range
  const checkStartRangeHandler = () => {
    if (+startRange) {
      variablePricing?.forEach((element) => {
        if (element?.from <= +startRange && element?.to >= +startRange) {
          setStartRange('')
          return toast.error(
            'This range is already in use. Please try another !!',
            {
              duration: 3000,
              id: 'price',
            }
          )
        }
      })
    }

    if (+endRange && +startRange && +startRange >= +endRange) {
      toast.error('start range must not exceed end', {
        duration: 2000,
        id: 'price',
      })
      setStartRange('')
    }
  }

  return (
    <>
      <Modal
        show={variablePriceModal}
        size='xl'
        onClose={() => setVariablePriceModal(false)}
        dismissible
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <form className='flex flex-col space-y-6'>
            <div className='flex gap-2'>
              <h3 className='text-xl font-medium w-44 text-gray-900 dark:text-white'>
                From :
              </h3>
              <input
                type='text'
                placeholder='start range'
                value={startRange}
                onChange={(e) => {
                  ONLY_NUMBERS_HANDLER(e)

                  if (+e.target.value > 999998) {
                    toast.warning('Start Range should not be more than 999998')
                    e.target.value = e.target.value.slice(0, -1)
                  }
                  setStartRange(e.target.value)
                }}
                required
                onBlur={(e) => {
                  checkStartRangeHandler()
                  rangeMustBeUnique()
                }}
              />
            </div>
            <div className='flex gap-2'>
              <h3 className='text-xl font-medium w-44 text-gray-900 dark:text-white'>
                To :
              </h3>
              <div className='flex flex-col gap-1'>
                <input
                  type='text'
                  placeholder='end range'
                  value={endRange}
                  onChange={(e) => {
                    ONLY_NUMBERS_HANDLER(e)

                    if (+e.target.value > 999999) {
                      toast.warning(
                        'End Range should not be more than 999999',
                        {
                          id: 'price',
                        }
                      )
                      e.target.value = e.target.value.slice(0, -1)
                    }

                    setEndRange(e.target.value)
                  }}
                  required
                  onBlur={() => {
                    checkEndRangeHandler()
                    rangeMustBeUnique()
                  }}
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <h3 className='text-xl font-medium w-44 text-gray-900 dark:text-white'>
                Price :
              </h3>
              <input
                type='text'
                placeholder='Price'
                value={price}
                onChange={(e) => {
                  ONLY_FLOATING_POINT_HANDLER(e)

                  if (+e.target.value > 999999) {
                    toast.warning('Price should not be more than 999999', {
                      id: 'price',
                    })
                    e.target.value = e.target.value.slice(0, -1)
                  }

                  setPrice(e.target.value)
                }}
                required
              />
            </div>

            <Button
              type='button'
              onClick={addVariable}
              disabled={isButtonDisabled}
            >
              Add
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}
