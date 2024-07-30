import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Dropdown } from 'flowbite-react'

import Loader from '../../loader'
import ThemeOptionsModal from './ThemeOptionsModal'
import ToggleSwitch from '../../components/toggleSwitch'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { generateThemeList } from '../../../utils/dashboard/customizeWebsite/function'
import {
	ThemeType,
	theme as themeOptions,
} from '../../constant/dashboard/constant'
import {
	deleteThemePreview,
	getThemePreview,
	hideUnhideThemePreview,
	reorderThemeList,
} from '../../../api/function'

import { IoMdReorder } from 'react-icons/io'
import { CiCircleRemove } from 'react-icons/ci'
import { MdOutlinePostAdd } from 'react-icons/md'
import { IoArrowBack } from 'react-icons/io5'

export const CustomizeList = () => {
	const [list, setList] = useState([])
	const [isReorder, setIsReorder] = useState(false)
	const [isReorderedList, setReorderedList] = useState(false)
	const [isListLoading, setIsListLoading] = useState(false)
	const [reOrderRes, setReorderRes] = useState(false)
	const [isAddComponentModalOpen, setIsAddComponentModalOpen] = useState(false)
	const navigate = useNavigate()

	// Get theme preview list
	const getThemePreviewList = async () => {
		try {
			setIsListLoading(true)
			let res = await getThemePreview()

			if (res?.data) {
				let data = generateThemeList(res?.data)
				setList(data)
				setReorderRes(false)
			}
		} catch (error) {
			toast.error('Error while loading theme preview list')
		} finally {
			setIsListLoading(false)
		}
	}

	// Get theme preview list
	useEffect(() => {
		getThemePreviewList()
	}, [])

	// Delete theme preview
	const handleDelete = async (id) => {
		if (id) {
			try {
				let res = await deleteThemePreview({ id })
				if (res) {
					let filteredList = list?.filter((item) => item?._id !== id)
					setList(filteredList)
					toast.success(`Now this item is deleted successfully`)
				}
			} catch (error) {
				toast.error(`Error while deleting item`)
			}
		}
	}

	// Hide/Unhide theme preview
	const hideUnhidePreview = async (id, isHide) => {
		try {
			let res = await hideUnhideThemePreview({ id: id, isHide: isHide })
			if (res) {
				toast.success(
					`Now this item is ${isHide ? 'hidden' : 'visible'} successfully`
				)
			}
		} catch (error) {
			toast.error(`Error while ${isHide ? 'hiding' : 'visible'}`)
		}
	}

	// Reorder theme list
	const moveSelectedCategory = async (result) => {
		setReorderedList(true)
		if (!result || !result.destination) return
		const { source, destination, draggableId } = result
		const items = Array.from(list)
		const [reorderedItem] = items.splice(source.index, 1)
		items.splice(destination.index, 0, reorderedItem)
		setList(items)
		setReorderRes(true)
		// const _id = draggableId
		// const from = source?.index + 1
		// const to = destination?.index + 1
		// const data = {
		// 	from: from,
		// 	to: to,
		// 	_id: _id,
		// }

		// try {
		// 	await reorderThemeList(data)
		// } catch (error) {
		// 	toast.error('Error while moving item:', error)
		// }
	}

	// Handle edit theme
	const handleEdit = (type, id) => {
		let nav = ''
		switch (type) {
			case ThemeType.PRODUCTS:
				nav = 'products'
				break
			case ThemeType.SLIDESHOW:
				nav = 'slideshow'
				break
			case ThemeType.TAGLINE:
				nav = 'tagline'
				break
			case ThemeType.REVIEWS:
				nav = 'reviews'
				break
			case ThemeType.ABOUT_US:
				nav = 'about-us'
				break
			case ThemeType.CATALOG:
				nav = 'catalog'
				break
			default:
				break
		}
		navigate(`/theme/${nav}/${id}`)
	}

	const handleReorder = async () => {
		try {
			const ThemeIds = list.map((item) => item?._id)

			let res = await reorderThemeList(ThemeIds)

			if (res) {
				toast.success('Reorder successfully')
				setReorderedList(false)
			}
		} catch (error) {
			toast.error('Error while reordering')
		}
	}

	return (
		<div className='container bg-white border border-gray-200  dark:bg-gray-800 dark:border-gray-700 '>
			<div className=' p-6  bg-white flex justify-between  border-b-2'>
				<button
					type='button'
					className='text-black bg-[#edf1f7]  hover:bg-slate-300   focus:bg-[#edf1f7] font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer disabled:bg-slate-200'
					onClick={() => (isReorder ? setIsReorder(false) : setIsReorder(true))}
					disabled={!isReorder && list?.length <= 1}
				>
					{isReorder ? (
						<>
							<IoArrowBack size={20} className='mr-1' />
							GO BACK
						</>
					) : (
						<>
							<IoMdReorder size={20} />
							REORDER
						</>
					)}
				</button>
				<p className='text-3xl font-semibold'>Theme Preview</p>

				{isReorder ? (
					<Button onClick={handleReorder} disabled={!isReorderedList}>
						Save Changes
					</Button>
				) : (
					<Button
						onClick={() => setIsAddComponentModalOpen(true)}
						disabled={isReorder}
					>
						<MdOutlinePostAdd size={20} className='mr-1' />
						ADD COMPONENT
					</Button>
				)}
			</div>

			{!isListLoading ? (
				<div className=' p-6  bg-slate-100  flex flex-col gap-4 w-full overflow-auto'>
					<div className='relative flex flex-col w-full max-h-[80vh] overflow-y-auto'>
						{isReorder ? (
							<DragDropContext onDragEnd={moveSelectedCategory}>
								<Droppable droppableId='product-list'>
									{(provided) => (
										<div
											className='w-full'
											ref={provided.innerRef}
											{...provided.droppableProps}
										>
											{list ? (
												list?.map((item, index) => (
													<Draggable
														key={item?._id}
														draggableId={item?._id}
														index={index}
													>
														{(provided, snapshot) => (
															<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
															>
																<div
																	key={item?._id}
																	className='flex items-center bg-slate-100 border-b hover:bg-slate-200 cursor-pointer mt-4 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 justify-between'
																>
																	<div className=' gap-3 p-3'>
																		<div className='flex flex-col w-32 truncate'>
																			<h2 className='max-w-24 font-bold capitalize truncate'>
																				{item?.title ||
																					(item?.type === 4 && 'Tagline') ||
																					(item?.type === 3 && 'SlideShow') ||
																					'default_name'}
																			</h2>
																		</div>
																		<span>
																			( {item?.themes?.length}
																			{item?.themeTypeText})
																		</span>
																	</div>
																	<ToggleSwitch
																		checked={!item?.hidden}
																		label={
																			<span className='font-bold'>
																				{item?.hidden ? 'Hidden' : 'Visible'}
																			</span>
																		}
																		onChange={() => {
																			const updatedList = [...list]
																			updatedList[index].hidden =
																				!updatedList[index].hidden
																			setList(updatedList)
																			hideUnhidePreview(item?._id, item?.hidden)
																		}}
																	/>
																	<Dropdown
																		label={
																			<span className='font-bold'>EDIT</span>
																		}
																		size='sm'
																		inline={true}
																		theme={{
																			inlineWrapper:
																				'text-black bg-[#edf1f7] hover:bg-[#f7f9fc] focus:bg-[#edf1f7]  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  me-2',
																		}}
																	>
																		<Dropdown.Item
																			className='border-b'
																			onClick={() =>
																				handleEdit(item?.type, item?._id)
																			}
																		>
																			Edit
																		</Dropdown.Item>

																		<Dropdown.Item
																			onClick={() => handleDelete(item?._id)}
																		>
																			Delete
																		</Dropdown.Item>
																	</Dropdown>
																</div>
															</div>
														)}
													</Draggable>
												))
											) : (
												<div className='h-10'>
													<span className='text-rose-500 p-6'>
														No Theme Available
													</span>
												</div>
											)}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
						) : (
							list?.map((theme, index) => {
								const { Icon } = theme
								const selectedTheme = themeOptions?.find(
									(item) => item?.type === theme?.type
								)

								return (
									<div
										key={theme?._id}
										className='bg-white border-2 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4'
									>
										<div className='border-b-2 p-6 '>
											<div className='flex items-center justify-between'>
												<div className='md:w-[200px]'>
													<div className='flex items-center'>
														<Icon size={20} />
														<p className='m-0 font-bold ps-1 capitalize'>
															{theme?.title} - {selectedTheme?.nav}
														</p>
													</div>
													<span>
														{/* If its Tagline then show content otherwise Count of themes */}
														{theme?.type === 4
															? theme?.tagline
															: `(${theme?.themes?.length} ${theme?.themeTypeText})`}
													</span>
												</div>

												<ToggleSwitch
													checked={!theme.hidden}
													label={
														<span className='font-bold'>
															{' '}
															{theme.hidden ? 'Hidden' : 'Visible'}
														</span>
													}
													onChange={() => {
														const updatedList = [...list]
														updatedList[index].hidden =
															!updatedList[index].hidden
														setList(updatedList)
														hideUnhidePreview(theme?._id, theme?.hidden)
													}}
												/>
												<Dropdown
													label={<span className='font-bold'>EDIT</span>}
													size='sm'
													inline={true}
													theme={{
														inlineWrapper:
															'text-black bg-[#edf1f7] hover:bg-[#f7f9fc] focus:bg-[#edf1f7]  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
													}}
												>
													<Dropdown.Item
														className='border-b'
														onClick={() => handleEdit(theme?.type, theme?._id)}
													>
														Edit
													</Dropdown.Item>

													<Dropdown.Item
														onClick={() => handleDelete(theme?._id)}
													>
														Delete
													</Dropdown.Item>
												</Dropdown>
											</div>
										</div>

										{/* Do Not Show Images in Tagline And Reviews */}
										{theme?.type !== 4 &&
											theme?.type !== 5 &&
											(theme?.themes?.length ? (
												<div className='p-6 flex overflow-auto'>
													{theme?.imgsArr?.map((img) => (
														<img
															src={img}
															key={img}
															alt='img'
															className='p-2 object-cover'
															width={100}
														/>
													))}
												</div>
											) : null)}
									</div>
								)
							})
						)}
					</div>

					<ThemeOptionsModal
						showModal={isAddComponentModalOpen}
						onCloseModal={() => setIsAddComponentModalOpen(false)}
						list={list}
					/>
				</div>
			) : (
				<Loader />
			)}
		</div>
	)
}
