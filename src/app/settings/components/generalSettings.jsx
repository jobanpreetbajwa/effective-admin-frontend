import { TextInput } from 'flowbite-react'
import { ONLY_NUMBERS_HANDLER } from '../../utilis/regex'

export default function GeneralSettings({ formData, handleInputChange }) {
	return (
		<div className='p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-fit'>
			<h3 className='mb-4 text-xl font-semibold dark:text-white'>
				General Settings
			</h3>

			<div className='grid grid-cols-6 gap-6'>
				<div className='col-span-6'>
					<label
						htmlFor=''
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
					>
						Currency
					</label>

					<div className='uppercase'>{formData && formData?.currency}</div>
				</div>

				{/* Set Tax Rate */}
				<div className='col-span-6 '>
					<label
						htmlFor='set_tax_rate'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
					>
						Set Tax Rate
					</label>
					<TextInput
						id='set_tax_rate'
						name='set_tax_rate'
						placeholder='Tax Rate'
						value={formData?.set_tax_rate}
						onChange={(event) => {
							// Allow only numbers
							ONLY_NUMBERS_HANDLER(event)

							// Update the State
							handleInputChange(event)
						}}
					/>
				</div>

				<div className='col-span-6'>
					<label
						htmlFor='gst_number'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
					>
						Add GST Number
					</label>
					<TextInput
						maxLength={15}
						id='gst_number'
						name='gst_number'
						placeholder='Your GST Number'
						value={formData?.gst_number}
						onChange={handleInputChange}
					/>
				</div>
			</div>
		</div>
	)
}
