import { TextInput, Label, Radio } from 'flowbite-react'

import { capitalizeFirstLetter } from '../../../../../utils/function'

import {
	ADD_PRODUCT_ACTION_TYPE,
	DETAILS_PRODUCT_ACTION_TYPE,
} from '../../../../staticData/constantActions'

export default function NameAndStatusComponent({ action, productData }) {
	return (
		<div className='col-span-full flex justify-between'>
			<div className='col-span-6 md:col-span-3'>
				<div className='mb-2 block'>
					<Label htmlFor='name' value='Product Name' />
					<span className='text-rose-600 cursor-default'>*</span>
				</div>

				<TextInput
					required
					id='name'
					type='text'
					maxLength={50}
					className='w-96'
					placeholder='Product Name'
					disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
					defaultValue={productData ? productData?.name : ''}
					onBlur={(e) =>
						(e.target.value = capitalizeFirstLetter(e.target.value))
					}
				/>
			</div>

			{/* Product Status */}
			<div className='w-64 h-fit col-span-6 md:col-span-3 border px-4 py-2 rounded'>
				<h2 className='text-base font-semibold leading-7 text-gray-900'>
					Product Status
				</h2>

				<fieldset className='my-2 flex max-w-md gap-4'>
					<div className='flex items-center gap-2'>
						<Radio
							value='true'
							name='prod_status'
							id='prod_status_visible'
							disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
							defaultChecked={
								action === ADD_PRODUCT_ACTION_TYPE
									? true
									: productData && productData?.prod_status
							}
						/>
						<Label
							htmlFor='prod_status_visible'
							disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
						>
							Visible
						</Label>
					</div>
					<div className='flex items-center gap-2'>
						<Radio
							value='false'
							name='prod_status'
							id='prod_status_hidden'
							disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
							defaultChecked={
								action === ADD_PRODUCT_ACTION_TYPE
									? false
									: productData && !productData?.prod_status
							}
						/>
						<Label
							htmlFor='prod_status_hidden'
							disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
						>
							Hidden
						</Label>
					</div>
				</fieldset>
			</div>
		</div>
	)
}
