import { Button, Modal } from 'flowbite-react'

export default function BackConfirmation({ openModal, onConfirm }) {
	return (
		<Modal
			show={openModal}
			size='lg'
			onClose={() => onConfirm(false)}
			dismissible
			popup
		>
			<Modal.Header className='p-6'>
				You have unsaved changes.
				<br />
				Are you sure you want to leave this page?
			</Modal.Header>

			<Modal.Body>
				<div className='space-y-6'>
					<div className='flex justify-start gap-3'>
						<Button onClick={() => onConfirm(true)} className='w-24'>
							Yes
						</Button>
						<Button onClick={() => onConfirm(false)} className='w-24' outline>
							No
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	)
}
