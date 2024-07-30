import { useState } from 'react'
import MessagesOnOrderStatus from './messagesOnOrderStatus'
import BroadCast from './broadCast'

export default function Messages() {
	const [activeTab, setActiveTab] = useState(0)

	return (
		<div className='w-full flex flex-col p-4 gap-2'>
			<div className='w-full drop-shadow-md'>
				<div
					className='grid max-w-xs grid-cols-2 gap-1 p-1 mx-auto my-2 bg-gray-100 rounded-lg'
					role='group'
				>
					<button
						type='button'
						className={`px-5 py-1.5 text-xs font-medium text-gray-900 rounded-lg ${
							activeTab === 0 ? 'bg-[#0E7490] text-white' : 'hover:bg-gray-200'
						}`}
						onClick={() => setActiveTab(0)}
					>
						Order Status
					</button>

					<button
						type='button'
						className={` transition-all duration-75 px-5 py-1.5 text-xs font-medium dark:text-gray-900 rounded-lg ${
							activeTab === 1 ? 'bg-[#0E7490] text-white' : 'hover:bg-gray-200'
						}`}
						onClick={() => setActiveTab(1)}
					>
						Broadcast
					</button>
				</div>
			</div>

			<div>{activeTab === 0 ? <MessagesOnOrderStatus /> : <BroadCast />}</div>
		</div>
	)
}
