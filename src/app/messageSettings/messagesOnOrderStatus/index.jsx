import { toast } from 'sonner'
import { Button, Table } from 'flowbite-react'
import { useState, useCallback, useEffect } from 'react'

import ToggleSwitch from '../../components/toggleSwitch'
import { ORDER_STATUS_INDICATOR } from '../../orders/utils/constants'
import { MessageModal } from '../broadCast/components/messageModal'
import {
	getOrderStatusMessageData,
	postOrderStatusMessageData,
} from '../../../api/function'

import { GoPencil } from 'react-icons/go'

export default function MessagesOnOrderStatus() {
	const [index, setIndex] = useState(null)
	const [formData, setFormData] = useState([])
	const [openModal, setOpenModal] = useState(false)

	useEffect(() => {
		// fetch messages from backend
		getOrderStatusMessageData()
			.then((result) => setFormData(result.data))
			.catch((error) => {
				toast.error('Something went wrong!')
			})
	}, [])

	const postMessages = useCallback(async ({ orderStatus }) => {
		const data = {
			notification: orderStatus?.notification,
			sms: orderStatus?.sms,
			whatsapp: orderStatus?.whatsapp,
			message: orderStatus?.message,
		}

		return postOrderStatusMessageData({ data, id: orderStatus?._id })
			.then((result) => setFormData(result?.data))
			.catch((error) => {
				console.log(error)
				toast.error('Something went wrong!')
			})
	}, [])

	const handleToggleButtons = (e, index) => {
		const newData = formData.map((data, i) => {
			if (i === index) {
				return { ...data, [e.target.name]: e.target.checked }
			}
			return data
		})

		setFormData(newData)
		postMessages({ orderStatus: newData[index], index })
	}

	const handleStatusMessage = () => {
		postMessages({ orderStatus: formData[index] }).then(() => {
			toast.success('Message Updated Successfully!')
			setOpenModal(false)
		})
	}

	return (
		<>
			{openModal && (
				<MessageModal
					index={index}
					openModal={openModal}
					setOpenModal={setOpenModal}
					orderStatus={formData}
					setOrderStatus={setFormData}
					handleStatusMessage={handleStatusMessage}
				/>
			)}
			<div className='w-full rounded border p-6'>
				{/* List */}
				<h1 className='font-semibold text-xl text-[#0E7490] mb-4'>
					Messages On Order Status Change
				</h1>

				<Table className='text-black w-full'>
					<Table.Head>
						<Table.HeadCell className='text-nowrap w-12'>
							Sr. No.
						</Table.HeadCell>
						<Table.HeadCell className='text-nowrap w-12'>
							<span>Order Status</span>
						</Table.HeadCell>
						<Table.HeadCell className='text-nowrap min-w-8 max-w-full'>
							Message
						</Table.HeadCell>
						<Table.HeadCell>Notification</Table.HeadCell>
						<Table.HeadCell>SMS</Table.HeadCell>
						<Table.HeadCell>Whatsapp</Table.HeadCell>
					</Table.Head>

					<Table.Body className='divide-y'>
						{Object.values(ORDER_STATUS_INDICATOR).map((status, index) => (
							<Table.Row key={index} formdata={formData[index]}>
								<Table.Cell className='border'>
									<span className='w-12 flex items-center justify-center'>
										{index + 1}
									</span>
								</Table.Cell>

								<Table.Cell className='border'>
									<span className='w-fit flex gap-6 text-nowrap'>{status}</span>
								</Table.Cell>

								<Table.Cell className='border'>
									<div className='min-w-20 w-full flex gap-4 items-center justify-between'>
										<span className='w-full text-pretty line-clamp-2'>
											{formData[index]?.message || 'No Message'}
										</span>

										<Button
											className='w-12 bg-[#d6ffd8]'
											size='xs'
											onClick={() => {
												setIndex(index)
												setOpenModal(true)
											}}
										>
											<GoPencil size={16} className='text-[#2b8724]' />
										</Button>
									</div>
								</Table.Cell>

								<Table.Cell className='self-center border'>
									<div className='w-20 flex items-center justify-center'>
										<ToggleSwitch
											name='notification'
											checked={formData[index]?.notification}
											onChange={(e) => handleToggleButtons(e, index)}
										/>
									</div>
								</Table.Cell>

								<Table.Cell className='border self-center'>
									<div className='w-20 flex items-center justify-center'>
										<ToggleSwitch
											name='sms'
											checked={formData[index]?.sms}
											onChange={(e) => handleToggleButtons(e, index)}
										/>
									</div>
								</Table.Cell>

								<Table.Cell className='border'>
									<div className='w-20 flex items-center justify-center'>
										<ToggleSwitch
											name='whatsapp'
											checked={formData[index]?.whatsapp}
											onChange={(e) => handleToggleButtons(e, index)}
										/>
									</div>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>

				{/* Message Field To Send */}
				{/* <div className='w-full py-6 h-full'>
							<Textarea
								className='h-32 resize-none'
								placeholder='Updated Status Message'
								value={textAreaValue?.message}
								onChange={(event) => {
									setTextAreaValue({
										...textAreaValue,
										message: event.target.value,
									})
								}}
							/>
							<Button
								className='mt-4'
								disabled={!textAreaValue?.message}
								onClick={handleStatusMessage}
							>
								Update Message
							</Button>
						</div> */}
			</div>
		</>
	)
}
