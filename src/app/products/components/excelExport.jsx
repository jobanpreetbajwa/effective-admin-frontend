import { toast } from 'sonner'
import { Button } from 'flowbite-react'
import { useParams } from 'react-router-dom'

import { exportExcelFile } from '../../utilis/excelUtils'
import { getCategoryProducts } from '../../../api/function'

import { MdOutlineFileDownload } from 'react-icons/md'

export default function ExcelExport() {
	let { categoryID } = useParams()

	const handleExcelExport = async () => {
		try {
			const products = await getAllProducts()

			const response = exportExcelFile(products)

			//stop the cursor event
			document.body.style = { cursor: 'wait', pointerEvents: 'none' }

			toast.promise(response, {
				loading: 'Exporting excel...',
				success: 'Excel exported successfully',
				error: 'Failed to export excel',
				finally: () => {
					//reset the cursor event
					document.body.style = { cursor: 'auto', pointerEvents: 'auto' }
				},
			})
		} catch (error) {
			console.error('Failed to export products:', error)
			toast.error('Failed to export excel')
		}
	}

	const getAllProducts = async () => {
		try {
			const response = await getCategoryProducts({ categoryID })

			return response?.data?.products
		} catch (error) {
			console.error('Failed to fetch products:', error)
			throw error // Re-throw error to be caught in handleExcelExport
		}
	}

	return (
		<Button
			className='flex w-44 md:w-36 items-center'
			disabled={!categoryID}
			onClick={handleExcelExport}
		>
			<span className='flex items-center gap-1'>
				Excel Export
				<MdOutlineFileDownload size={20} />
			</span>
		</Button>
	)
}
