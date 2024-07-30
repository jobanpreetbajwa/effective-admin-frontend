import { toast } from 'sonner'
import { uploadMultipleImages } from '../../api/function'

export const sendMultipleImagesSlideShow = async (sendImage) => {
	if (
		sendImage == [undefined] ||
		sendImage == undefined ||
		sendImage == null ||
		sendImage == [] ||
		sendImage == '' ||
		sendImage == {} ||
		sendImage == ''
	) {
		return []
	}

	const promises = []

	const failedUploads = []

	for (let image of sendImage) {
		// type: 'image/jpeg' extract the image type
		const type = image.type.split('/')[1]
		const newName = image?.name + '.' + type

		const imageWithExtension = new File([image], newName, {
			type: image.type,
			lastModified: image.lastModified,
		})

		const formdata = new FormData()
		formdata.append('file', imageWithExtension)

		const promise = uploadMultipleImages({ data: formdata })
			.then((response) => {
				const newObj = {
					...response.data,
					uuid: image?._id,
				}

				return newObj
			})
			.catch((error) => {
				failedUploads.push({ name: image.name })
				toast.error(`failed to upload ${image?.name}`)
				return { error: error?.message }
			})

		promises.push(promise)
	}

	// wait for all promises to resolve

	const promise = Promise.all(promises)
		.then((images) => {
			const ids = images
				.filter((image) => !image?.error)
				.map((image) => ({
					_id: image?._id,
					uuid: image?.uuid,
				}))

			return ids
		})
		.catch((error) => console.error(error))

	toast.promise(promise, {
		loading: 'Uploading...',
		success: () => {
			if (failedUploads.length === 0) {
				return `Images uploaded successfully`
			}
		},
		error: 'Error',
		id: 'uploadingImages',
	})

	return await promise
}
