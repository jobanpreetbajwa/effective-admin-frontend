import { Modal, Button } from 'flowbite-react'

export default function TagDeleteModal({
	name,
	deleteFunction,
	setAskConfirmation,
}) {
	const deleteHandler = () => {
		deleteFunction()
		setAskConfirmation()
	}
	return (
		<Modal
			show={true}
			size='xl'
			onClose={() => setAskConfirmation(false)}
			dismissible
			popup
		>
			<Modal.Header className='p-6'>Delete Collection?</Modal.Header>
			<Modal.Body>
				<div className='space-y-6'>
					<div>
						<h2>Are you sure you want to delete {`'${name}'?`}</h2>
						<h2 className='text-rose-600 font-semibold'>
							Note: This will delete tag from all the associative products
							inside the collection
						</h2>
					</div>
					<div className='flex gap-3 justify-start'>
						<Button onClick={deleteHandler} color='failure'>
							Yes,Delete
						</Button>
						<Button onClick={() => setAskConfirmation(false)} outline>
							Cancel
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	)
}
