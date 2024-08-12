import { FaFilter } from 'react-icons/fa'
import { Checkbox, Dropdown, Label } from 'flowbite-react'

//DropdownList component renders a list of tags as dropdown items, allowing users to filter products based on their tags
const DropdownList = ({ tag, handleTagChange, filterTags }) => {
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
					checked={filterTags?.find((item) => item === tag?._id)}
				/>
				{tag?.name}
			</Label>
		</Dropdown.Item>
	)
}

function FilterProducts({
	tags,
	filterTags,
	searchedItem,
	setFilterTags,
	allFilterTags,
	setAllFilterTags,
}) {
	//handleTagCheckBox function toggles the selection status of tag checkboxes, updating the filter tags state based on whether the checkbox is checked or unchecked
	const handleTagChange = (id) => {
		const newFilterTags = filterTags.includes(id)
			? filterTags.filter((tagId) => tagId !== id)
			: [...filterTags, id]
		setFilterTags(newFilterTags)
	}

	const handleSelectAllChange = () => {
		if (allFilterTags) {
			setFilterTags([])
			setAllFilterTags(false)
		} else {
			setFilterTags(tags.map((tag) => tag._id))
			setAllFilterTags(true)
		}
	}

	return (
		<Dropdown
			size='xs'
			dismissOnClick={false}
			label={<FaFilter size={14} />}
			disabled={searchedItem ? true : tags?.length ? false : true}
		>
			<Dropdown.Header>
				<span className='block text-sm'>Filter Using Tags</span>
			</Dropdown.Header>

			{tags && tags?.length ? (
				<Dropdown.Item className='text-left p-0'>
					<Label
						htmlFor='allFilterTags'
						className='w-full h-full flex items-center gap-2 cursor-pointer px-4 py-2'
					>
						<Checkbox
							value=''
							id='allFilterTags'
							checked={allFilterTags}
							onChange={handleSelectAllChange}
						/>
						All
					</Label>
				</Dropdown.Item>
			) : null}

			{tags && tags?.length
				? tags.map((tag, index) => (
						<DropdownList
							tag={tag}
							key={tag?._id}
							index={index + 1}
							filterTags={filterTags}
							handleTagChange={handleTagChange}
						/>
				  ))
				: null}
		</Dropdown>
	)
}

export default FilterProducts
