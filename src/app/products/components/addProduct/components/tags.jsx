import { Button, TextInput } from 'flowbite-react'
import Chips from '../../../chips/chips'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { addNewSubcategoryIn_Category } from '../../../../../store/slices/categoryList'
import { addTagsInCategory } from '../../../../../api/function'
import { DETAILS_PRODUCT_ACTION_TYPE } from '../../../../staticData/constantActions'
export default function TagsComponent({
	tags,
	action,
	setTags,
	showTags,
	categoryID,
	setShowTags,
	disabledTags,
	setDisabledTags,
	selectedTags,
	setSelectedTags,
}) {
	const dispatch = useDispatch()

	const AddTags = async () => {
		if (!document.getElementById('tags').value) return

		if (
			showTags
				.map((tag) => tag.name)
				.includes(document.getElementById('tags').value)
		) {
			toast.warning('Tag already added')
			return
		}

		let headersList = {
			Accept: '*/*',
			'Content-Type': 'application/json',
		}

		let bodyContent = {
			name: document.getElementById('tags').value,
		}

		let response = await addTagsInCategory({
			categoryID: categoryID,
			data: bodyContent,
		})

		let data = response.data

		setShowTags([...showTags, data])
		dispatch(addNewSubcategoryIn_Category({ _id: categoryID, newTag: data }))
	}

	return (
		<div className='col-span-6 pb-6 '>
			<h2 className='text-base font-semibold leading-7 text-gray-900'>Tags</h2>

			<div className='my-4 flex flex-wrap gap-x-2 gap-y-1'>
				Available Tags:
				{showTags ? (
					showTags?.length ? (
						showTags?.map((item, index) => {
							return (
								<Chips
									key={item?.name || index}
									label={item?.name}
									handleClick={() => {
										if (action === DETAILS_PRODUCT_ACTION_TYPE) {
											return
										} else {
											if (tags && tags.includes(item?._id)) {
												setTags(tags.filter((tag) => tag !== item?._id))
											} else setTags([...tags, item?._id])
										}
									}}
									variant={tags && tags.includes(item) ? 'outlined' : ''}
									selectTag={() => {
										//push item to selectedTags if not already present item has a unique id
										if (action === DETAILS_PRODUCT_ACTION_TYPE) {
											return
										} else {
											if (
												selectedTags &&
												selectedTags.filter((tag) => tag._id === item._id)
													.length === 0
											) {
												setSelectedTags([...selectedTags, item])
											}
										}
									}}
									filled={
										selectedTags &&
										selectedTags.filter((tag) => tag._id === item._id).length >
											0
											? true
											: false
									}
									closeIcon={false}
								/>
							)
						})
					) : (
						<p className='text-gray-500'>No tags available in this category</p>
					)
				) : null}
			</div>

			{/* Add New Tags In Category */}
			{action !== DETAILS_PRODUCT_ACTION_TYPE && (
				<div className='flex gap-4 items-center '>
					<div className='relative'>
						<div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
							<svg
								className='w-4 h-4 text-gray-500 dark:text-gray-400'
								aria-hidden='true'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 20 20'
							>
								<path
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
								/>
							</svg>
						</div>

						<TextInput
							name='tags'
							id='tags'
							maxLength={50}
							onChange={(e) => {
								if (e.target.value !== '') {
									setDisabledTags(false)
								} else {
									setDisabledTags(true)
								}
							}}
							placeholder='Add tags'
						/>

						<Button
							type='button'
							disabled={disabledTags}
							className='text-white absolute end-0 h-full top-0 bg-blue-400  rounded-r-lg hover:bg-blue-800 rounded text-sm'
							onClick={(e) => {
								AddTags()
								document.getElementById('tags').value = ''
								setDisabledTags(true)
							}}
						>
							Add
						</Button>
					</div>
				</div>
			)}

			<div className='my-4 flex flex-wrap gap-x-2 gap-y-1'>
				Selected Tags:
				{selectedTags ? (
					selectedTags?.length ? (
						selectedTags?.map((item, index) => {
							return (
								<Chips
									key={item?.name || index}
									filled={true}
									label={item?.name}
									handleClick={() => {
										if (action === DETAILS_PRODUCT_ACTION_TYPE) {
											return
										} else {
											if (
												selectedTags &&
												selectedTags.filter((tag) => tag._id === item._id)
													.length === 0
											) {
												setSelectedTags([...selectedTags, item])
											} else {
												//remove item from selectedTags
												setSelectedTags(
													selectedTags.filter((tag) => tag._id !== item._id)
												)
											}
										}
									}}
									variant={tags && tags.includes(item) ? 'outlined' : ''}
									closeIcon={
										action === DETAILS_PRODUCT_ACTION_TYPE ? false : true
									}
								/>
							)
						})
					) : (
						<p className='text-gray-500'>No tags selected</p>
					)
				) : null}
			</div>
		</div>
	)
}
