import { toast } from 'sonner'
import { useState } from 'react'
import { Table, Button, TextInput } from 'flowbite-react'
import { useParams, useLocation } from 'react-router-dom'

import { IoIosArrowRoundBack } from 'react-icons/io'

import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'
import TableRow from './component/tableRow'
import { updateProductPrices } from '../../../../api/function'

export default function EditBulkPrice() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { state } = useLocation()
	const { categoryID } = useParams()

	const [selectedProductsData, setSelectedProductsData] = useState(state || [])

	const categoryListSelector = useSelector((state) => state.categoryList)

	const category = categoryListSelector.find((item) => item?._id === categoryID)

	const [bulkProducts, setBulkProducts] = useState([])

	const [isUpdatingAdding, setIsProductsUpdating] = useState(false)

	const deleteRowHandler = (index) => {
		const updatedBulkProducts = [...bulkProducts]
		updatedBulkProducts.splice(index, 1)
		setBulkProducts(updatedBulkProducts)
	}

	const handleUpdatePrices = () => {
		const payload = selectedProductsData.map((obj) => ({
			_id: obj?._id,
			mrp_price: obj?.mrp_price,
		}))
		setIsProductsUpdating(true)

		updateProductPrices({ data: payload })
			.then((result) => {
				toast.success('Prices updated successfully')
			})
			.catch((error) => {
				toast.error('Error while updating prices')
				console.error(error)
			})
			.finally(() => {
				setIsProductsUpdating(false)
			})
	}

	return (
		<div className='flex flex-col gap-8 p-8'>
			<div
				className={`flex flex-col gap-3 ${
					isUpdatingAdding ? 'opacity-50' : 'opacity-100'
				}`}
			>
				<div
					onClick={() => navigate(-1)}
					className='w-fit flex items-center cursor-pointer'
				>
					<IoIosArrowRoundBack size={32} />
					<p>Back </p>
				</div>
				<div className='flex justify-between items-center'>
					<h1 className='text-2xl font-semibold'>
						Bulk Edit Price
						{`${
							category?.category_name ? 'in ' + category?.category_name : ''
						}`}
					</h1>
					<Button onClick={handleUpdatePrices} disabled={isUpdatingAdding}>
						Update Prices
					</Button>
				</div>
			</div>

			<div className='w-full max-h-[80vh] overflow-auto'>
				<Table striped>
					<Table.Head>
						<Table.HeadCell className='flex text-nowrap gap-4'>
							<div className='w-20'>Sr. No.</div>
							<div>
								Product name<span className='text-rose-600'>*</span>
							</div>
						</Table.HeadCell>

						<Table.HeadCell>
							Price
							<span className='text-rose-600'>*</span>
						</Table.HeadCell>
						{/* <Table.HeadCell>
              Discounted Price
              <span className='text-rose-600'>*</span>
            </Table.HeadCell> */}

						{/* <Table.HeadCell>
							<span className='sr-only'>Edit</span>
						</Table.HeadCell> */}
					</Table.Head>

					<Table.Body>
						{selectedProductsData &&
							selectedProductsData.map((product, index) => (
								<TableRow
									key={index}
									index={index}
									product={product}
									selectedProductsData={selectedProductsData}
									setSelectedProductsData={setSelectedProductsData}
								/>
							))}
					</Table.Body>
				</Table>
			</div>
		</div>
	)
}
