import { Label, Textarea } from 'flowbite-react'
import { DETAILS_PRODUCT_ACTION_TYPE } from '../../../../staticData/constantActions'

export default function DescriptionComponent({ productData, action }) {
	return (
		<div className='col-span-4'>
			<div className='mb-2 block'>
				<Label htmlFor='description' value='Product Description' />
			</div>
			<Textarea
				id='description'
				disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
				placeholder='Product Description...'
				defaultValue={productData ? productData?.description : ''}
				maxLength={1000}
			/>
		</div>
	)
}
