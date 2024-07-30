import { useState } from 'react'
import Rating from 'react-rating'
import { Button, Label, Modal, TextInput, Textarea } from 'flowbite-react'

import ToggleSwitch from '../../../components/toggleSwitch'

import { FaRegStar, FaStar } from 'react-icons/fa'

export function EditReviewModal({
	index,
	state,
	dispatch,
	setIsChange,
	showEditReviewModal,
	setShowEditReviewModal,
}) {
	const [review, setReview] = useState(state[index])

	function onCloseModal() {
		setShowEditReviewModal(false)
	}

	// handle edit review
	const handleEditReview = (event) => {
		event.preventDefault()
		setIsChange(true)

		// Add the new review to the state
		const payload = state.map((item, i) => {
			if (i === index) {
				return { ...item, ...review }
			}
			return item
		})

		dispatch({ type: 'SET_REVIEWS', payload })
		setShowEditReviewModal(false)
	}

	const handleRating = (rate) => {
		setReview({ ...review, ratings: rate })
	}

	return (
		<>
			<Modal show={showEditReviewModal} size='md' onClose={onCloseModal} popup>
				<Modal.Header>
					<h2 className='p-4 text-lg font-semibold text-gray-900 dark:text-white'>
						Edit Review
					</h2>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleEditReview}>
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
									maxLength={200}
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
								<Button type='submit'>Edit Review</Button>
							</div>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</>
	)
}
