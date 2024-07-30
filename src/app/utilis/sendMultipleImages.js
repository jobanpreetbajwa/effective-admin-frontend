// This function is used to send multiple FileObjects to the server and get the ImageIds to bind with the form data (Payload). It returns a promise that resolves to an array of ImageIds.

// If the upload fails, it shows a toast notification with the error message and maintains an array.

// Usage: import { sendMultipleImages } from 'path'
// Usage: const img_ids = await sendMultipleImages([FileObjects])

import { toast } from 'sonner'
import { uploadMultipleImages } from '../../api/function'

export const sendMultipleImages = async (sendImage) => {
  // Check if the sendImage([FileObjects]) is empty
  if (
    sendImage == [undefined] ||
    sendImage == undefined ||
    sendImage == null ||
    sendImage == [] ||
    sendImage == '' ||
    sendImage == {}
  ) {
    return []
  }

  const promises = []

  const failedUploads = []

  for (let image of sendImage) {
    // type: 'image/jpeg' extract the image type
    const type = image.type.split('/')[1]

    // Append the image type to the image name
    const newName = image?.name + '.' + type

    // Create a new File Object with the image name and type
    const imageWithExtension = new File([image], newName, {
      type: image.type,
      lastModified: image.lastModified,
    })

    // Create a new FormData Object and append the image
    const formdata = new FormData()
    formdata.append('file', imageWithExtension)

    // Call the API to upload the image
    const promise = uploadMultipleImages({ data: formdata })
      .then((response) => response.data)
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
      // Filter the images array which are failed to upload and get the ImageIds
      const ids = images
        .filter((image) => !image?.error)
        .map((image) => image?._id)

      return ids
    })
    .catch((error) => console.error(error))

  toast.promise(promise, {
    loading: 'Uploading...',
    success: () => {
      return `Images uploaded successfully`
      // if (failedUploads.length === 0) {
      //   return `Images uploaded successfully`
      // }
    },
    error: 'Error',
    id: 'uploadingImages',
  })

  return await promise
}
