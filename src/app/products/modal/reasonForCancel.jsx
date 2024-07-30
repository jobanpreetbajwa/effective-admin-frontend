import { toast } from 'sonner'
import { useState } from 'react'
import { Button, Modal, TextInput } from 'flowbite-react'
import {
	addAdminNote,
	addAdminNoteForBulkOrders,
	changeBulkOrderStatus,
	singleOrderStatus,
} from '../../../api/function'

export default function ReasonForCancel({
	id,
	openModal,
	setOpenModal,
	reasonHandler,
}) {
	const [reason, setReason] = useState(null)

	function onCloseModal() {
		setOpenModal(false)
	}

	const handleReason = () => {
		let promise = null
		if (typeof id === 'string') {
			promise = singleOrderStatus({
				orderID: id,
				data: { cancellation_reason: reason },
			})
				.then((response) => {
					reasonHandler()
					setOpenModal(false)
				})
				.catch((error) => {
					console.error(error)
				})
		} else {
			const data = {
				orderIds: id,
				status: 2,
				msg: reason,
			}

			promise = changeBulkOrderStatus(data)
				.then(() => {
					reasonHandler()
				})
				.catch((error) => {
					console.error(error)
				})

			toast.promise(promise, {
				loading: 'Updating...',
				success: () => {
					return 'Updated'
				},
				error: 'Error',
			})
		}
	}

	return (
		<Modal show={openModal} size='xl' onClose={onCloseModal} dismissible popup>
			<Modal.Header className='p-6'>
				<h3 className='text-xl font-medium text-gray-900 dark:text-white'>
					Give Some Reason For Cancellation.
				</h3>
			</Modal.Header>
			<Modal.Body>
				<div className='space-y-6'>
					<TextInput
						placeholder='Reason'
						className='my-2'
						onChange={(e) => {
							setReason(e.target.value.trim())
						}}
					/>

					<div className='flex gap-3 justify-start'>
						<Button
							disabled={reason ? false : true}
							onClick={() => handleReason(reason)}
						>
							Done
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
