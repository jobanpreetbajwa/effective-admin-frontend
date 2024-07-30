import { Button, Modal } from 'flowbite-react'

export default function DeleteReviewModal({
	onDeleteReview,
	showDeleteReviewModal,
	setShowDeleteReviewModal,
}) {
	function onCloseModal() {
		setShowDeleteReviewModal(false)
	}

	return (
		<Modal
			show={showDeleteReviewModal}
			size='xl'
			onClose={onCloseModal}
			dismissible
			popup
			onClick={(e) => {
				e.stopPropagation()
			}}
		>
			<Modal.Header className='p-6'>
				<h3 className='text-xl font-medium text-gray-900 dark:text-white'>
					Delete Review?
				</h3>
			</Modal.Header>
			<Modal.Body>
				<div className='space-y-6'>
					<div>
						<h2>Are you sure you want to delete this review ?</h2>
					</div>
					<div className='flex gap-3 justify-start'>
						<Button onClick={onDeleteReview} color={'failure'}>
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
