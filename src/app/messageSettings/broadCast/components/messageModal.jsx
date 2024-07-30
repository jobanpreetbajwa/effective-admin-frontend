import { useState } from 'react'
import { Button, Modal, Textarea } from 'flowbite-react'
import { ORDER_STATUS_INDICATOR } from '../../../orders/utils/constants'

export function MessageModal({
	index,
	openModal,
	setOpenModal,
	orderStatus,
	setOrderStatus,
	handleStatusMessage,
}) {
	const [message, setMessage] = useState(orderStatus?.[index]?.message || '')

	function onCloseModal() {
		setOpenModal(false)
	}

	const handleSaveMessage = () => {
		// change the order status message with index
		const newOrderStatus = [...orderStatus]
		newOrderStatus[index].message = message

		setOrderStatus(newOrderStatus)
		handleStatusMessage()
	}

	return (
		<>
			<Modal show={openModal} size='xl' onClose={onCloseModal} popup>
				<Modal.Header>
					<h3 className='p-4 text-xl font-medium text-gray-900 dark:text-white'>
						Enter New Status Message for
						<span className='font-bold'>{` ${ORDER_STATUS_INDICATOR[index]} `}</span>
						orders
					</h3>
				</Modal.Header>
				<Modal.Body>
					<div className='space-y-6 p-1'>
						<Textarea
							required
							id='message'
							value={message}
							className='w-full h-52'
							placeholder='Status message'
							onChange={(event) => setMessage(event.target.value)}
						/>

						<div className='w-full flex gap-4'>
							<Button onClick={handleSaveMessage}>Save Message</Button>
							<Button outline onClick={onCloseModal}>
								Cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	)
}
