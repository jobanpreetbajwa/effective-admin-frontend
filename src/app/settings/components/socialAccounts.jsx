import { TextInput } from 'flowbite-react'
import { FaInstagram, FaFacebook } from 'react-icons/fa'

export default function SocialAccounts({ formData, handleInputChange }) {
	return (
		<div className='p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
			<div className='flow-root'>
				<h3 className='text-xl font-semibold dark:text-white'>
					Social Accounts
				</h3>

				<ul className='divide-y divide-gray-200 dark:divide-gray-700'>
					{/* Facebook */}
					<li className='py-4'>
						<div className='flex items-center space-x-4'>
							<FaFacebook size={24} />

							<div className='flex-1 min-w-0'>
								<div className='col-span-6 '>
									<label
										htmlFor='facebook_link'
										className='mb-2 block text-base font-semibold text-gray-900 truncate dark:text-white'
									>
										Facebook Account
									</label>
									<TextInput
										id='facebook_link'
										name='facebook_link'
										placeholder='Facebook'
										onChange={handleInputChange}
										value={formData?.facebook_link}
									/>
								</div>
							</div>
						</div>
					</li>

					{/* Instagram */}
					<li className='py-4'>
						<div className='flex items-center space-x-4'>
							<FaInstagram size={24} />

							<div className='flex-1 min-w-0'>
								<div className='col-span-6 '>
									<label
										htmlFor='insta_link'
										className='mb-2 block text-base font-semibold text-gray-900 truncate dark:text-white'
									>
										Instagram Account
									</label>
									<TextInput
										id='insta_link'
										name='insta_link'
										placeholder='Instagram'
										value={formData?.insta_link}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	)
}
