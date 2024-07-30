import { useState } from 'react'
import Rating from 'react-rating'
import { Button, Label, Modal, TextInput, Textarea } from 'flowbite-react'

import ToggleSwitch from '../../../components/toggleSwitch'

import { FaRegStar, FaStar } from 'react-icons/fa'

export function AddReviewModal({
	state,
	dispatch,
	setIsChange,
	showAddReviewModal,
	setShowAddReviewModal,
}) {
	const [review, setReview] = useState({
		name: '',
		ratings: 0,
		comment: '',
		verifiedBadge: false,
	})

	function onCloseModal() {
		setShowAddReviewModal(false)
	}

	// Add New Review
	const handleAddReview = (event) => {
		event.preventDefault()
		setIsChange(true)

		dispatch({ type: 'SET_REVIEWS', payload: [...state.reviews, review] })
		setShowAddReviewModal(false)
	}

	// Handle Rating Change
	const handleRating = (rate) => {
		setReview({ ...review, ratings: rate })
	}

	return (
		<>
			<Modal show={showAddReviewModal} size='md' onClose={onCloseModal} popup>
				<Modal.Header>
					<h2 className='p-4 text-lg font-semibold text-gray-900 dark:text-white'>
						Add Reviews
					</h2>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleAddReview}>
						<div className='space-y-6'>
							<div>
								<div className='mb-2 block'>
									<Label htmlFor='name' value='Name :' />
								</div>
								<TextInput
									id='name'
									placeholder='Name'
									value={review.name}
									onChange={(event) =>
										setReview({ ...review, name: event.target.value })
									}
									maxLength={50}
									required
								/>
							</div>

							<div>
								<div className='mb-2 block'>
									<Label value='Rating :' />
								</div>

								<Rating
									fractions={2}
									onChange={handleRating}
									initialRating={review?.ratings}
									emptySymbol={<FaRegStar size={30} color='green' />}
									fullSymbol={<FaStar size={30} color='green' />}
								/>
							</div>

							<div>
								<div className='mb-2 block'>
									<Label htmlFor='comment' value='Comment :' />
								</div>
								<Textarea
									id='comment'
									placeholder='Comment'
									value={review.comment}
									onChange={(event) =>
										setReview({ ...review, comment: event.target.value })
									}
									required
									maxLength={140}
								/>
							</div>

							<div>
								<label className='w-fit'>
									<div className='mb-2 block '>
										<span>Verified Badge :</span>
									</div>
									<ToggleSwitch
										onChange={() => {
											setReview({
												...review,
												verifiedBadge: !review.verifiedBadge,
											})
										}}
										checked={review.verifiedBadge}
									/>
								</label>
							</div>

							<div className='w-full'>
								<Button type='submit'>Add Review</Button>
							</div>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</>
	)
}
