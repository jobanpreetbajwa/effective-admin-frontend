import { useRef } from 'react'
import { toast } from 'sonner'
import { Label, Radio, TextInput } from 'flowbite-react'
import { ONLY_NUMBERS_HANDLER } from '../../../../utilis/regex'
import {
	ADD_PRODUCT_ACTION_TYPE,
	DETAILS_PRODUCT_ACTION_TYPE,
} from '../../../../staticData/constantActions'

export default function MoreFields({ productData, action }) {
	const minNumRef = useRef(null)
	const maxNumRef = useRef(null)

	return (
		<div className='grid grid-cols-4 md:grid-cols-6 gap-4'>
			<div className='col-span-4 md:col-span-2'>
				{/* Min Order Quantity */}
				<div className='col-span-3'>
					<label
						htmlFor='min_order_quantity'
						className='mt-4 block font-light leading-6 text-gray-900'
					>
						Minimum Order Quantity
					</label>

					<TextInput
						ref={minNumRef}
						id='min_order_quantity'
						name='min_order_quantity'
						placeholder='Min Order Quantity'
						disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
						defaultValue={productData ? productData?.min_order_quantity : ''}
						onChange={(e) => {
							ONLY_NUMBERS_HANDLER(e)

							if (+e.target.value > 999999) {
								toast.warning(
									'Minimum Order Quantity  should not be more than 999999',
									{
										id: 'min_order_quantity',
									}
								)
								e.target.value = e.target.value.slice(0, -1)
							}
						}}
						onBlur={(e) => {
							if (+maxNumRef.current.value <= +e.target.value) {
								if (+maxNumRef.current.value === 0) {
								} else {
									toast.error(
										'Min Order Quantity should be less than Max Order Quantity'
									)

									minNumRef.current.value = ''
								}
							}
						}}
					/>
				</div>

				{/* Max Order Quantity */}
				<div className='col-span-3'>
					<label
						htmlFor='max_order_quantity'
						className='mt-4 block font-light leading-6 text-gray-900'
					>
						Maximum Order Quantity
					</label>

					<TextInput
						ref={maxNumRef}
						id='max_order_quantity'
						name='max_order_quantity'
						placeholder='Max Order Quantity'
						disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
						defaultValue={productData ? productData?.max_order_quantity : ''}
						onChange={(e) => {
							ONLY_NUMBERS_HANDLER(e)

							if (+e.target.value > 999999) {
								toast.warning(
									'Maximum Order Quantity should not be more than 999999',
									{
										id: 'max_order_quantity',
									}
								)
								e.target.value = e.target.value.slice(0, -1)
							}
						}}
						onBlur={(e) => {
							if (+minNumRef.current.value >= +e.target.value) {
								if (+minNumRef.current.value === 0 && +e.target.value === 0) {
								} else {
									toast.error(
										'Max Order Quantity should be greater than Min Order Quantity'
									)
									maxNumRef.current.value = ''
								}
							}
						}}
					/>
				</div>

				{/* Individual Shipping Cost */}
				{/* <div>
					<label
						htmlFor='shipping_cost'
						className='mt-4 block font-light leading-6 text-gray-900'
					>
						Individual Shipping Cost
					</label>

					<TextInput
						name='shipping_cost'
						disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
						onChange={(e) => {
							ONLY_FLOATING_POINT_HANDLER(e)

							if (+e.target.value > 999999) {
								toast.warning('Shipping Cost should not be more than 999999', {
									id: 'shipping_cost',
								})
								e.target.value = e.target.value.slice(0, -1)
							}
						}}
						defaultValue={productData ? productData?.shipping_cost : ''}
						id='shipping_cost'
						placeholder='Shipping Cost'
					/>
				</div> */}
			</div>

			{/* <div className='grid col-span-4 md:col-span-2 mt-2 gap-4 h-32 '> */}

			{/* COD */}
			{/* <div className='border px-4 py-3 rounded'>
					<p className='font-bold'>Allow COD</p>
					<fieldset className='my-2 flex max-w-md gap-4'>
						<div className='flex items-center gap-2'>
							<Radio
								id='enable-COD'
								name='cod'
								disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
								defaultChecked={productData && productData?.cod}
								value='true'
							/>
							<Label
								htmlFor='enable-COD'
								disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
							>
								Enabled
							</Label>
						</div>
						<div className='flex items-center gap-2'>
							<Radio
								id='disable-COD'
								name='cod'
								disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
								defaultChecked={productData && !productData?.cod}
								value='false'
							/>
							<Label
								htmlFor='disable-COD'
								disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
							>
								Disabled
							</Label>
						</div>
					</fieldset>
				</div> */}

			{/* Refundable */}
			{/* <div className='border px-4 py-3 rounded '>
					<p className='font-bold'>Is Product Refundable</p>
					<fieldset className='my-2 flex max-w-md gap-4'>
						<div className='flex items-center gap-2'>
							<Radio
								id='refundable'
								name='refund'
								disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
								//check if state is available and if it is then check if refund is available
								defaultChecked={productData && productData?.refund}
								value='true'
							/>

							<Label
								htmlFor='refundable'
								disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
							>
								Refundable
							</Label>
						</div>
						<div className='flex items-center gap-2'>
							<Radio
								id='non-refundable'
								name='refund'
								disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
								defaultChecked={productData && !productData?.refund}
								value='false'
							/>
							<Label
								htmlFor='non-refundable'
								disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
							>
								Non-Refundable
							</Label>
						</div>
					</fieldset>
				</div> */}
			{/* </div> */}
		</div>
	)
}
