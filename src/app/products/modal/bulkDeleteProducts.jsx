import { Button, Modal } from 'flowbite-react'

export default function BulkDeleteProducts({
  openModal,
  setOpenModal,
  deleteHandler,

  isDeleting,
}) {
  function onCloseModal() {
    setOpenModal(false)
  }

  return (
    <Modal show={openModal} size='xl' onClose={onCloseModal} dismissible popup>
      <Modal.Header className='p-6'>
        <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
          Delete Products?
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className='space-y-6'>
          <div>
            <h2>Are you sure you want to delete </h2>
            <h2 className='text-rose-600 font-semibold'>
              Note: This will delete these products from the collection
            </h2>
          </div>
          <div className='flex gap-3 justify-start'>
            <Button
              disabled={isDeleting ? true : false}
              onClick={isDeleting ? null : deleteHandler}
              color='failure'
            >
              Yes, Delete
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
