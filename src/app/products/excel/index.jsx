import ExcelPage from './excelPage'
import { Button } from 'flowbite-react'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { IoIosArrowRoundBack } from 'react-icons/io'

export default function Excel() {
	const navigate = useNavigate()
	const productListSelector = useSelector((state) => state.currentProductList)
	const [productList, setProductList] = useState(null)
	let { categoryID } = useParams()

	//updates productList with the updated list from redux.
	useEffect(() => {
		setProductList(productListSelector[categoryID]?.products)
	}, [productListSelector])

	//Download excel file.
	const downloadExcel = () => {
		if (!productList) {
			return
		}
		const columns = [
			'Customer Name',
			'Contact Details',
			'Number of Orders',
			'Number of Enquiries',
			'Number of Views',
		]

		const data = productList?.map((item) => [
			item.customer_Name,
			item.contact_Details,
			item.orders,
			item.enquiries,
			item.views,
		])

		const workbook = XLSX.utils.book_new()

		const worksheet = XLSX.utils.aoa_to_sheet([columns, ...data])

		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

		const excelBuffer = XLSX.write(workbook, {
			type: 'array',
			bookType: 'xlsx',
		})

		const blob = new Blob([excelBuffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		})

		const url = URL.createObjectURL(blob)

		const link = document.createElement('a')
		link.href = url
		link.download = 'example.xlsx'

		document.body.appendChild(link)

		link.click()

		document.body.removeChild(link)
		URL.revokeObjectURL(url)
	}

	return (
		<div className='w-full h-full flex flex-col gap-3 p-6'>
			<div className='flex justify-between items-center'>
				<div>
					<button
						className={`flex items-center `}
						onClick={() => {
							navigate(-1)
						}}
					>
						<IoIosArrowRoundBack className='text-3xl -ml-1' />
						<p>Back </p>
					</button>
					<h1 className='text-2xl font-semibold'>Excel Download</h1>
				</div>

				<Button onClick={downloadExcel}>
					<p>Download</p>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth='1.5'
						stroke='currentColor'
						className='w-6 h-4'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
						/>
					</svg>
				</Button>
			</div>
			<div>
				<ExcelPage productList={productList} />
			</div>
		</div>
	)
}
