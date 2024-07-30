import { useState } from 'react'
import TagDeleteModal from '../modal/tagDeleteModal'
import { DELETE_ACTION_TYPE } from '../../staticData/constantActions'

import { FaCheck } from 'react-icons/fa'
import { TiDelete } from 'react-icons/ti'

export default function Chips({
	label,
	handleClick,
	variant,
	editable = false,
	closeIcon = true,
	selectTag,
	onClick,
	filled,
}) {
	const [selected, setSelected] = useState(false)
	const [askConfirmation, setAskConfirmation] = useState(false)

	const chipSelected = (action) => {
		setSelected(!selected)
		if (editable) {
			setAskConfirmation(true)
		} else {
			handleClick(label, action)
		}
	}
	return (
		<>
			{askConfirmation && (
				<TagDeleteModal
					name={label}
					setAskConfirmation={setAskConfirmation}
					deleteFunction={() => handleClick(label, DELETE_ACTION_TYPE)}
				/>
			)}
			<div
				onClick={onClick ?? selectTag}
				className={`relative flex items-center gap-1 border rounded py-1 px-2 text-sm font-extralight  ${
					variant === 'outlined' ? 'outlined' : ''
				} ${
					filled ? 'bg-[#0E7490] text-white' : 'cursor-pointer border-black/40'
				}`}
			>
				{filled && <FaCheck />}
				<span className='font-medium'>{label}</span>
				{closeIcon && (
					<TiDelete
						className='absolute -top-3 -right-3 opacity-100 hover:text-rose-900 rounded-full text-rose-600'
						size={20}
						onClick={(e) => {
							e.stopPropagation()
							chipSelected(DELETE_ACTION_TYPE)
						}}
					/>
				)}
			</div>
		</>
	)
}
