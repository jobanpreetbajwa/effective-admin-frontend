import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getCategory } from './api/function'
import Navbar from './app/navbarComponents/navbar'
import { syncCategoryList } from './store/slices/categoryList'

export default function App() {
	const dispatch = useDispatch()
	const [sidebar, setSideBar] = useState(false)

	const categoryListSelector = useSelector((state) => state.categoryList)

	useEffect(() => {
		const getCategoryList = async () => {
			try {
				const response = await getCategory()
				const responseData = response?.data
				if (responseData?.categories) {
					dispatch(syncCategoryList(responseData?.categories))
				}
			} catch (error) {
				console.log('Error while getting category list ', error)
			}
		}
		if (!categoryListSelector?.length) {
			getCategoryList()
		}
	}, [])

	return (
		<div className='h-screen flex justify-end'>
			<Navbar sidebar={sidebar} setSideBar={setSideBar} />

			<div
				className={`flex-col flex-1 transition-all duration-300 h-screen ${
					sidebar ? 'pl-12 ml-8 bg-white' : 'ml-40 pl-12 bg-white'
				}}`}
			>
				<Outlet />
			</div>
		</div>
	)
}
