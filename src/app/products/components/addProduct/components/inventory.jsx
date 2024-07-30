import { toast } from 'sonner'
import { Label, Radio, TextInput } from 'flowbite-react'

import { ONLY_NUMBERS_HANDLER } from '../../../../utilis/regex'
import { DETAILS_PRODUCT_ACTION_TYPE } from '../../../../staticData/constantActions'

export default function InventoryComponent({
	action,
	productData,
	limited_availability,
	setLimited_availability,
	inventoryAvailable,
	setInventoryAvailable,
}) {
	return (
		<div className='sm:col-span-full border-b pb-6'>
			<h2 className='text-base font-semibold leading-7 text-gray-900'>
				Inventory Management
			</h2>

			<fieldset className='my-4 flex max-w-md gap-4'>
				<div
					className='flex items-center gap-2'
					onClick={() => {
						action === DETAILS_PRODUCT_ACTION_TYPE
							? ''
							: setInventoryAvailable(true)
					}}
				>
					<Radio
						value='true'
						id='always_available'
						name='inventory_available'
						checked={inventoryAvailable}
						disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
					/>
					<Label
						htmlFor='always_available'
						disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
					>
						Always Available
					</Label>
				</div>

				<div
					className='flex items-center gap-2'
					onClick={() => {
						action === DETAILS_PRODUCT_ACTION_TYPE
							? ''
							: setInventoryAvailable(false)
					}}
				>
					<Radio
						value='false'
						id='limited_availability'
						name='inventory_available'
						checked={!inventoryAvailable}
						disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
					/>

					<Label
						htmlFor='limited_availability'
						disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
					>
						Limited Availability
					</Label>
				</div>
			</fieldset>

			{/* Show Limited Availability Field */}
			{!inventoryAvailable && (
				<>
					<label
						htmlFor='prod_quantity'
						className='mt-4 block text-sm font-medium leading-6 text-gray-900'
					>
						Limited Quantity
						<span className='text-rose-500'>*</span>
					</label>

					<div className='flex gap-4 items-center '>
						<TextInput
							id='prod_quantity'
							name='prod_quantity'
							required={!inventoryAvailable}
							placeholder='Enter Limited Quantity'
							disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
							defaultValue={productData && productData?.prod_quantity}
							onChange={(e) => {
								ONLY_NUMBERS_HANDLER(e)

								if (+e.target.value > 999999) {
									toast.warning('Quantity should not be more than 999999', {
										id: 'quantity',
									})
									e.target.value = e.target.value.slice(0, -1)
								}
							}}
						/>
					</div>
				</>
			)}
		</div>
	)
}
