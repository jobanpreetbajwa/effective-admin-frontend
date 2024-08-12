import ToggleSwitch from '../../components/toggleSwitch'

export default function OrderSettings({ formData, handleInputChange }) {
	const handleCheckboxChange = (e) => {
		handleInputChange({
			target: {
				name: e.target.name,
				value: e.target.checked ? 1 : 0,
			},
		})
	}

	return (
		<div className='p-4 sm:p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700  dark:bg-gray-800'>
			<div className='h-fit'>
				<h3 className='mb-4 text-xl font-semibold dark:text-white'>
					Orders Allowed
				</h3>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='col-span-1'>
						<ToggleSwitch
							name='orders_allowed'
							label={formData?.orders_allowed ? 'Enabled' : 'Disabled'}
							checked={formData?.orders_allowed ? true : false}
							onChange={handleCheckboxChange}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
