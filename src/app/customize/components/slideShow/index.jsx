import { Button } from 'flowbite-react'
import { useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'

export default function SlideShow({
	dispatch,
	tempFileRef,
	isDragging,
	item,
	index,
	deleteHandler,
	list,
	handleModalClick,
}) {
	const [thumbnailUrl, setThumbnailUrl] = useState(null)
	const canvasRef = useRef(null)

	const categoryListSelector = useSelector((state) => state.categoryList)

	// Find category name by category id FROM REDUX THAT IS STORED IN THE STATE
	const categoryName = categoryListSelector?.find(
		(category) => category._id === item?.category_id
	)?.category_name

	// DYNAMICALLY CREATE THUMBNAIL FOR THE IMAGE BECAUSE LARGE SIZE IMAGE LAGS WHILE REORDERING
	useEffect(() => {
		if (isDragging && tempFileRef?.draggableId === item?._id) {
			if (!item?.img_id) {
				createThumbnail(item?.formdata)
			}
		}
	}, [isDragging, tempFileRef?.draggableId, item?._id])

	// CREATE THUMBNAIL FOR THE IMAGE
	const createThumbnail = (imageData) => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')

		const reader = new FileReader()

		reader.onload = (event) => {
			const img = new Image()
			img.src = event.target.result

			img.onload = () => {
				const thumbnailWidth = 50
				const thumbnailHeight = (img.height / img.width) * thumbnailWidth

				canvas.width = thumbnailWidth
				canvas.height = thumbnailHeight

				context.drawImage(img, 0, 0, thumbnailWidth, thumbnailHeight)

				setThumbnailUrl(canvas.toDataURL())
			}
		}

		reader.readAsDataURL(imageData)
	}

	return (
		<div
			className={`px-8 py-2 mt-2 ${
				isDragging && tempFileRef?.draggableId === item?._id
					? 'opacity-60'
					: 'opacity-100'
			} `}
			onClick={() => {
				handleModalClick(item?._id)
				dispatch({
					type: 'SET_SELECTED_CATEGORY_ID',
					payload: item?.category_id,
				})
			}}
		>
			<div
				className={`flex gap-2 p-2 border justify-between items-center  ${
					item?.category_id ? 'bg-green-100' : 'bg-white'
				}`}
			>
				<div className='flex gap-2'>
					<div
						className='h-14 w-14 hover:cursor-pointer'
						onClick={() => {
							setThemeModal(true)
						}}
					>
						<img
							src={
								isDragging && tempFileRef?.draggableId === item?._id
									? item?.img_id?.url
										? item?.img_id?.url
										: thumbnailUrl
									: item?.img_id?.url ?? URL.createObjectURL(item?.formdata)
							}
							alt='product'
							className='w-full h-full object-contain rounded-full'
						/>
						<canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
					</div>
					<div className='flex flex-col font-extralight text flex-wrap'>
						<p>Banner Position {index}</p>
						{/* <p> {item?.name ? `Image name: ${item?.name}` : ''}</p> */}
						<p className='text-sm'>
							You can set action by clicking on the image
						</p>
					</div>
				</div>

				{item?.category_id ? (
					<p className='text-sm'>Category Link: {categoryName}</p>
				) : null}

				{list?.length > 1 && (
					<Button
						color='failure'
						onClick={(e) => {
							e.stopPropagation()
							deleteHandler(index)
						}}
					>
						Delete
					</Button>
				)}
			</div>
		</div>
	)
}
