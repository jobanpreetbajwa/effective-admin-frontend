import { Table, Button } from 'flowbite-react'

import ExcelContent from './excelContent'
import { capitalizeFirstLetter } from '../../../../../utils/function'

import { IoIosArrowRoundBack } from 'react-icons/io'

export default function Excel({
	excelData,
	setBulkProducts,
	setExcelData,
	setPreview,
}) {
	const saveHandler = () => {
		const updatedData = excelData
			.filter((item) => {
				return (
					item?.['Product Name']?.length &&
					item?.['Price'] !== null &&
					item?.['Price'] !== undefined &&
					item?.['image']
				)
			})
			.map((item) => {
				return {
					uuid: item?.uuid || Math.random(),
					name: capitalizeFirstLetter(item?.['Product Name']),
					images: [item?.['image']],
					mrp_price: item?.['Price'],
					unique_id: item?.['Product Id'],
					is_pricing: item?.['showPrice'],
					prod_status: item?.['Product Status'],
				}
			})

		console.log(updatedData, 'updatedData')

		const remainingData = excelData?.filter((item) => {
			const existsInUpdatedData = updatedData.some((updatedItem) => {
				return updatedItem.uuid === item.uuid
			})

			return !existsInUpdatedData
		})

		setExcelData(remainingData)
		setBulkProducts((prev) => {
			return [...prev, ...updatedData]
		})
	}

	const discardHandler = () => {
		setExcelData(null)
		setPreview(false)
	}

	return (
		<div className='p-4'>
			<div className='mb-4'>
				<div className='flex justify-between items-center pr-8'>
					<button
						className='flex gap-1 items-center'
						onClick={() => setPreview(false)}
					>
						<IoIosArrowRoundBack size={32} />
						<p className='text-xl'>Back</p>
					</button>

					<div className='flex gap-3'>
						<Button className='w-28' onClick={discardHandler}>
							Discard
						</Button>
						<Button className='w-28' onClick={saveHandler}>
							Save
						</Button>
					</div>
				</div>

				<div className='my-4 flex gap-3 items-center'>
					<h1 className='font-bold text-2xl'>Excel Preview</h1>

					<p className='text-rose-400 text-sm font-bold flex flex-col justify-end'>
						Rows with background in red are incomplete.
					</p>
				</div>
			</div>

			<Table>
				<Table.Head>
					<Table.HeadCell className=''>
						<div className='flex gap-2'>
							<p className='w-12 text-nowrap'>Sr No.</p>
							<p>
								Product name <span className='text-rose-600'>*</span>
							</p>
						</div>
					</Table.HeadCell>

					<Table.HeadCell>Product ID</Table.HeadCell>

					<Table.HeadCell>
						Product Status
						<span className='text-rose-600'>*</span>
					</Table.HeadCell>

					<Table.HeadCell>
						Show Price To Customer
						<span className='text-rose-600'>*</span>
					</Table.HeadCell>

					<Table.HeadCell>
						Price
						<span className='text-rose-600'>*</span>
					</Table.HeadCell>

					<Table.HeadCell>
						media
						<span className='text-rose-600'>*</span>
					</Table.HeadCell>
				</Table.Head>

				<Table.Body className='divide-y '>
					{excelData && excelData?.length
						? excelData.map((item, index) => {
								return (
									<ExcelContent
										item={item}
										key={item?.uuid}
										itemIndex={index}
										setExcelData={setExcelData}
									/>
								)
						  })
						: null}
				</Table.Body>
			</Table>
		</div>
	)
}
