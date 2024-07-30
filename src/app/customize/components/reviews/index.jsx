import { useState } from 'react'
import Rating from 'react-rating'
import { Dropdown } from 'flowbite-react'
import { Draggable } from 'react-beautiful-dnd'

import { EditReviewModal } from './editReviewModal'
import DeleteReviewModal from './deleteReviewModal'
import DragDrop from '../productCollection/DragDrop'
import ToggleSwitch from '../../../components/toggleSwitch'

import { FaStar } from 'react-icons/fa'
import { FaRegStar } from 'react-icons/fa'

const Reviews = ({
	reviews,
	dispatch,
	setIsChange,
	themeRender,
	handleVerifiedToggle,
}) => {
	const [index, setIndex] = useState(0)

	const [showEditReviewModal, setShowEditReviewModal] = useState(false)

	const [showDeleteReviewModal, setShowDeleteReviewModal] = useState(false)

	// handle delete review
	const handleDeleteReview = (index) => {
		setIsChange(true)

		const payload = reviews.filter((_, i) => i !== index)

		dispatch({ type: 'SET_REVIEWS', payload })
		setShowDeleteReviewModal(false)
	}

	const onDeleteReview = () => {
		handleDeleteReview(index)
	}

	// handle move product
	const moveProduct = (result) => {
		if (!result || !result.destination) return

		const { source, destination, draggableId } = result

		const copyListItems = [...reviews]
		const [removedItem] = copyListItems.splice(source.index, 1)

		copyListItems.splice(destination.index, 0, removedItem)

		dispatch({ type: 'SET_REVIEWS', payload: copyListItems })

		setIsChange(true)
	}

	return (
		<>
			{showEditReviewModal && (
				<EditReviewModal
					index={index}
					state={reviews}
					dispatch={dispatch}
					setIsChange={setIsChange}
					showEditReviewModal={showEditReviewModal}
					setShowEditReviewModal={setShowEditReviewModal}
				/>
			)}

			{showDeleteReviewModal && (
				<DeleteReviewModal
					onDeleteReview={onDeleteReview}
					showDeleteReviewModal={showDeleteReviewModal}
					setShowDeleteReviewModal={setShowDeleteReviewModal}
				/>
			)}

			<div className='p-6 bg-slate-100'>
				<div
					className='p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-100 dark:bg-gray-800 dark:text-blue-400 text-center'
					role='alert'
				>
					<p>You can reorder the {themeRender?.nav} by dragging and dropping</p>
				</div>
				<div className='py-2 px-2 grid grid-cols-5 rounded-lg border border-b mt-4 bg-white border-gray-200 font-semibold'>
					<span>NAME</span>
					<span>RATING</span>
					<span>COMMENT</span>
					<span>VERIFIED</span>
				</div>

				<DragDrop moveItem={moveProduct}>
					{reviews ? (
						reviews?.map((item, index) => {
							return (
								<Draggable
									key={index}
									index={index}
									draggableId={item?.name + index}
								>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<div className='w-full py-2 px-2 grid grid-cols-5 gap-3 rounded-lg border border-b hover:bg-slate-200 cursor-pointer mt-4 bg-white border-gray-200'>
												<h2 className='col-span-1 flex items-center max-w-44 '>
													{item?.name}
												</h2>

												<div className='col-span-1 flex gap-3 items-center'>
													<Rating
														readonly
														fractions={2}
														initialRating={item?.ratings}
														fullSymbol={<FaStar size={30} color='green' />}
														emptySymbol={<FaRegStar size={30} color='green' />}
													/>
												</div>

												<div className='flex items-center col-span-1 w-full'>
													<span className='w-full hyphens-auto text-ellipsis text-sm text-pretty truncate'>
														{item?.comment}
													</span>
												</div>

												<div className='col-span-1 flex gap-3 items-center'>
													<ToggleSwitch
														name={item?.name + index}
														onChange={(event) =>
															handleVerifiedToggle(index, event.target.checked)
														}
														label={
															item?.verifiedBadge ? 'Verified' : 'Not Verified'
														}
														checked={item?.verifiedBadge}
													/>
												</div>

												<div className='col-span-1 flex gap-2 items-center justify-center'>
													<Dropdown
														label={<span className='font-bold'>EDIT</span>}
														size='sm'
														inline={true}
														theme={{
															inlineWrapper:
																'text-black bg-[#edf1f7] hover:bg-[#f7f9fc] focus:bg-[#edf1f7]  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  me-2',
														}}
													>
														<Dropdown.Item
															className='border-b'
															onClick={() => {
																setIndex(index)
																setShowEditReviewModal(true)
															}}
														>
															Edit
														</Dropdown.Item>

														<Dropdown.Item
															onClick={() => {
																setIndex(index)
																setShowDeleteReviewModal(true)
															}}
														>
															Delete
														</Dropdown.Item>
													</Dropdown>
												</div>
											</div>
										</div>
									)}
								</Draggable>
							)
						})
					) : (
						<div className='h-10'>
							<span className='text-rose-500 p-6'>No Reviews Available</span>
						</div>
					)}
				</DragDrop>
			</div>
		</>
	)
}

export default Reviews
