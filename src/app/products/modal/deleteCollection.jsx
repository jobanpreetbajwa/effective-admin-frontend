import { toast } from 'sonner'
import { useState } from 'react'
import { Button, Modal } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'

import { editCategoryList } from '../../../store/slices/categoryList'
import { deleteCollection } from '../../../api/function'

export default function DeleteCollection({
  id,
  name,
  openModal,
  setOpenModal,
  searchedList,
  setSearchedList,
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)
  const { categoryID } = useParams()
  const categoryListSelector = useSelector((state) => state.categoryList)

  function onCloseModal() {
    setOpenModal(false)
  }

  //makes Api call to delete collection.
  const deleteHandler = () => {
    setIsDeleting(true)

    const promise = deleteCollection(id)
      .then((response) => {
        return response.data
      })
      .then((result) => {
        setIsDeleting(false)
        dispatch(editCategoryList(id))
        if (id === categoryID) {
          if (categoryListSelector.length === 1) {
            navigate('/products/' + categoryListSelector[0]?._id)
          } else {
            navigate('/products/')
          }
        }

        if (searchedList) {
          const tempList = Object.fromEntries(
            Object.entries(searchedList).filter(([key, value]) => key !== id)
          )
          console.log(tempList)
          setSearchedList(tempList)
        }
      })
      .catch((error) => {
        console.error('Error while deleting collection:', error)
        throw new Error('Error while deleting collection')
      })

    toast.promise(promise, {
      duration: 1000,
      loading: 'Loading...',
      success: () => {
        onCloseModal()
        return 'Collection deleted successfully'
      },
      error: (err) => {
        return err || 'Error while deleting collection'
      },
    })
  }

  return (
    <Modal show={openModal} size='xl' onClose={onCloseModal} dismissible popup>
      <Modal.Header className='p-6'>Delete Collection?</Modal.Header>
      <Modal.Body>
        <div className='space-y-6'>
          <div>
            <h2>Are you sure you want to delete {`'${name}'?`}</h2>
            <h2 className='text-rose-600 font-semibold'>
              Note: This will also delete all the products inside the collection
            </h2>
          </div>
          <div className='flex gap-3 justify-start'>
            <Button
              disabled={isDeleting ? true : false}
              onClick={isDeleting ? null : deleteHandler}
              color='failure'
            >
              Yes,Delete
            </Button>
            <Button onClick={onCloseModal} outline>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
