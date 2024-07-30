import { FaWhatsapp, FaFacebookF } from 'react-icons/fa'

import { useNavigate } from 'react-router-dom'
import Statistic from './component/statistic'

export default function Dashboard() {
	const navigate = useNavigate()
	const Card = ({ title, icon, src, handleClick }) => {
		return (
			<div
				className='w-20 rounded border grid grid-rows-2 place-items-center text-center p-2 cursor-pointer'
				onClick={handleClick}
			>
				{icon && icon}
				{src && <img src={src} alt={title} width={'40px'} />}
				<p className='text-sm'>{title}</p>
			</div>
		)
	}

	return (
		<div className='w-full h-[100vh]'>
			<header className='p-4'>
				<h1 className='font-bold text-3xl'>Home</h1>
			</header>

			{/* Main content */}
			<div className='p-4 flex flex-col gap-4'>
				<div className='grid md:grid-cols-2 gap-4'>
					<div className='border rounded pb-4'>
						<div className='flex justify-between items-center h-1/2 bg-gray-200 p-2'>
							<div>
								<p className='font-semibold text-lg'>Your online store</p>
								<a
									href={import.meta.env.VITE_WEBSITE_URL}
									className='text-blue-600'
								>
									{import.meta.env.VITE_WEBSITE_URL}
								</a>
							</div>
						</div>

						<div className='p-2 flex flex-col gap-2'>
							<p>Share store link using</p>
							<div className='flex text-xl gap-2'>
								<div className='flex items-center justify-center p-2 bg-[#25D366] rounded-full'>
									<FaWhatsapp color='white' size={20} />
								</div>
								<div className='flex items-center justify-center p-2 bg-[#1877F2] rounded-full'>
									<FaFacebookF color='white' size={20} />
								</div>
							</div>
						</div>
					</div>
					{/* Store Stats */}
					<div className='border rounded'>
						<Statistic />
					</div>
				</div>

				{/* Your Services */}
				<div className='border p-4'>
					<h3 className='text-start pb-6'>Your Services</h3>
					<div className='flex flex-wrap gap-4'>
						<Card
							handleClick={() => navigate('/theme/list')}
							src='/spot_customizewebsite.png'
							title='Customize Website'
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
