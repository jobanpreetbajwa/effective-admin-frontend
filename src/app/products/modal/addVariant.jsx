// This component is used to add variants to the product
// This was a feature that got removed from the final product (Hidden)

import { Modal, Button } from 'flowbite-react'

import { FaPlus } from 'react-icons/fa6'
import VariantCard from '../components/addProduct/components/variantCard'

export default function AddVariant({
	label,
	action,
	variablePricing,
	openVariantModal,
	setOpenVariantModal,
	setVariantData,
	variantData,
}) {
	function onCloseModal() {
		setOpenVariantModal(false)
	}

	return (
		<>
			<div className='flex gap-4'>
				<Button
					outline
					onClick={() => setOpenVariantModal(true)}
					disabled={action === 'details' ? true : variablePricing}
				>
					{label}
					<FaPlus className='ml-2 h-4 w-4' />
				</Button>
				{variablePricing ? (
					<div className='flex items-end'>
						<p className='font-semibold text-xs text-center text-rose-600'>
							Variable Pricing is selected
						</p>
					</div>
				) : null}
			</div>

			<Modal
				show={openVariantModal}
				size='2xl'
				onClose={onCloseModal}
				popup
				className='p-4'
			>
				<Modal.Header className='p-4'>
					<h3 className='text-xl font-medium text-gray-900 dark:text-white '>
						Add Variant
					</h3>
				</Modal.Header>

				<Modal.Body className='flex flex-col gap-4'>
					<VariantCard
						label={'Size'}
						variantData={variantData}
						setVariantData={setVariantData}
						onCloseModal={onCloseModal}
					/>
				</Modal.Body>
			</Modal>
		</>
	)
}
