import { useState } from 'react'
import { Button } from 'flowbite-react'
import TextEditorModal from './textEditorModal'

export default function StorePolicies({ formData, handleInputChange }) {
	// name to show in the Text Editor Header
	const [name, setName] = useState(null)

	// text input to edit
	const [textInput, setTextInput] = useState(null)

	// show/hide Text Editor Modal
	const [showTextEditorModal, setShowTextEditorModal] = useState(false)

	return (
		<div className='p-4 sm:p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700  dark:bg-gray-800'>
			{showTextEditorModal && (
				<TextEditorModal
					name={name}
					value={formData[textInput]}
					showTextEditorModal={showTextEditorModal}
					setShowTextEditorModal={setShowTextEditorModal}
					onChange={(value) => {
						// update the form data with the new value from the text editor behaves like a controlled component eg. (event.target.value)
						handleInputChange({
							target: {
								name: textInput,
								value,
							},
						})
					}}
				/>
			)}
			<div className='h-fit'>
				<h3 className='mb-4 text-xl font-semibold dark:text-white'>
					Store Policies
				</h3>

				<div className='grid grid-cols-9 gap-6'>
					{/* Privacy Policy */}
					<div className='col-span-9 sm:col-span-3'>
						<label
							htmlFor='privacy_policy'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
						>
							Privacy Policy
						</label>

						<Button
							className='w-28'
							onClick={() => {
								setName('Privacy Policy')
								setTextInput('privacy_policy')
								setShowTextEditorModal(true)
							}}
						>
							{formData?.privacy_policy?.length ? 'Edit' : 'Add'}
						</Button>
					</div>

					{/* Return Policy */}
					<div className='col-span-9 sm:col-span-3'>
						<label
							htmlFor='return_policy'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
						>
							Return Policy
						</label>

						<Button
							className='w-28'
							onClick={() => {
								setName('Return Policy')
								setTextInput('return_policy')
								setShowTextEditorModal(true)
							}}
						>
							{formData?.return_policy?.length ? 'Edit' : 'Add'}
						</Button>
					</div>

					{/* Shipping Policy */}
					<div className='col-span-9 sm:col-span-3'>
						<label
							htmlFor='shipping_policy'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
						>
							Shipping Policy
						</label>

						<Button
							className='w-28'
							onClick={() => {
								setName('Shipping Policy')
								setTextInput('shipping_policy')
								setShowTextEditorModal(true)
							}}
						>
							{formData?.shipping_policy?.length ? 'Edit' : 'Add'}
						</Button>
					</div>

					{/* Terms & Conditions */}
					<div className='col-span-9 sm:col-span-3'>
						<label
							htmlFor='terms_conditions'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
						>
							Terms & Conditions
						</label>

						<Button
							className='w-28'
							onClick={() => {
								setName('Terms & Conditions')
								setTextInput('terms_conditions')
								setShowTextEditorModal(true)
							}}
						>
							{formData?.terms_conditions?.length ? 'Edit' : 'Add'}
						</Button>
					</div>

					{/* Payment Policy */}
					<div className='col-span-9 sm:col-span-3'>
						<label
							htmlFor='payment_policy'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
						>
							Payment Policy
						</label>

						<Button
							className='w-28'
							onClick={() => {
								setName('Payment Policy')
								setTextInput('payment_policy')
								setShowTextEditorModal(true)
							}}
						>
							{formData?.payment_policy?.length ? 'Edit' : 'Add'}
						</Button>
					</div>

					{/* About Us */}
					<div className='col-span-9 sm:col-span-3'>
						<label
							htmlFor='about_us'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
						>
							About Us
						</label>

						<Button
							className='w-28'
							onClick={() => {
								setName('About Us')
								setTextInput('about_us')
								setShowTextEditorModal(true)
							}}
						>
							{formData?.about_us?.length ? 'Edit' : 'Add'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
