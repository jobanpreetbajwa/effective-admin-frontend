import { toast } from 'sonner'
import { Button } from 'flowbite-react'
import { useState, useEffect } from 'react'

import BasicDetails from './components/basicDetails'
import StorePolicies from './components/storePolicies'
import PaymentDetails from './components/paymentDetails'
import SocialAccounts from './components/socialAccounts'
import GeneralSettings from './components/generalSettings'
import { sendMultipleImages } from '../utilis/sendMultipleImages'
import { getSettingsData, updateSettingsData } from '../../api/function'
import ShowPrice_onStatus from './components/showPrice_onStatus'
import OrderSettings from './components/orderSettings'

export default function Settings() {
	// State to store the form data
	const [formData, setFormData] = useState({
		img_ids: [],
		business_name: '',
		phone_number: '',
		store_address: '',
		your_name: '',
		email: '',
		facebook_link: '',
		insta_link: '',
		privacy_policy: '',
		return_policy: '',
		shipping_policy: '',
		terms_conditions: '',
		payment_policy: '',
		about_us: '',
		online_payment: 1,
		cash_on_delivery: 1,
		settle_offline: 1,
		currency: 'INR',
		set_tax_rate: '',
		gst_number: '',
		online_payment_desc: '',
		cash_on_delivery_desc: '',
		settle_offline_desc: '',
		price_status_toggle: [],
		orders_allowed: 1,
	})

	const [isChange, setIsChange] = useState(false)

	// State to store the loading status
	const [isLoading, setIsLoading] = useState(false)

	// State to store the logo image (If Available)
	const [logoImage, setLogoImage] = useState(null)

	// State to store the logo image to send
	const [logoImageSend, setLogoImageSend] = useState(null)

	// Function to handle the form submit
	const handleFormSubmit = async (event) => {
		event.preventDefault()
		setIsLoading(true)
		let img_ids = [formData?.img_ids?.[0]?._id]

		// If logo image is selected, send the File Object Array to the API and get the ImageIds To Bind with the Form Data
		if (logoImageSend) {
			img_ids = await sendMultipleImages([logoImageSend])
		}

		// Generate the Payload to Send to the API
		const data = {
			update: {
				...formData,
				img_ids,
			},
		}

		// Call the API to Update the Settings Data with the Payload
		const promise = updateSettingsData(data).then((result) => {
			setLogoImageSend(null)
			setFormData(result?.data)
			setLogoImage(result?.data?.img_ids?.[0]?.url)
		})

		// Show the Toast Notification based on the Promise Status
		toast.promise(promise, {
			loading: 'Uploading...',
			success: () => {
				return `Profile updated successfully!`
			},
			error: "Couldn't update profile!",
			finally: () => {
				setIsLoading(false)
				setIsChange(false)
			},
		})
	}

	// Function to handle the image upload and set the image to the state
	const handleImageChange = (event) => {
		setLogoImageSend(event.target.files[0])

		setIsChange(true)
	}

	// Function to handle the input change
	const handleInputChange = (event) => {
		const { name, value } = event.target
		setFormData({
			...formData,
			[name]: value,
		})
		setIsChange(true)
	}

	const handleStatusChange = (statusArray) => {
		setFormData({
			...formData,
			price_status_toggle: [...statusArray],
		})
		setIsChange(true)
	}

	// Fetch the Settings Data from the API and Update the State
	useEffect(() => {
		setIsLoading(true)

		getSettingsData()
			.then((response) => {
				setFormData(response?.data)
				setLogoImage(response?.data?.img_ids?.[0]?.url)
			})
			.catch((error) => {
				console.error(error)
				toast.error('Something went wrong!', {
					id: 'fetchingSettings',
				})
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])

	return (
		<form onSubmit={handleFormSubmit}>
			<div className='grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900 overflow-hidden'>
				<div className='mb-4 col-span-full xl:mb-2'>
					<div className='flex justify-between items-center'>
						<h1 className='text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white'>
							Store Profile
						</h1>
						<div className='col-span-6 sm:col-full'>
							<Button type='submit' disabled={isLoading || !isChange}>
								Save Changes
							</Button>
						</div>
					</div>
				</div>

				{/* Left Content */}
				<div className='col-span-2'>
					<BasicDetails
						formData={formData}
						logoImage={logoImage}
						setLogoImage={setLogoImage}
						logoImageSend={logoImageSend}
						setLogoImageSend={setLogoImageSend}
						handleInputChange={handleInputChange}
						handleImageChange={handleImageChange}
					/>

					<StorePolicies
						formData={formData}
						handleInputChange={handleInputChange}
					/>

					<PaymentDetails
						formData={formData}
						setFormData={setFormData}
						handleInputChange={handleInputChange}
					/>
				</div>

				{/* Right Content */}
				<div className='col-span-full xl:col-auto'>
					<SocialAccounts
						formData={formData}
						handleInputChange={handleInputChange}
					/>

					<GeneralSettings
						formData={formData}
						handleInputChange={handleInputChange}
					/>
					<ShowPrice_onStatus
						price_status_toggle={formData?.price_status_toggle}
						handleStatusChange={handleStatusChange}
					/>

					<OrderSettings
						formData={formData}
						handleInputChange={handleInputChange}
					/>
				</div>
			</div>
		</form>
	)
}
