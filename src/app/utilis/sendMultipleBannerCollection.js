import { toast } from 'sonner'

export const sendMultipleBannerCollection = async (sendImage) => {
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

	for (const image of sendImage) {
		const formdata = new FormData()

		const blob = dataURItoBlob(image.url)

		formdata.append('file', blob, 'image.jpg')
		const requestOptions = {
			method: 'POST',
			body: formdata,
			redirect: 'follow',
		}

		const promise = fetch(
			`${import.meta.env.VITE_BASE_URL}/image/upload`,
			requestOptions
		)
			.then((response) => {
				if (!response.ok) {
					return { error: response }
				}
				return response.json()
			})
			.catch((error) => console.error(error))
		promises.push(promise)
	}

	// wait for all promises to resolve

	const promise = Promise.all(promises)
		.then((images) => {
			const ids = images
				.filter((image) => !image.error)
				.map((image) => image._id)

			return ids
		})
		.catch((error) => console.error(error))

	toast.promise(promise, {
		loading: 'Uploading...',
		success: () => {
			return `Image uploaded successfully`
		},
		error: 'Error',
		id: 'uploadingImages',
	})

	return await promise
}

function dataURItoBlob(dataURI) {
	const byteString = atob(dataURI.split(',')[1])
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
	const ab = new ArrayBuffer(byteString.length)
	const ia = new Uint8Array(ab)

	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i)
	}

	return new Blob([ab], { type: mimeString })
}
