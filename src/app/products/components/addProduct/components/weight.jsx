import { toast } from 'sonner'
import { TextInput, Label } from 'flowbite-react'
import { ONLY_NUMBERS_HANDLER } from '../../../../utilis/regex'
import { DETAILS_PRODUCT_ACTION_TYPE } from '../../../../staticData/constantActions'

export default function WeightComponent({ productData, action }) {
	return (
		<div className='sm:col-span-full border-b pb-6'>
			<h2 className='text-base font-semibold leading-7 text-gray-900'>
				Weight
			</h2>

			<Label htmlFor='weight' className='mt-4 block w-fit'>
				Product weight in Kilograms
			</Label>

			<div className='flex gap-4 items-center mt-2'>
				<TextInput
					id='weight'
					name='weight'
					placeholder='Enter weight in Kgs'
					disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
					defaultValue={productData ? productData?.weight : ''}
					onChange={(e) => {
						ONLY_NUMBERS_HANDLER(e)

						if (+e.target.value > 999999) {
							toast.warning('Weight should not be more than 999999', {
								id: 'weight',
							})
							e.target.value = e.target.value.slice(0, -1)
						}
					}}
				/>
			</div>
		</div>
	)
}
