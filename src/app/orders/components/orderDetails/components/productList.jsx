import { Link } from 'react-router-dom'
import { MRP_PRICE_FIXED_VALUE } from '../../../../constant/products/constant'

export default function ProductList({ product, index }) {
	return (
		<div className='grid grid-cols-8 place-items-center gap-6'>
			<div className='col-span-1'>{index + 1}</div>

			{product?.productId?.deletedAt ? (
				<div className='col-span-3 flex gap-2 items-center w-full'>
					<img
						src={product?.productId?.img_ids[0]?.url}
						alt={product?.productId?.name}
						className='w-16 h-16'
					/>
					<div>
						<p className='text-pretty'>
							{product?.productId?.name}
							<span className='text-rose-600'>{` (Deleted)`}</span>
						</p>
						<p>{`${product?.quantity} Quantity`}</p>
					</div>
				</div>
			) : (
				<Link
					to={`/products/${product?.productId?.category}/details/${product?.productId?._id}`}
					className='col-span-3 flex gap-2 items-center w-full'
				>
					<img
						src={product?.productId?.img_ids[0]?.url}
						alt={product?.productId?.name}
						className='w-16 h-16'
					/>
					<div>
						<p className='text-pretty'>{product?.productId?.name}</p>
						<p>{`${product?.quantity} Quantity`}</p>
					</div>
				</Link>
			)}

			<p className='col-span-2'>{`₹${
				product?.price?.toFixed(MRP_PRICE_FIXED_VALUE) || ' N/A '
			} x ${product?.quantity}`}</p>

			<p className='col-span-2 font-semibold'>
				₹
				{(product?.price * product?.quantity).toFixed(MRP_PRICE_FIXED_VALUE) ||
					' N/A '}
			</p>
		</div>
	)
}
