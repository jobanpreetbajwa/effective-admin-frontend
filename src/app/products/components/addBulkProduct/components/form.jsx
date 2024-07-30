import { useState } from 'react'
import { FileInput, TextInput, Textarea, Label } from 'flowbite-react'
import { CiCircleRemove } from 'react-icons/ci'

export default function ProductForm({ bulkData, setBulkData }) {
	let [images, setImages] = useState([])

	//handleFileChange function sets the image state with the selected file.
	const handleFileChange = (event) => {
		setImages([...images, ...event.target.files])
	}

	const handleChange = () => {
		console.log('changed')
	}

	return (
		<form className='grid grid-cols-2 gap-3' encType='multipart/form-data'>
			{/* Media */}
			<div className='col-span-2 pb-4'>
				<h2 className='text-base font-base leading-7 text-gray-900 mb-2'>
					Media
				</h2>
				<FileInput
					id='dropzone-file'
					name='file'
					className='hidden'
					onChange={handleFileChange}
					accept='image/png, image/jpeg, image/jpg'
					multiple
				/>

				{images && images?.length ? (
					<div className=' flex gap-4 h-40 items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-auto px-4'>
						<div className='flex gap-4'>
							<Label
								htmlFor='dropzone-file'
								className='rounded border w-20 h-20 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'
							>
								Add More
							</Label>
							{images.map((image, index) => (
								<div key={index} className='relative w-20 h-20 bg-gray-50'>
									<img
										src={URL.createObjectURL(image)}
										alt='product'
										className='w-full h-full object-contain'
									/>
									<button
										type='button'
										className='absolute -top-2 -right-2 bg-white rounded-full cursor-pointer hover:bg-red-100'
										onClick={() => {
											setImages(images.filter((img, i) => i !== index))
										}}
									>
										<CiCircleRemove size={28} color='red' />
									</button>
								</div>
							))}
						</div>
					</div>
				) : (
					<Label
						htmlFor='dropzone-file'
						className='flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'
					>
						<div className='flex flex-col items-center justify-center pb-6 pt-5'>
							<svg
								className='mb-4 h-8 w-8 text-gray-500 dark:text-gray-400'
								aria-hidden='true'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 20 16'
							>
								<path
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
								/>
							</svg>
							<p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
								<span className='font-semibold'>Click to upload</span>
							</p>
							<p className='text-center text-xs text-gray-500 dark:text-gray-400'>
								PNG, JPG or JPEG (MAX. 800x400px)
							</p>
						</div>
					</Label>
				)}
			</div>

			{/* Product Name */}
			<div className='col-span-full row-start-2'>
				<h2 className='text-base font-bold leading-7 text-gray-900 mb-2'>
					Basic Details
				</h2>
				<div className='mb-2 block'>
					<Label htmlFor='name' value='Product Name*' />
				</div>

				<TextInput
					id='name'
					type='text'
					onChange={handleChange}
					name='name'
					placeholder='Chakki Fresh Atta'
					required
				/>
			</div>

			{/* Price */}
			<div className='flex col-span-full gap-4 row-start-3'>
				<div className=' '>
					<div className='mb-2 block'>
						<Label htmlFor='price' value='Original Price' />
					</div>

					<TextInput
						id='mrp_price'
						type='text'
						onChange={handleChange}
						name='mrp_price'
						placeholder='1'
						required
					/>
				</div>

				<div>
					<div className='mb-2 block'>
						<Label htmlFor='price' value='Discounted Price' />
					</div>

					<TextInput
						id='discounted_price'
						type='text'
						placeholder='0'
						required
						onChange={handleChange}
					/>
				</div>
			</div>

			{/* Product Description */}
			<div className='col-span-2 row-start-4'>
				<div className='mb-2 block'>
					<Label htmlFor='description' value='Product Description' />
				</div>
				<Textarea
					id='description'
					placeholder='Leave a description...'
					onChange={handleChange}
					required
					rows={4}
				/>
			</div>
		</form>
	)
}
