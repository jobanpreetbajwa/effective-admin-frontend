import { TextInput } from 'flowbite-react'
import { capitalizeFirstLetter } from '../../../../utils/function'

const Tagline = ({ themeRender, title, handleTaglineChange }) => {
	return (
		<>
			<div className='p-6 bg-white border-b-2'>
				<p className='p-1'>{capitalizeFirstLetter(themeRender?.nav)} :</p>
				<TextInput
					name='title'
					value={title}
					onChange={handleTaglineChange}
					placeholder={`${capitalizeFirstLetter(themeRender?.nav)}`}
					maxLength={60}
				/>
			</div>
		</>
	)
}

export default Tagline
