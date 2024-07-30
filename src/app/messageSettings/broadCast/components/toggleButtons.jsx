import { Table } from 'flowbite-react'

import ToggleSwitch from '../../../components/toggleSwitch'

export default function ToggleButtons({ broadCastTo, setBroadCastTo }) {
	return (
		<div className='w-1/2 flex flex-col gap-3'>
			<Table className='text-black w-full'>
				<Table.Head className=''>
					<Table.HeadCell className='px-2 pl-6 '>Notification</Table.HeadCell>
					<Table.HeadCell>SMS</Table.HeadCell>
					<Table.HeadCell>Whatsapp</Table.HeadCell>
				</Table.Head>

				<Table.Body>
					<Table.Row className=''>
						<Table.Cell className='flex justify-center'>
							<ToggleSwitch
								name='notification'
								checked={broadCastTo.notification}
								onChange={(event) => {
									setBroadCastTo({
										...broadCastTo,
										[event.target.name]: event.target.checked,
									})
								}}
							/>
						</Table.Cell>

						<Table.Cell className='self-center'>
							<ToggleSwitch
								name='sms'
								checked={broadCastTo.sms}
								onChange={(event) => {
									setBroadCastTo({
										...broadCastTo,
										[event.target.name]: event.target.checked,
									})
								}}
							/>
						</Table.Cell>

						<Table.Cell className='pl-8'>
							<ToggleSwitch
								name='whatsapp'
								checked={broadCastTo.whatsapp}
								onChange={(event) => {
									setBroadCastTo({
										...broadCastTo,
										[event.target.name]: event.target.checked,
									})
								}}
							/>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table>
		</div>
	)
}
