import { Link } from 'react-router-dom'
import { MRP_PRICE_FIXED_VALUE } from '../../../../constant/products/constant'

export default function ProductList({ product, index }) {

	return (
		<tr className='border-b dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600'>
			<td className='px-6 py-4'>{index + 1}</td>

			<td className='font-bold px-6 py-4'>
				<div className=''>
					{product?.productId?.deletedAt ? (
						<div className='grid grid-cols-5 items-center gap-2'>
							<div className='col-span-3 xl:col-span-2'>
								<img
									src={product?.productId?.img_ids?.[0]?.url}
									alt={product?.productId?.name}
									className='w-20 h-20 object-contain rounded bg-white dark:bg-neutral-800'
								/>
							</div>

							<div className='col-span-2 xl:col-span-3 text-pretty'>
								{product?.productId?.name}
								<span className='text-rose-600'>{` (Deleted)`}</span>
							</div>
						</div>
					) : (
						<Link
							to={`/products/${product?.productId?.category}/details/${product?.productId?._id}`}
							className='grid grid-cols-5 items-center gap-2'
						>
							<div className='col-span-3 xl:col-span-2'>
								<img
									src={product?.productId?.img_ids?.[0]?.url}
									alt={product?.productId?.name}
									className='w-20 h-20 object-contain rounded bg-white dark:bg-neutral-800'
								/>
							</div>

							<div className='col-span-2 xl:col-span-3  text-pretty'>
								{product?.productId?.name}
							</div>
						</Link>
					)}
				</div>
			</td>

			<td className='px-6 py-4'>{product?.productId?._id || 'N/A'}</td>
			<td className='px-6 py-4'>{product?.size?.size || 'N/A'}</td>
			<td className='px-6 py-4'>{`₹${
				product?.productId.mrp_price?.toFixed(MRP_PRICE_FIXED_VALUE) || ' N/A '
			} x ${product?.quantity}`}</td>

			<td className='px-6 py-4 font-bold'>
				₹
				{(product?.productId.mrp_price * product?.quantity).toFixed(MRP_PRICE_FIXED_VALUE) ||
					' N/A '}
			</td>
		</tr>
	)
}
