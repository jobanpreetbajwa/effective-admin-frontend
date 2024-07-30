import { Alert, Button, Label, TextInput } from 'flowbite-react'
import Chips from '../../../chips/chips'
import { FaPencilAlt } from 'react-icons/fa'
import { HiInformationCircle } from 'react-icons/hi'
import { useRef } from 'react'
import { useState } from 'react'
import { toast } from 'sonner'

// Helper function to filter unique objects based on their size property
function filterUniqueObjects(arr) {
	let seen = new Set()
	return arr.filter((obj) => {
		let str = JSON.stringify(obj)

		if (!seen.has(str)) {
			seen.add(str)
			return true
		}
		return false
	})
}

function VariantCard({ variantData, setVariantData, onCloseModal }) {
	const formRef = useRef(null)
	const [color, setColor] = useState('#FFFFFF')

	const handleForm = (e) => {
		let name = formRef.current.name.value.trim()

		if (!name) {
			toast.error('Please enter a variant name')
			//focus on name
			formRef.current.name.focus()
			return
		}

		const multipleData = []

		//check if name contain "," and if it does split and add to variantData
		if (name.includes(',')) {
			const splitData = name.split(',')

			filterUniqueObjects(splitData).forEach((item) => {
				multipleData.push({
					size: item.trim(),
					color: formRef.current.color.value,
				})
			})

			setVariantData([...variantData, ...multipleData])
		} else {
			const data = {
				size: formRef.current.name.value,
				color: formRef.current.color.value,
			}
			setVariantData([...variantData, data])
		}

		formRef.current.reset()
		onCloseModal()
	}

	return (
		<form ref={formRef} className='pb-4'>
			<div className='mt-4'>
				<p className='flex gap-2 text-gray-700 dark:text-gray-300 mb-2'>Size</p>

				<div className='flex items-center gap-4'></div>
				<div className='flex items-center gap-4'>
					<TextInput
						name='name'
						placeholder='Enter Variant'
						className='my-2'
						maxLength={50}
					/>
				</div>

				{/* Info */}
				<Alert color='alert' icon={HiInformationCircle}>
					<span className='font-medium'>
						Add Variations separated by commas
					</span>
				</Alert>
			</div>

			<div className='mt-4'>
				<p className='mt-4 flex gap-2 text-gray-700 dark:text-gray-300 mb-2'>
					Color
				</p>

				<div className='flex justify-between items-center gap-4'>
					<div className='flex gap-4 items-center'>
						<TextInput
							type='color'
							name='color'
							placeholder='Enter name'
							className='my-2'
							onChange={(e) => setColor(e.target.value)}
						/>
						<div
							className='w-8 h-8 border border-gray-300 rounded-full'
							style={{
								backgroundColor: color,
							}}
						/>
					</div>
					<Button
						type='button'
						outline
						onClick={(e) => {
							handleForm(e)
						}}
					>
						Add
					</Button>
				</div>
			</div>
		</form>
	)
}

export default VariantCard
