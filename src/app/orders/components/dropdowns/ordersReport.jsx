import { Dropdown } from 'flowbite-react/components/Dropdown'

import { MdCancel } from 'react-icons/md'
import { FcShipped } from 'react-icons/fc'
import { GrInProgress } from 'react-icons/gr'
import { MdAssignmentReturned } from 'react-icons/md'
import { AiOutlineDeliveredProcedure } from 'react-icons/ai'

export default function OrdersReportDropDown() {
	return (
		<Dropdown label='Orders Report' outline>
			<Dropdown.Item icon={GrInProgress}>Pending</Dropdown.Item>
			<Dropdown.Item icon={AiOutlineDeliveredProcedure}>
				Delivered
			</Dropdown.Item>
			<Dropdown.Item icon={FcShipped}>Shipped</Dropdown.Item>
			<Dropdown.Item icon={MdAssignmentReturned}>Returned</Dropdown.Item>
			<Dropdown.Item icon={MdCancel}>Cancelled</Dropdown.Item>
		</Dropdown>
	)
}
