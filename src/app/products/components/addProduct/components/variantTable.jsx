import { Label, Table, TextInput } from 'flowbite-react'
import { MdDelete } from 'react-icons/md'
import { toast } from 'sonner'
import { useRef, useState } from 'react'
import {
	ONLY_FLOATING_POINT_HANDLER,
	ONLY_NUMBERS_HANDLER,
} from '../../../../utilis/regex'
import { CiCircleRemove } from 'react-icons/ci'
import CropperReact from '../../../../cropper/cropperReact'
import { DETAILS_PRODUCT_ACTION_TYPE } from '../../../../staticData/constantActions'

export default function VariantTable({
	action,
	variantData,
	setVariantData,
	deletedVariants,
	setDeletedVariants,
}) {
	const priceInputRef = useRef(null)
	const discountedPriceRef = useRef(null)
	const mediaInputRef = useRef(null)
	const [tempFile, setTempFile] = useState(null)
	return (
		<div className='overflow-x-auto'>
			<Table>
				<Table.Head>
					<Table.HeadCell>Variants</Table.HeadCell>
					<Table.HeadCell>
						Selling Price<span className='text-rose-600 cursor-default'>*</span>
					</Table.HeadCell>
					<Table.HeadCell>
						Discounted Price
						<span className='text-rose-600 cursor-default'>*</span>
					</Table.HeadCell>
					<Table.HeadCell>
						Weight<span className='text-rose-600 cursor-default'>*</span>
					</Table.HeadCell>
					<Table.HeadCell>
						Min Order Quantity
						<span className='text-rose-600 cursor-default'>*</span>
					</Table.HeadCell>
					<Table.HeadCell>
						Max Order Quantity
						<span className='text-rose-600 cursor-default'>*</span>
					</Table.HeadCell>
					<Table.HeadCell>
						Shipping Cost<span className='text-rose-600 cursor-default'>*</span>
					</Table.HeadCell>
					<Table.HeadCell>Photo</Table.HeadCell>
					<Table.HeadCell></Table.HeadCell>
				</Table.Head>
				<Table.Body className='divide-y'>
					{variantData &&
						variantData?.map((variant, index) => {
							const handleInput = (event) => {
								// const temp = [...variantData]

								variantData?.map((data) => {
									if (data.name === variant.name) {
										const originalString = event.target.name
										const slicedString = originalString.slice('variant_'.length)
										data[slicedString] = event.target.value
									}
								})
								// variantData = temp
							}

							return (
								<Table.Row key={index}>
									<Table.Cell className='flex gap-2 items-center'>
										<div
											className={`rounded-full w-8 h-8 border border-gray-300`}
											style={{
												backgroundColor: variant?.color || '#000',
											}}
										></div>
										{variant?.size}
									</Table.Cell>
									<Table.Cell>
										<TextInput
											name='variant_mrp_price'
											placeholder='Enter Price'
											required
											ref={priceInputRef}
											onChange={(event) => {
												if (!ONLY_FLOATING_POINT_HANDLER(event)) return

												handleInput(event)

												if (+event.target.value > 999999) {
													toast.warning(
														'Price should not be more than 999999',
														{
															id: 'price',
														}
													)
													event.target.value = event.target.value.slice(0, -1)
												}

												if (
													+priceInputRef.current.value <
													+discountedPriceRef.current.value
												) {
													toast.error(
														'Discounted price cannot be greater than MRP price'
													)
													discountedPriceRef.current.value =
														discountedPriceRef.current.value.slice(0, -1)
												}
											}}
											disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
											defaultValue={variant?.mrp_price || ''}
										/>
									</Table.Cell>
									<Table.Cell>
										<TextInput
											name='variant_discounted_price'
											ref={discountedPriceRef}
											required
											onChange={(event) => {
												if (!ONLY_FLOATING_POINT_HANDLER(event)) return

												handleInput(event)

												if (+event.target.value > 999999) {
													toast.warning(
														'Discounted price should not be more than 999999',
														{
															id: 'price',
														}
													)
													event.target.value = event.target.value.slice(0, -1)
												}

												if (
													+priceInputRef.current.value < +event.target.value
												) {
													toast.error(
														'Discounted price cannot be greater than MRP price'
													)
													event.target.value = event.target.value.slice(0, -1)
												}
											}}
											disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
											placeholder='Enter Discounted Price'
											defaultValue={variant?.discounted_price || ''}
										/>
									</Table.Cell>

									<Table.Cell>
										<TextInput
											name='variant_weight'
											required
											placeholder='Enter Weight'
											defaultValue={variant?.weight || ''}
											disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
											onChange={(e) => {
												if (!ONLY_NUMBERS_HANDLER(e)) return

												handleInput(e)

												if (+e.target.value > 999999) {
													toast.warning(
														'Weight should not be more than 999999',
														{
															id: 'price',
														}
													)
													e.target.value = e.target.value.slice(0, -1)
												}
											}}
										/>
									</Table.Cell>

									<Table.Cell>
										<TextInput
											name='variant_min_order_quantity'
											id='variant_min_order_quantity'
											required
											defaultValue={variant?.min_order_quantity || ''}
											disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
											placeholder='Min Order Quantity'
											onChange={(e) => {
												if (!ONLY_NUMBERS_HANDLER(e)) return

												handleInput(e)

												if (+e.target.value > 999999) {
													toast.warning(
														'Minimum Order Quantity  should not be more than 999999',
														{
															id: 'price',
														}
													)
													e.target.value = e.target.value.slice(0, -1)
												}
											}}
										/>
									</Table.Cell>

									<Table.Cell>
										<TextInput
											name='variant_max_order_quantity'
											id='variant_max_order_quantity'
											disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
											required
											defaultValue={variant?.max_order_quantity || ''}
											placeholder='Max Order Quantity'
											onChange={(e) => {
												if (!ONLY_NUMBERS_HANDLER(e)) return

												handleInput(e)

												if (+e.target.value > 999999) {
													toast.warning(
														'Maximum Order Quantity should not be more than 999999',
														{
															id: 'price',
														}
													)
													e.target.value = e.target.value.slice(0, -1)
												}
											}}
										/>
									</Table.Cell>

									<Table.Cell>
										<TextInput
											name='variant_shipping_cost'
											disabled={action === DETAILS_PRODUCT_ACTION_TYPE}
											required
											onChange={(e) => {
												if (!ONLY_FLOATING_POINT_HANDLER(e)) return

												handleInput(e)
												if (+e.target.value > 999999) {
													toast.warning(
														'Shipping Cost should not be more than 999999',
														{
															id: 'price',
														}
													)
													e.target.value = e.target.value.slice(0, -1)
												}
											}}
											defaultValue={variant?.shipping_cost || ''}
											id='variant_shipping_cost'
											placeholder='Shipping Cost'
										/>
									</Table.Cell>

									<Table.Cell className='rounded-full'>
										{variant?.img_ids ? (
											<div className='relative w-16 h-16 rounded-full'>
												<img src={variant?.img_ids[0]?.url} alt='variant' />
												{action === DETAILS_PRODUCT_ACTION_TYPE ? null : (
													<button
														className='absolute -top-2 -right-3 text-white rounded-full bg-white'
														type='button'
														onClick={() => {
															const temp = [...variantData]

															temp[index].img_ids = null
															setVariantData(temp)
														}}
													>
														<CiCircleRemove size={28} color='red' />
													</button>
												)}
											</div>
										) : variant?.image ? (
											<div className='relative w-16 h-16 rounded-full'>
												<img
													src={URL.createObjectURL(variant?.image)}
													alt='variant'
												/>
												{action === DETAILS_PRODUCT_ACTION_TYPE ? null : (
													<button
														className='absolute -top-2 -right-3 text-white rounded-full bg-white'
														type='button'
														onClick={() => {
															const temp = [...variantData]
															temp[index].image = null
															setVariantData(temp)
														}}
													>
														<CiCircleRemove size={28} color='red' />
													</button>
												)}
											</div>
										) : (
											<>
												<Label className='cursor-pointer' color='primary'>
													Upload
													<input
														ref={mediaInputRef}
														type='file'
														className='hidden'
														accept='.jpg, .jpeg, .png'
														onChange={(event) => {
															setTempFile(event.target.files[0])
														}}
													/>
												</Label>
												{mediaInputRef && tempFile && (
													<CropperReact
														file={URL.createObjectURL(tempFile)}
														fileName={tempFile?.name}
														handler={(file) => {
															const temp = [...variantData]

															temp[index].image = file
															// setNewImage(URL.createObjectURL(file))
															setVariantData(temp)
															setTempFile(null)
															mediaInputRef.current.value = ''
														}}
														banner={false}
													/>
												)}
											</>
										)}
									</Table.Cell>

									<Table.Cell>
										{action === DETAILS_PRODUCT_ACTION_TYPE ? null : (
											<MdDelete
												color='red'
												size={28}
												cursor='pointer'
												onClick={() => {
													if (variant?._id) {
														setDeletedVariants([
															...deletedVariants,
															variant?._id,
														])
													}

													const temp = [...variantData]
													temp.splice(index, 1)
													setVariantData(temp)
												}}
											/>
										)}
									</Table.Cell>
								</Table.Row>
							)
						})}
				</Table.Body>
			</Table>
		</div>
	)
}
