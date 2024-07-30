import { toast } from 'sonner'
import { Label, FileInput } from 'flowbite-react'

import ImageLabel from '../../imageLabel/imageLabel'
import {
  ADD_PRODUCT_ACTION_TYPE,
  DETAILS_PRODUCT_ACTION_TYPE,
  EDIT_PRODUCT_ACTION_TYPE,
} from '../../../../staticData/constantActions'
// import CropperReact from '../../../../cropper/cropperReact'
import { CiCircleRemove } from 'react-icons/ci'
import { useRef } from 'react'

function MediaComponent({
  images,
  setImages,
  setSendImages,
  deletedImages,
  setDeletedImages,
  sendImages,
  action,
  showEditImage,
  setShowEditImage,
}) {
  const mediaInputRef = useRef(null)
  // const [tempFile, setTempFile] = useState(null)

  const handleFileChange = (event) => {
    // if (file) {
    // 	setImages((prevImages) => [...prevImages, file])

    // 	// setShowImage
    // 	setSendImages((prevImages) => [...prevImages, file])
    // }
    const filesArray = Array.from(event.target.files)
    filesArray.forEach((file, i) => {
      setImages((prevImages) => [...prevImages, file])

      // setShowImage
      setSendImages((prevImages) => [...prevImages, file])
    })
    mediaInputRef.current.value = ''
    // setTempFile(null)
  }

  return (
    <div className='col-span-full border-b pb-6'>
      <h2 className='text-base font-base leading-7 text-gray-900 mb-2'>
        Media<span className='text-rose-600 cursor-default'>*</span>
      </h2>
      <FileInput
        ref={mediaInputRef}
        id='dropzone-file'
        name='file'
        className='hidden'
        onChange={handleFileChange}
        multiple
        accept='image/png, image/jpeg, image/jpg'
      />
      {/* {mediaInputRef && tempFile && (
				<CropperReact
					file={URL.createObjectURL(tempFile)}
					handler={handleFileChange}
					banner={false}
					fileName={tempFile?.name}
				/>
			)} */}
      {(images || showEditImage) &&
      (images?.length || showEditImage?.length) ? (
        <div className='flex gap-4 h-64 items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-auto px-4'>
          <div className='flex gap-4'>
            {action !== DETAILS_PRODUCT_ACTION_TYPE && images?.length && (
              <Label
                htmlFor='dropzone-file'
                className='rounded border w-40 h-40 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'
              >
                Add More
              </Label>
            )}
            {action === ADD_PRODUCT_ACTION_TYPE &&
              images.map((image, index) => (
                <div key={index} className='relative w-40 h-40 bg-gray-50'>
                  <img
                    src={
                      action === ADD_PRODUCT_ACTION_TYPE
                        ? URL.createObjectURL(image)
                        : image
                    }
                    alt='product'
                    className='w-full h-full object-contain'
                  />
                  <button
                    type='button'
                    className='absolute -top-2 -right-2 bg-white rounded-full cursor-pointer hover:bg-red-100'
                    onClick={() => {
                      setImages(images.filter((_, i) => i !== index))
                      setSendImages(images.filter((_, i) => i !== index))

                      if (!images[index]?.name) {
                        // deletedImages has every image and this
                        const newDeletedImages = [...deletedImages]

                        newDeletedImages[index]['isDeleted'] = true

                        // newDeletedImages[index]

                        setDeletedImages(newDeletedImages)
                      }
                    }}
                  >
                    <CiCircleRemove size={28} color='red' />
                  </button>
                </div>
              ))}
            {action === DETAILS_PRODUCT_ACTION_TYPE &&
              images.map((image, index) => (
                <div key={index} className='relative w-40 h-40 bg-gray-50'>
                  <img
                    src={
                      action === ADD_PRODUCT_ACTION_TYPE
                        ? URL.createObjectURL(image)
                        : image
                    }
                    alt='product'
                    className='w-full h-full object-contain'
                  />
                </div>
              ))}

            {action === EDIT_PRODUCT_ACTION_TYPE &&
              showEditImage &&
              showEditImage.map((image, index) => (
                <div key={index} className='relative w-40 h-40 bg-gray-50'>
                  <img
                    src={image}
                    alt='product'
                    className='w-full h-full object-contain'
                  />
                  <button
                    type='button'
                    className='absolute -top-2 -right-2 bg-white rounded-full cursor-pointer hover:bg-red-100'
                    onClick={() => {
                      setShowEditImage(
                        showEditImage.filter((_, i) => i !== index)
                      )
                      // setImages(showEditImage)

                      if (!showEditImage[index]?.name) {
                        // deletedImages has every image and this
                        const newDeletedImages = [...deletedImages]

                        newDeletedImages[index]['isDeleted'] = true

                        // newDeletedImages[index]

                        setDeletedImages(newDeletedImages)
                      }
                    }}
                  >
                    <CiCircleRemove size={28} color='red' />
                  </button>
                </div>
              ))}

            {action === EDIT_PRODUCT_ACTION_TYPE &&
              sendImages &&
              sendImages.map((image, index) => (
                <div key={index} className='relative w-40 h-40 bg-gray-50'>
                  <img
                    src={URL.createObjectURL(image)}
                    alt='product'
                    className='w-full h-full object-contain'
                  />
                  <button
                    type='button'
                    className='absolute -top-2 -right-2 bg-white rounded-full cursor-pointer hover:bg-red-100'
                    onClick={() => {
                      setSendImages(sendImages.filter((_, i) => i !== index))

                      const newDeletedImages = [...deletedImages]

                      newDeletedImages[index]['isDeleted'] = true

                      setDeletedImages(newDeletedImages)
                    }}
                  >
                    <CiCircleRemove size={28} color='red' />
                  </button>
                </div>
              ))}
          </div>
        </div>
      ) : action === DETAILS_PRODUCT_ACTION_TYPE ? (
        <div className='flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'>
          <p className='py-2 text-sm text-gray-400'>
            Fetching images from the server
          </p>
        </div>
      ) : (
        <ImageLabel id={'dropzone-file'} />
      )}
    </div>
  )
}

export default MediaComponent
