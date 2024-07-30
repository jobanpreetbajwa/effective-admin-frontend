import { useState, useRef } from 'react'
import { Label, FileInput } from 'flowbite-react'
import ImageLabel from '../../imageLabel/imageLabel'
import CropperReact from '../../../../cropper/cropperReact'

import { CiCircleRemove } from 'react-icons/ci'

export default function BannerImagesComponent({
	bannerImage,
	setBannerImage,
	bannerImageSend,
	setBannerImageSend,
	deletedBannerImages,
	setDeletedBannerImages,
}) {
	const bannerInputRef = useRef(null)
	const [tempFileBanner, setTempFileBanner] = useState(null)
	const handleFileChange = (file) => {
		if (file) {
			setBannerImageSend([...bannerImageSend, file])
		}

		bannerInputRef.current.value = ''
		setTempFileBanner(null)
	}

	return (
		<div className='col-span-full pb-6'>
			<h2 className='text-sm font-medium leading-7 text-gray-900 mb-2'>
				BANNER IMAGE<span className='text-rose-600 cursor-default'>*</span>
			</h2>

			<FileInput
				ref={bannerInputRef}
				id='categoryBannerImages'
				name='file2'
				className='hidden'
				onChange={(e) => {
					setTempFileBanner(e.target.files[0])
				}}
				accept='image/png, image/jpeg, image/jpg'
			/>

			{bannerInputRef && tempFileBanner && (
				<CropperReact
					file={URL.createObjectURL(tempFileBanner)}
					handler={handleFileChange}
					banner={true}
					fileName={tempFileBanner?.name}
				/>
			)}

			{bannerImageSend?.length || bannerImage?.length ? (
				<div className='flex gap-4 h-64 items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-auto px-4'>
					<div className='flex gap-4'>
						{bannerImageSend?.length + bannerImage?.length < 5 && (
							<Label
								htmlFor='categoryBannerImages'
								className='rounded border w-20 h-20 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'
							>
								Add More
							</Label>
						)}

						{bannerImage && bannerImage?.length
							? bannerImage.map((image, index) => {
									return (
										<div
											key={index}
											className='relative max-h-44 w-48 bg-gray-50'
										>
											<img
												src={image?.url}
												alt='product'
												className='w-full h-full object-contain'
											/>
											<button
												type='button'
												className='absolute -top-2 -right-2 bg-white rounded-full cursor-pointer hover:bg-red-100'
												onClick={() => {
													setDeletedBannerImages([
														...deletedBannerImages,
														image?._id,
													])
													setBannerImage(
														bannerImage.filter((_, i) => i !== index)
													)
												}}
											>
												<CiCircleRemove size={28} color='red' />
											</button>
										</div>
									)
							  })
							: null}

						{bannerImageSend && bannerImageSend.length
							? bannerImageSend.map((image, index) => {
									return (
										<div
											key={index}
											className='relative max-h-44 w-48 bg-gray-50'
										>
											<img
												src={URL.createObjectURL(image)}
												alt='product'
												className='w-full h-full object-contain'
											/>
											<button
												type='button'
												className='absolute -top-2 -right-2 bg-white rounded-full cursor-pointer hover:bg-red-100'
												onClick={() => {
													setBannerImageSend(
														bannerImageSend.filter((_, i) => i !== index)
													)
												}}
											>
												<CiCircleRemove size={28} color='red' />
											</button>
										</div>
									)
							  })
							: null}
					</div>
				</div>
			) : (
				<ImageLabel id={'categoryBannerImages'} />
			)}
		</div>
	)
}
