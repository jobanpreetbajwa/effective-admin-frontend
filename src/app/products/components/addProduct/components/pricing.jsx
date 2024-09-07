import { Label, TextInput, Radio } from 'flowbite-react'
import { FaPlus } from 'react-icons/fa6'
import { toast } from 'sonner'
import VariablePriceTable from './variablePriceTable'
import {
	ONLY_FLOATING_POINT_HANDLER,
	ONLY_NUMBERS_HANDLER,
} from '../../../../utilis/regex'
import { DETAILS_PRODUCT_ACTION_TYPE } from '../../../../staticData/constantActions'

export default function PricingComponent({
	action,
	productData,
	priceInputRef,
	showDiscountedPrice,
	setShowDiscountedPrice,
	setVariablePriceModal,
	variantData,
	variablePricing,
	setVariablePricing,
	setMaxRange,
	maxRange,
	isPricing,
	setIsPricing,
}) {
	return (
		<>
			<div className='flex'>
				<h2 className='text-base font-semibold leading-7 text-gray-900'>
					Pricing
				</h2>
			</div>

			<fieldset className='sm:col-span-full flex max-w-md flex-col gap-4'>
				<legend className='mb-4'>Pricing available to customer : </legend>
				<div className='flex gap-4'>
					<div className='flex items-center gap-2'>
						<Radio
							id='isPricingAvailableTrue'
							name='isPricingAvailable'
							value='true'
							checked={isPricing}
							disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
							onClick={() => setIsPricing(true)}
						/>
						<Label
							htmlFor='isPricingAvailableTrue'
							disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
						>
							Yes
						</Label>
					</div>
					<div className='flex items-center gap-2'>
						<Radio
							id='isPricingAvailableFalse'
							name='isPricingAvailable'
							value='false'
							checked={!isPricing}
							disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
							onClick={() => setIsPricing(false)}
						/>
						<Label
							htmlFor='isPricingAvailableFalse'
							disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
						>
							No
						</Label>
					</div>
				</div>
			</fieldset>

			<div className='sm:col-span-full flex items-center gap-4  pb-6'>
				<div>
					<div className='mb-2 block'>
						<Label htmlFor='mrp_price' value='Product Price' />
						<span className='text-rose-600 cursor-default'>*</span>
					</div>
					<div className='flex items-center gap-4'>
						<TextInput
							id='mrp_price'
							name='mrp_price'
							required
							defaultValue={productData ? productData?.mrp_price : ''}
							placeholder='0'
							ref={priceInputRef}
							disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
							onChange={(e) => {
								ONLY_FLOATING_POINT_HANDLER(e)

								if (+e.target.value > 999999) {
									toast.warning('Price should not be more than 999999', {
										id: 'price',
									})
									e.target.value = e.target.value.slice(0, -1)
								}
							}}
						/>
					</div>
				</div>
				<div className=''>
					<div className='mb-2 block'>
						<Label htmlFor='discounted_price' value='Discounted Price' />
					</div>
					<div className='flex items-center gap-4'>
						<TextInput
							id='discounted_price'
							name='discounted_price'
							disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
							defaultValue={productData ? productData?.discounted_price : ''}
							onChange={(e) => {
								ONLY_FLOATING_POINT_HANDLER(e)

								if (+e.target.value > 999999) {
									toast.warning(
										'Discounted price should not be more than 999999',
										{
											id: 'discounted_price',
										}
									)
									e.target.value = e.target.value.slice(0, -1)
								}
								if (
									parseInt(e.target.value) >
									parseInt(priceInputRef.current.value || 0)
								) {
									toast.warning(
										'Discounted price should be equal to or less than MRP price',
										{
											id: 'discounted_price',
										}
									)
									e.target.value = e.target.value.slice(0, -1)
								}
							}}
							placeholder='0'
							min={0}
						/>
					</div>
				</div>

				{/* <button
					disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
					className={`flex items-center justify-center font-semibold text-sm mt-8 ${
						action === DETAILS_PRODUCT_ACTION_TYPE
							? 'text-gray-300 hover:cursor-not-allowed'
							: 'text-blue-500'
					} ${
						variantData?.length
							? 'hover:cursor-not-allowed opacity-50 pointer-events-none'
							: ''
					}`}
					type='button'
					onClick={() => setVariablePriceModal(true)}
				>
					<FaPlus className='mr-1' /> Variable Price
				</button> */}
			</div>
			{/* <div className='sm:col-span-full border-b'>
				{variablePricing?.length ? (
					<VariablePriceTable
						action={action}
						mustGreaterThan={
							variablePricing.length > 0 &&
							variablePricing[variablePricing.length - 1]?.['to']
								? variablePricing[variablePricing.length - 1]?.['to']
								: null
						}
						variablePricing={variablePricing}
						setVariablePricing={setVariablePricing}
						setMaxRange={setMaxRange}
						maxRange={maxRange}
					/>
				) : null}
			</div> */}
		</>
	)
}
