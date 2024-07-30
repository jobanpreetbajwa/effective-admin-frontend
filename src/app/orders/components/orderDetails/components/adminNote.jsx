import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { addAdminNote } from '../../../../../api/function'
import { Alert, FloatingLabel, Button } from 'flowbite-react'

import { HiInformationCircle } from 'react-icons/hi'

export default function AdminNote({ orderDetails }) {
	const noteAvailable = orderDetails?.admin_note?.length

	const [showEditNote, setShowEditNote] = useState(!!noteAvailable)

	const [note, setNote] = useState(orderDetails?.admin_note)

	useEffect(() => {
		setNote(orderDetails?.admin_note)
	}, [orderDetails])

	const handleAddNote = () => {
		const promise = addAdminNote({
			orderID: orderDetails?.orderId,
			data: { note },
		})
			.then((response) => {
				setNote(response?.data?.admin_note)
				setShowEditNote(false)
			})
			.catch((error) => {
				console.error(error)
			})

		toast.promise(promise, {
			loading: noteAvailable ? 'Updating...' : 'Adding...',
			success: () => {
				return `${noteAvailable ? 'Updated' : 'Added'} Admin Note`
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
						helperText='This is private and not shared with the customer'
						value={note}
						onChange={(e) => {
							setNote(e.target.value)
						}}
					/>

					<div className='flex mt-2 gap-2'>
						<Button color='success' onClick={handleAddNote}>
							Add Note
						</Button>
						<Button color='gray' onClick={() => setShowEditNote(false)}>
							Cancel
						</Button>
					</div>
				</div>
			) : (
				<Alert
					additionalContent={note ? note : 'No note available'}
					color='success'
					icon={HiInformationCircle}
					// onDismiss={() => setShowEditNote(true)}
					rounded
				>
					<div className='flex'>
						<h3 className='mr-2'>Admin Note : </h3>
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
