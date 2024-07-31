import 'cropperjs/dist/cropper.css'

import { toast } from 'sonner'
import { useState, useRef } from 'react'

import Cropper from 'react-cropper'
import { Button, Modal } from 'flowbite-react'
import { MAX_FILE_SIZE } from '../staticData/constantActions'

//CropperReact component provides an interface for cropping images, allowing users to adjust the crop, and handles the resulting image file, including size validation, before passing it to a provided handler function
const CropperReact = ({ file, handler, banner, fileName }) => {
	const cropperRef = useRef(null)
	const [zoom, setZoom] = useState(0)
	const [image, setImage] = useState(file)
	const [cropper, setCropper] = useState(null)
	const [showModal, setShowModal] = useState(true)
	const [cropBoxWidth, setCropBoxWidth] = useState(0)

	const onCloseModal = () => {
		handler(null)
		setShowModal(false)
	}

	const saveHandler = () => {
		if (cropper) {
			cropper
				.getCroppedCanvas({
					fillColor: '#fff',
				})
				.toBlob((blob) => {
					if (blob) {
						const file = new File([blob], fileName, {
							type: 'image/jpeg',
						})

						if (file?.size / 1024 > MAX_FILE_SIZE) {
							toast.warning('Image size is too large!')
							return
						}

						handler(file)
						setShowModal(false)
					} else {
						console.error('Failed to create Blob from cropped canvas')
					}
				}, 'image/jpeg')
		}
	}

	const handleZoom = (event) => {
		const cropper = cropperRef.current.cropper
		const zoomLevel = event.detail.ratio
		if (cropper) {
			const imageData = cropper.getImageData()
			console.log(imageData, 'img width')
			console.log(cropBoxWidth, 'box width')
		}
	}

	const handleReady = (e) => {
		const cropper = cropperRef.current.cropper
		if (cropper) {
			const cropBoxData = cropper.getCropBoxData()
			setCropBoxWidth(cropBoxData.width)
			console.log('Crop Box Width:', cropBoxData.width)
		}
	}

	return (
		<>
			<Modal
				show={showModal}
				size='2xl'
				onClose={onCloseModal}
				dismissible
				popup
				onKeyDown={(e) => {
					e.stopPropagation()
					if (e.nativeEvent.key === 'Enter') {
						saveHandler()
					}
				}}
			>
				<Modal.Header className='p-6'>
					<h1>Crop Image</h1>
					<p className='text-rose-600 text-xs '>
						Image size should not exceed 5MB
					</p>
				</Modal.Header>
				<Modal.Body>
					<div style={{ width: '100%' }}>
						<Cropper
							ref={cropperRef}
							style={{ height: 400, width: '100%' }}
							zoomTo={0}
							const
							initialAspectRatio={banner ? 16 / 5 : 1}
							src={image}
							cropBoxMovable={true}
							// mouseWheelZoom={false}
							// touchDragZomm={false}
							autoCropArea={1}
							// scalable={false}
							viewMode={0}
							minCropBoxHeight={10}
							minCropBoxWidth={10}
							background={false}
							responsive={true}
							checkOrientation={false}
							onInitialized={(instance) => setCropper(instance)}
							guides={false}
							aspectRatio={banner ? 16 / 5 : undefined}
							// zoom={handleZoom}
							// onLoad={handleReady}
						/>
					</div>
				</Modal.Body>

				<Modal.Footer>
					<Button
						type='button'
						onClick={(e) => {
							e.stopPropagation()
							saveHandler()
						}}
					>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default CropperReact
