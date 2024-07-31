import { Table, Avatar, TextInput } from 'flowbite-react'

import { COLLECTION_NAME_MAX_LENGTH } from '../../../constant/products/constant'

import { MdOutlineDelete } from 'react-icons/md'

export default function BulkCollectionTabelBody({ item, onDelete, index }) {
	return (
		<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
			{/* Collection Name */}
			<Table.Cell className='w-1/4 font-medium'>
				<div className='w-full flex gap-12'>
					<span className='flex items-center justify-center'>{index + 1}</span>

					<div className='w-full min-w-64'>
						<TextInput
							disabled={item?.collectionName}
							placeholder='Collection name'
							value={item?.collectionName}
							maxLength={COLLECTION_NAME_MAX_LENGTH}
						/>
					</div>
				</div>
			</Table.Cell>

			{/* Collection Image */}
			<Table.Cell className='w-1/4'>
				<Avatar.Group>
					{item?.collection_img.map((img, i) => {
						return (
							<Avatar
								className='object-fit'
								img={URL.createObjectURL(img)}
								rounded
								stacked
								key={i}
							/>
						)
					})}
				</Avatar.Group>
			</Table.Cell>

			{/* Banner Images code this generic can work with multiple banner images also */}
			<Table.Cell className='w-1/4'>
				<Avatar.Group>
					{item?.banner_img.map((img, index) => (
						<Avatar
							className='object-fit'
							img={URL.createObjectURL(img)}
							rounded
							stacked
							key={index}
						></Avatar>
					))}
				</Avatar.Group>
			</Table.Cell>

			{/* Delete Button */}
			<Table.Cell className='w-1/12'>
				<MdOutlineDelete
					color='red'
					onClick={onDelete}
					className='hover:cursor-pointer hover:bg-gray-100 rounded p-1 text-3xl'
				/>
			</Table.Cell>
		</Table.Row>
	)
}
