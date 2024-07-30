import { Alert } from 'flowbite-react'
import { HiInformationCircle } from 'react-icons/hi'

export default function CustomerNote({ user_note }) {
	return (
		<Alert
			additionalContent={user_note?.length ? user_note : 'No note available'}
			color='warning'
			icon={HiInformationCircle}
			rounded
		>
			<h3>Customer Note : </h3>
		</Alert>
	)
}
