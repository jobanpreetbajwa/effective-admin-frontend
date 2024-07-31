import { useState, useEffect } from 'react'
import { Button, Modal } from 'flowbite-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import Chips from '../../../chips/chips'

export default function ReorderTags({
	tags,
	setTags,
	setReOrder,
	openReorderModal,
	setOpenReorderModal,
}) {
	const [newOrder, setNewOrder] = useState(tags || [])

	useEffect(() => {
		setNewOrder(tags)
	}, [tags])

	function onCloseModal() {
		setOpenReorderModal(false)
	}

	const handleOnDragEnd = (result) => {
		if (!result.destination) return
		const items = Array.from(newOrder)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)

		setNewOrder(items)
	}
	const onSave = () => {
		// Save the new order
		setTags(newOrder)
		setReOrder(newOrder?.filter((item) => item?._id)?.map((item) => item._id))
		setOpenReorderModal(false)
	}

	return (
		<>
			<Modal
				popup
				size='md'
				className='p-4'
				onClose={onCloseModal}
				show={openReorderModal}
				onClick={(e) => e.stopPropagation()}
			>
				<Modal.Header className='p-4'>Reorder Tags</Modal.Header>

				<Modal.Body>
					<div className='py-2'>
						<DragDropContext onDragEnd={handleOnDragEnd}>
							<Droppable droppableId='tags'>
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className='max-h-[60vh] overflow-y-auto'
									>
										{newOrder
											.filter((item) => item?._id)
											.map((item, i) => (
												<Draggable
													key={item._id}
													draggableId={item._id}
													index={i}
												>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={{
																...provided.draggableProps.style,
																width: 'fit-content',
																userSelect: 'none',
																margin: '0 0 8px 0',
																display: 'flex',
																flexWrap: 'wrap',
																backgroundColor: snapshot.isDragging
																	? '#f0f0f0'
																	: '#fff',
																zIndex: snapshot.isDragging ? 999 : 'auto',
															}}
														>
															<Chips label={item.name} closeIcon={false} />
														</div>
													)}
												</Draggable>
											))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>

						<div className='flex justify-start gap-4 mt-8'>
							<Button onClick={onSave}>{"Yes, I'm sure"}</Button>
							<Button color='gray' onClick={onCloseModal}>
								No, cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	)
}
