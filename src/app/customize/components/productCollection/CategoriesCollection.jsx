import { Draggable } from 'react-beautiful-dnd'
import { Button, TextInput } from 'flowbite-react'
import { capitalizeFirstLetter } from '../../../../utils/function'
import DragDrop from './DragDrop'

const CategoriesCollection = ({
	themeRender,
	themeOptionList,
	moveSelectedCategory,
	title,
	handleTitleChange,
	deleteCategory,
}) => {
	return (
		<>
			<div className='p-6 bg-white border-b-2'>
				<p className='p-1'>
					{capitalizeFirstLetter(themeRender?.nav)} Collection Title
				</p>
				<TextInput
					type='text'
					name='title'
					value={title}
					onChange={(e) => handleTitleChange(e)}
					placeholder={`${capitalizeFirstLetter(
						themeRender?.nav
					)} Collection Title`}
				/>
			</div>

			<div className='p-6 bg-slate-100'>
				<div
					className='p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-100 dark:bg-gray-800 dark:text-blue-400 text-center'
					role='alert'
				>
					<p>You can reorder the {themeRender?.nav} by dragging and dropping</p>
				</div>

				<DragDrop moveItem={moveSelectedCategory}>
					{themeOptionList ? (
						themeOptionList?.map((item, index) => (
							<Draggable key={item?._id} draggableId={item?._id} index={index}>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
									>
										<div
											key={item?._id}
											className='flex items-center  border-b hover:bg-slate-200 cursor-pointer mt-4 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 justify-between '
										>
											<div className=' gap-3 p-3'>
												<div className='flex gap-3 items-center  '>
													<img
														alt='img'
														src={item?.img_ids[0]?.url}
														className='rounded-full h-12 w-12'
													/>
													<h2 className='flex flex-wrap max-w-44 '>
														{item?.category_name ||
															item?.name ||
															'default_name'}
													</h2>
												</div>
											</div>
											{themeOptionList?.length > 1 && (
												<Button
													color='failure'
													className='me-2'
													onClick={() => deleteCategory(item?._id)}
												>
													Delete
												</Button>
											)}
										</div>
									</div>
								)}
							</Draggable>
						))
					) : (
						<div className='h-10'>
							<span className='text-rose-500 p-6'>No Collection Available</span>
						</div>
					)}
				</DragDrop>
			</div>
		</>
	)
}

export default CategoriesCollection
