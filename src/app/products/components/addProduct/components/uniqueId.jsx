import { TextInput, Label } from 'flowbite-react'
import {
	ADD_PRODUCT_ACTION_TYPE,
	DETAILS_PRODUCT_ACTION_TYPE,
} from '../../../../staticData/constantActions'

export default function UniqueId({ action, productData }) {
	return (
		<div className='col-span-full flex justify-between'>
			<div className='col-span-6 md:col-span-3'>
				<div className='mb-2 block'>
					<Label htmlFor='unique_id' value='Unique ID' />
				</div>

				<TextInput
					id='unique_id'
					maxLength={20}
					className='w-96'
					placeholder='Unique ID'
					disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
					defaultValue={productData ? productData?.unique_id : ''}
				/>
			</div>
		</div>
	)
}
