import { toast } from 'sonner'
import ToggleSwitch from '../../components/toggleSwitch'
import { Textarea } from 'flowbite-react'

export default function PaymentDetails({ formData, handleInputChange }) {
	// Function to check if all payment modes are disabled and show error
	const isAllClicked = (e) => {
		if (e.target.name === 'online_payment') {
			if (
				!e.target.checked &&
				!formData?.cash_on_delivery &&
				!formData?.settle_offline
			) {
				toast.error('You can not disable all payment modes', {
					id: 'all-payment-modes',
				})
				return true
			}
		}
		if (e.target.name === 'cash_on_delivery') {
			if (
				!formData?.online_payment &&
				!e.target.checked &&
				!formData?.settle_offline
			) {
				toast.error('You can not disable all payment modes', {
					id: 'all-payment-modes',
				})
				return true
			}
		}
		if (e.target.name === 'settle_offline') {
			if (
				!formData?.online_payment &&
				!formData?.cash_on_delivery &&
				!e.target.checked
			) {
				toast.error('You can not disable all payment modes', {
					id: 'all-payment-modes',
				})
				return true
			}
		}
		return false
	}

	// Function to handle the checkbox change
	const handleCheckboxChange = (e) => {
		// Check if all payment modes are disabled then set the checked value
		!isAllClicked(e) &&
			handleInputChange({
				target: {
					name: e.target.name,
					value: !formData?.[e.target.name] ? 1 : 0,
				},
			})
	}

	return (
		<div className='p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-fit'>
			<h3 className='mb-4 text-xl font-semibold dark:text-white'>
				Payment Modes
			</h3>

			<div className='grid grid-cols-6 gap-6'>
				{/* Online Payments */}
				<div className='col-span-6 px-3 py-4 bg-slate-100 rounded-lg'>
					<label className='flex items-center justify-between text-sm font-medium text-gray-900 dark:text-white'>
						Online Payments
						<ToggleSwitch
							name='online_payment'
							onChange={handleCheckboxChange}
							checked={formData?.online_payment}
						/>
					</label>

					<Textarea
						maxLength={180}
						className='mt-2'
						name='online_payment_desc'
						onChange={handleInputChange}
						value={formData?.online_payment_desc}
						placeholder='Online Payment Description'
					/>
				</div>

				{/* Cash On Delivery */}
				<div className='col-span-6 px-3 py-4 bg-slate-100 rounded-lg'>
					<label className='flex items-center justify-between text-sm font-medium text-gray-900 dark:text-white'>
						Cash On Delivery
						<ToggleSwitch
							name='cash_on_delivery'
							onChange={handleCheckboxChange}
							checked={formData?.cash_on_delivery}
						/>
					</label>
					<Textarea
						maxLength={180}
						className='mt-2'
						name='cash_on_delivery_desc'
						onChange={handleInputChange}
						value={formData?.cash_on_delivery_desc}
						placeholder='Cash On Delivery Description'
					/>
				</div>

				{/* Offline Payments */}
				<div className='col-span-6 px-3 py-4 bg-slate-100 rounded-lg'>
					<label className='flex items-center justify-between text-sm font-medium text-gray-900 dark:text-white'>
						Offline Settlement
						<ToggleSwitch
							name='settle_offline'
							onChange={handleCheckboxChange}
							checked={formData?.settle_offline}
						/>
					</label>
					<Textarea
						maxLength={180}
						className='mt-2'
						name='settle_offline_desc'
						onChange={handleInputChange}
						value={formData?.settle_offline_desc}
						placeholder='Offline Settlement Description'
					/>
				</div>
			</div>
		</div>
	)
}
