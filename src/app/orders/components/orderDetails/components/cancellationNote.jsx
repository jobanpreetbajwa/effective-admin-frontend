import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Alert, FloatingLabel, Button } from 'flowbite-react'
import { HiInformationCircle } from 'react-icons/hi'
import { singleOrderStatus } from '../../../../../api/function'
export default function CancellationNote({ orderDetails }) {
  const noteAvailable =
    orderDetails?.cancellation_reason?.length ||
    orderDetails?.cancellation_reason

  const [showEditNote, setShowEditNote] = useState(false)
  const [defaultValue, setDefaultValue] = useState(
    orderDetails?.cancellation_reason
  )
  const [note, setNote] = useState(orderDetails?.cancellation_reason)

  useEffect(() => {
    setNote(orderDetails?.cancellation_reason)
  }, [orderDetails])

  const handleAddNote = () => {
    singleOrderStatus
    const promise = singleOrderStatus({
      orderID: orderDetails?.orderId,
      data: { cancellation_reason: note },
    })
      .then((response) => {
        setNote(response?.data?.cancellation_reason)
        setDefaultValue(response?.data?.cancellation_reason)
        setShowEditNote(false)
      })
      .catch((error) => {
        console.error(error)
      })

    toast.promise(promise, {
      loading: noteAvailable ? 'Updating...' : 'Adding...',
      success: () => {
        return `${noteAvailable ? 'Updated' : 'Added'} Reason For Cancellation`
      },
      error: 'Error',
    })
  }

  return (
    <>
      {showEditNote ? (
        <div className='bg-gray-100 rounded p-4'>
          <FloatingLabel
            variant='filled'
            label='Add a note'
            value={note}
            onChange={(e) => {
              setNote(e.target.value.trim())
            }}
          />

          <div className='flex mt-2 gap-2'>
            <Button
              color='success'
              disabled={note ? false : true}
              onClick={note ? handleAddNote : null}
            >
              Add Note
            </Button>
            <Button
              color='gray'
              onClick={() => {
                setShowEditNote(false)
                if (noteAvailable) {
                  setNote(defaultValue)
                }
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Alert
          additionalContent={note ? note : 'No note available'}
          color='success'
          icon={HiInformationCircle}
          rounded
        >
          <div className='flex'>
            <h3 className='mr-2'>Reason For Cancellation: </h3>
            <button
              onClick={() => setShowEditNote(true)}
              className='text-black'
            >
              Edit
            </button>
          </div>
        </Alert>
      )}
    </>
  )
}
