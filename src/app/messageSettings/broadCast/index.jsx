import { toast } from 'sonner'
import { useState } from 'react'
import ToggleButtons from './components/toggleButtons'
import { Button, Textarea } from 'flowbite-react'

import { broadcastMessage } from '../../../api/function'

import axios from 'axios'

export default function BroadCast() {
	const [text, setText] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [broadCastTo, setBroadCastTo] = useState({
		notification: false,
		sms: false,
		whatsapp: false,
	})
	// const getCustomerList = async () => {
	// 	try {
	// 		setIsLoading(true)
	// 		let response = null
	// 		response = await getCustomers(0, 0, 0)
	// 		const numbers = phoneNumbers(response.data.customers)

	// 		console.log(numbers)
	// 	} catch (error) {
	// 		console.log(error)
	// 		toast.error('Something Went Wrong.')
	// 	} finally {
	// 		setIsLoading(false)
	// 	}
	// }
	// useEffect(() => {
	// 	getCustomerList()
	// }, [])

	const recipients = [
		'919478426698',
		'919728009481',
		'918806430007',
		'918146995118',
		'916284184557',
	]

	// Access token
	const accessToken =
		'EAAUb2eZBxsNQBO0y0z7MK0Er5OyG7hmg72r6ZA2EhwlegAIWOlYE39j0x72qVI5QVUxy3hvnTBzOh0BTmdZAaH0nNlqITlOiJQZBSEvbLuc5luql6inVUMRH4DmBRw7YSU8aejtHZBRm0lvGLEUd36fnXCU2boMfpnZA8Nnj1lEhtcKVJZAQQiZCNyLt3oYrgjHNK0V1z6ZBiuJfqG4d3tSy5igFNwGIkGsO3xygDqZBga7VQZD'

	// Message template
	const messageTemplate = {
		messaging_product: 'whatsapp',
		to: 'phone_number',
		type: 'template',
		template: {
			name: 'welcome',
			language: {
				code: 'en_US',
			},
		},
	}

	// Function to send a message
	const sendMessage = async (recipient) => {
		const url = 'https://graph.facebook.com/v19.0/375963405589571/messages'
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		}

		const message = { ...messageTemplate, to: recipient }

		try {
			const response = await axios.post(url, message, { headers })

			console.log(
				`Message sent to ${recipient}, status code: ${response.status}`
			)
		} catch (error) {
			console.log(error)
			if (error.response && error.response.status === 429) {
				console.log('Rate limit exceeded, sleeping for 60 seconds')
				await new Promise((resolve) => setTimeout(resolve, 60000)) // Sleep for 60 seconds
				await sendMessage(recipient) // Retry sending the message
			} else {
				console.error(
					`Failed to send message to ${recipient}: ${error.message}`
				)
			}
		}
	}

	// Loop through each recipient and send the message with a delay
	const sendMessages = async () => {
		for (const recipient of recipients) {
			await sendMessage(recipient)
			//   await new Promise((resolve) => setTimeout(resolve, 1000)) // Delay for 1 second
		}
	}
	const broadCastText = async () => {
		try {
			const response = await broadcastMessage({ broadCastTo, text })
			console.log(await response.data)
			toast.success('successfully broadcasted')
			// sendMessages()
			setText('')
			setBroadCastTo({ notification: false, sms: false, whatsapp: false })
		} catch (error) {
			toast.error('something went wrong!')
		}
	}

	return (
		<div className='w-full rounded border'>
			<div className='flex flex-col gap-4 p-6'>
				<h1 className='font-semibold text-xl text-[#0E7490]'>BroadCast</h1>

				<ToggleButtons
					setBroadCastTo={setBroadCastTo}
					broadCastTo={broadCastTo}
				/>

				<span className='text-gray-500'>Broadcast Message</span>
				<Textarea
					className='w-1/2 h-40'
					id='broadcastText'
					name='broadcastText'
					value={text}
					placeholder='Write Your Message Here...'
					onChange={(e) => setText(e.target.value)}
				/>

				<Button
					type='button'
					disabled={
						broadCastTo?.notification ||
						broadCastTo?.sms ||
						broadCastTo?.whatsapp
							? text?.length
								? false
								: true
							: true
					}
					onClick={broadCastText}
					className='w-fit px-4'
				>
					Send
				</Button>
			</div>
		</div>
	)
}
