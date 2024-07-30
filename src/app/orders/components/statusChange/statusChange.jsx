import { useState } from 'react'
import { Dropdown } from 'flowbite-react'
import { MdCancel } from 'react-icons/md'
import { FcShipped } from 'react-icons/fc'
import { GrInProgress } from 'react-icons/gr'
import { RiProgress2Fill } from 'react-icons/ri'
import { MdAssignmentReturned } from 'react-icons/md'
import { AiOutlineDeliveredProcedure } from 'react-icons/ai'
import ReasonForCancel from '../../../products/modal/reasonForCancel'
import { changeBulkOrderStatus } from '../../../../api/function'
import { toast } from 'sonner'

export default function StatusChange({
	ids,
	setSelectedOrdersData,

	orders,
	setOrders,
	setAllOrdersSelected,
}) {
	const [showModal, setShowModal] = useState(false)

	const reasonHandler = () => {
		// update the status of the orders
		// search this order with the orderID and update the status

		const updatedOrders = orders?.map((item) => {
			if (ids.includes(item?._id)) {
				return { ...item, status: 2 }
			}
			return item
		})

		setOrders(updatedOrders)

		setShowModal(false)
	}

	const handleStatusChange = (status) => {
		const data = {
			orderIds: ids,
			status: status,
		}
		if (status !== 2) {
			data['msg'] = ''
		}
		setSelectedOrdersData([])

		const promise = changeBulkOrderStatus(data)
			.then((response) => {
				// update the status of the orders
				// search this order with the orderID and update the status

				const updatedOrders = orders?.map((item) => {
					if (ids.includes(item?._id)) {
						return { ...item, status }
					}
					return item
				})

				setOrders(updatedOrders)
				return status
			})
			.catch((error) => {
				console.error(error)
			})

		toast.promise(promise, {
			loading: 'Updating...',
			success: () => {
				setAllOrdersSelected(false)
				return 'Updated'
			},
			error: 'Error',
		})
	}

	return (
		<>
			{showModal ? (
				<ReasonForCancel
					id={ids}
					openModal={showModal}
					setOpenModal={setShowModal}
					reasonHandler={reasonHandler}
				/>
			) : null}

			<Dropdown
				label='Change Status'
				disabled={ids.length ? false : true}
				// color={STATUS_COLOR[orderStatus]}
				style={{ width: '160px' }}
				outline
			>
				<Dropdown.Item
					icon={GrInProgress}
					onClick={() => handleStatusChange(0)}
				>
					Pending
				</Dropdown.Item>

				<Dropdown.Item
					icon={RiProgress2Fill}
					onClick={() => handleStatusChange(5)}
				>
					In Progress
				</Dropdown.Item>
				<Dropdown.Item
					icon={MdAssignmentReturned}
					onClick={() => handleStatusChange(3)}
				>
					Shipped
				</Dropdown.Item>

				<Dropdown.Item
					icon={AiOutlineDeliveredProcedure}
					onClick={() => handleStatusChange(1)}
				>
					Delivered
				</Dropdown.Item>
				<Dropdown.Item icon={FcShipped} onClick={() => setShowModal(true)}>
					Cancelled
				</Dropdown.Item>
				<Dropdown.Item icon={MdCancel} onClick={() => handleStatusChange(4)}>
					Returned
				</Dropdown.Item>
			</Dropdown>
		</>
	)
}
