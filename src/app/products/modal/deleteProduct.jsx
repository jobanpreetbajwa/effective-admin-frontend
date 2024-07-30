import { toast } from 'sonner'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, Modal } from 'flowbite-react'

import { deleteProduct } from '../../../api/function'
import { updateCategoryItemsCount } from '../../../store/slices/categoryList'
import { removeProductFromList } from '../../../store/slices/currentProductList'

export default function DeleteProduct({
	id,
	name,
	openModal,
	setOpenModal,
	selectedProductsData,
	setSelectedProductsData,
}) {
	const dispatch = useDispatch()
	const { categoryID } = useParams()
	const [isDeleting, setIsDeleting] = useState(false)

	function onCloseModal() {
		setOpenModal(false)
	}

	//makes Api call to delete products.
	const deleteHandler = () => {
		setIsDeleting(true)

		const promise = deleteProduct({ categoryID, productID: id })
			.then((response) => {
				setIsDeleting(false)

				return response.data
			})
			.catch(() => {
				throw new Error('Error while deleting product')
			})

		toast.promise(promise, {
			duration: 1000,
			loading: 'Loading...',
			success: () => {
				dispatch(removeProductFromList({ id, categoryID }))
				dispatch(
					updateCategoryItemsCount({ _id: categoryID, type: 'decrement' })
				)

				const freshData = selectedProductsData.filter((item) => {
					return item._id !== id
				})

				setSelectedProductsData(freshData)

				setOpenModal(false)
				return 'Product deleted successfully'
			},
			error: (err) => err || 'Error',
		})
	}
	return (
		<Modal
			show={openModal}
			size='xl'
			onClose={onCloseModal}
			dismissible
			popup
			onClick={(e) => {
				e.stopPropagation()
			}}
		>
			<Modal.Header className='p-6'>
				<h3 className='text-xl font-medium text-gray-900 dark:text-white'>
					Delete Product?
				</h3>
			</Modal.Header>
			<Modal.Body>
				<div className='space-y-6'>
					<div>
						<h2>Are you sure you want to delete {`'${name}'?`}</h2>
						<h2 className='text-rose-600 font-semibold'>
							Note: This will delete the product from the collection
						</h2>
					</div>
					<div className='flex gap-3 justify-start'>
						<Button
							disabled={isDeleting ? true : false}
							onClick={isDeleting ? null : deleteHandler}
							color={'failure'}
						>
							Yes,Delete
						</Button>
						<Button onClick={onCloseModal} outline>
							Cancel
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	)
}
