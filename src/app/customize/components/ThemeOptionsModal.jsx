import { Modal } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { themeOptions } from '../../constant/dashboard/constant'

const ThemeOptionsModal = ({ showModal, onCloseModal, list }) => {
	const navigate = useNavigate()

	// navigate to the selected theme
	const handleClick = (nav) => {
		if (nav) {
			navigate(`/theme/${nav}`)
		}
		onCloseModal()
	}

	let filteredThemeOptions = themeOptions

	// make the theme options not clickable if the user has already selected the theme
	const notClickable = (type) => {
		return Boolean(list.filter((item) => item?.type === type).length)
	}

	return (
		<Modal show={showModal} size='xl' onClose={onCloseModal} dismissible>
			<Modal.Body>
				<div className='pb-8 flex flex-col gap-3 justify-center items-center'>
					<span className='text-3xl font-semibold'>Theme options</span>
					<hr className='w-full' />
				</div>
				<div className='grid grid-cols-3 gap-3 gap-x-0 place-items-center '>
					{filteredThemeOptions?.map((item, key) => {
						const { Icon } = item
						let type = null

						if (item?.nav === 'tagline') {
							type = 4
						}
						if (item?.nav === 'reviews') {
							type = 5
						}

						return (
							<div
								key={key}
								className={`w-32 h-32 rounded border grid grid-rows-2 place-items-center text-center border-blue-200   dark:bg-blue-800 dark:border-blue-700 ${
									(item?.nav === 'tagline' || item?.nav === 'reviews') &&
									notClickable(type)
										? 'opacity-50 cursor-not-allowed'
										: 'opacity-100 cursor-pointer hover:border-blue-300 hover:bg-blue-100'
								}`}
								onClick={() => {
									if (
										(item?.nav === 'tagline' || item?.nav === 'reviews') &&
										notClickable(type)
									) {
										return
									} else handleClick(item?.nav)
								}}
							>
								{<Icon size={20} />}
								<p className='mb-3 font-normal text-gray-500 dark:text-gray-400'>
									{item?.title}
								</p>
							</div>
						)
					})}
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default ThemeOptionsModal
