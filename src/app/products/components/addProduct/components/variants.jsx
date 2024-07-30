import AddVariant from '../../../modal/addVariant'
import VariantTable from './variantTable'

export default function VariantComponent({
	action,
	variantData,
	setVariantData,
	variablePricing,
	openVariantModal,
	setOpenVariantModal,
	deletedVariants,
	setDeletedVariants,
}) {
	return (
		<div className='col-span-6 pb-6 border-b'>
			<h2 className='text-base font-semibold leading-7 text-gray-900'>
				Variants
			</h2>

			{variantData?.length === 0 ? (
				<AddVariant
					action={action}
					variablePricing={variablePricing.length ? true : false}
					label='Add Variants'
					variantData={variantData}
					setVariantData={setVariantData}
					openVariantModal={openVariantModal}
					setOpenVariantModal={setOpenVariantModal}
				/>
			) : (
				<>
					<AddVariant
						action={action}
						label='Add Variants'
						variantData={variantData}
						setVariantData={setVariantData}
						openVariantModal={openVariantModal}
						setOpenVariantModal={setOpenVariantModal}
					/>

					<VariantTable
						action={action}
						variantData={variantData}
						setVariantData={setVariantData}
						deletedVariants={deletedVariants}
						setDeletedVariants={setDeletedVariants}
					/>
				</>
			)}

			<p className='py-2 text-sm text-gray-400'>
				Add sizes, colors variations to the product
			</p>
		</div>
	)
}
