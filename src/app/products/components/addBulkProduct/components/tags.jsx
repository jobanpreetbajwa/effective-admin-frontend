import { FaFilter } from 'react-icons/fa'
import { Checkbox, Dropdown, Label } from 'flowbite-react'

//DropdownList component renders a list of tags as dropdown items, allowing users to filter products based on their tags
const DropdownList = ({ tag, handleTagChange, selectedTags }) => {
	return (
		<Dropdown.Item className='text-left p-0'>
			<Label
				htmlFor={tag?._id}
				className='w-full h-full flex items-center gap-2 cursor-pointer px-4 py-2'
			>
				<Checkbox
					value=''
					id={tag?._id}
					onChange={() => handleTagChange(tag?._id)}
					checked={selectedTags?.find((item) => item === tag?._id)}
				/>
				{tag?.name}
			</Label>
		</Dropdown.Item>
	)
}

export default function Tags({
	tags,
	selectedTags = [],
	setSelectedTags,
	// allSelectedTags,
	// setAllSelectedTags,
}) {
	//handleTagCheckBox function toggles the selection status of tag checkboxes, updating the filter tags state based on whether the checkbox is checked or unchecked
	const handleTagChange = (id) => {
		const newFilterTags = selectedTags?.includes(id)
			? selectedTags?.filter((tagId) => tagId !== id)
			: [...selectedTags, id]

		setSelectedTags(newFilterTags)

		// if (tags?.length === newFilterTags?.length) {
		// 	setAllSelectedTags(true)
		// } else {
		// 	setAllSelectedTags(false)
		// }
	}

	// const handleSelectAllChange = () => {
	// 	if (allSelectedTags) {
	// 		setAllSelectedTags(false)
	// 		setSelectedTags([])
	// 	} else {
	// 		setSelectedTags(tags.map((tag) => tag._id))
	// 		setAllSelectedTags(true)
	// 	}
	// }

	return (
		<Dropdown
			size='xs'
			dismissOnClick={false}
			label={<FaFilter size={14} />}
			disabled={!tags?.length}
		>
			<Dropdown.Header>
				<span className='block text-sm'>Select Tags</span>
			</Dropdown.Header>

			{/* {tags && tags?.length ? (
				<Dropdown.Item className='text-left p-0'>
					<Label
						disabled={disabled}
						htmlFor='allSelectedTags'
						className='w-full h-full flex items-center gap-2 cursor-pointer px-4 py-2'
					>
						<Checkbox
							disabled={disabled}
							value=''
							id='allSelectedTags'
							checked={allSelectedTags}
							onChange={handleSelectAllChange}
						/>
						All
					</Label>
				</Dropdown.Item>
			) : null} */}

			{tags && tags?.length
				? tags.map((tag, index) => (
						<DropdownList
							tag={tag}
							key={tag?._id}
							index={index + 1}
							selectedTags={selectedTags}
							handleTagChange={handleTagChange}
						/>
				  ))
				: null}
		</Dropdown>
	)
}
