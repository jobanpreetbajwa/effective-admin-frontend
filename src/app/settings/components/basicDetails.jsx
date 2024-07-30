import { Button, FileInput, TextInput, Textarea } from 'flowbite-react'

import { CiCircleRemove } from 'react-icons/ci'
import { FaCloudUploadAlt } from 'react-icons/fa'

export default function BasicDetails({
	formData,
	logoImage,
	logoImageSend,
	setLogoImageSend,
	handleInputChange,
}) {
	// Function to handle the image upload and set the image to the state
	const handleImageChange = (e) => {
		setLogoImageSend(e.target.files[0])
	}

	return (
		<div className='p-4 sm:p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700  dark:bg-gray-800'>
			<h3 className='mb-4 text-xl font-semibold dark:text-white'>
				Basic Details
			</h3>
			<div className='grid grid-cols-6 gap-6'>
				{/* LOGO EDIT */}
				<div className='col-span-6 sm:col-span-3 p-4 mb-4 bg-white border border-gray-200 rounded-lg dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
					<div className='flex items-center justify-center gap-6 space-x-4'>
						<div className='relative w-36 h-36 border border-spacing-1'>
							{/* If the File Object is present then convert that to Object URL if not then show the already present LogoImage*/}
							<img
								src={
									logoImageSend ? URL.createObjectURL(logoImageSend) : logoImage
								}
								alt={formData?.business_name}
								className='w-full h-full object-contain'
							/>

							{/* Remove Uploaded Image (File Object) */}
							{logoImageSend && (
								<button
									type='button'
									onClick={() => setLogoImageSend(null)}
									className='absolute -top-2 -right-2 bg-white rounded-full cursor-pointer hover:bg-red-100'
								>
									<CiCircleRemove size={28} color='red' />
								</button>
							)}
						</div>

						<div>
							<h3 className='mb-1 text-xl font-bold text-gray-900 dark:text-white'>
								Business Logo
							</h3>
							<div className='mb-4 text-sm text-gray-500 dark:text-gray-400'>
								JPG, JPEG or PNG.
							</div>
							<div className='flex items-center'>
								<FileInput
									id='logo'
									name='file'
									className='hidden'
									accept='.jpg, .jpeg, .png,'
									onChange={handleImageChange}
								/>

								<Button
									size='sm'
									type='button'
									onClick={() => {
										document.getElementById('logo').click()
									}}
								>
									<FaCloudUploadAlt size={20} className='mr-1' />
									Upload logo
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Address */}
				<div className='col-span-6 sm:col-span-3 bg-white h-full'>
					<label
						htmlFor='store_address'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
					>
						Address
					</label>
					<Textarea
						id='store_address'
						name='store_address'
						className='min-h-40'
						onChange={handleInputChange}
						value={formData?.store_address}
						placeholder='Your Store Address'
					/>
				</div>
			</div>

			{/* Basic Details */}
			<div className='grid grid-cols-6 gap-6'>
				<div className='col-span-6 sm:col-span-3'>
					<label
						htmlFor='business_name'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
					>
						Business Name
					</label>
					<TextInput
						maxLength={25}
						id='business_name'
						name='business_name'
						placeholder='Business Name'
						onChange={handleInputChange}
						value={formData?.business_name}
					/>
				</div>

				<div className='col-span-6 sm:col-span-3'>
					<label
						htmlFor='phone_number'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
					>
						Phone Number
					</label>

					<TextInput
						minLength={10}
						maxLength={10}
						id='phone_number'
						name='phone_number'
						onChange={handleInputChange}
						value={formData?.phone_number}
						placeholder='Your Phone Number'
					/>
				</div>

				{/* Email */}
				<div className='col-span-6 sm:col-span-3'>
					<label
						htmlFor='email'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
					>
						Email
					</label>
					<TextInput
						id='email'
						type='email'
						name='email'
						value={formData?.email}
						onChange={handleInputChange}
						placeholder='Your Email Address'
					/>
				</div>

				<div className='col-span-6 sm:col-span-3'>
					<label
						htmlFor='your_name'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
					>
						Your Name
					</label>
					<TextInput
						id='your_name'
						name='your_name'
						placeholder='Your Name'
						value={formData?.your_name}
						onChange={handleInputChange}
					/>
				</div>
			</div>
		</div>
	)
}
