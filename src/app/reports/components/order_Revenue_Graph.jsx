import { CChart } from '@coreui/react-chartjs'
export default function Order_Revenue_Graph({ options, graphData, type }) {
	return (
		<>
			<div className='w-full lg:w-1/2 bg-white  rounded'>
				<div className='pt-2 flex gap-3  justify-center font-semibold '>
					Orders{' '}
					{type === '0'
						? 'of today'
						: type === '1'
						? 'of current week'
						: 'of current month'}
				</div>

				<div className=' p-4'>
					<CChart
						className='cursor-pointer relative w-full p-4'
						type='line'
						style={{ height: '300px' }}
						options={options}
						data={{
							labels: graphData.labels,
							datasets: [
								{
									label: 'Orders',
									backgroundColor: 'rgba(151, 187, 205, 0.2)',
									borderColor: 'rgba(151, 187, 205, 1)',
									pointBackgroundColor: 'rgba(151, 187, 205, 1)',
									pointBorderColor: 'rgba(151, 187, 205, 1)',
									data: graphData?.yaxisOrders?.map((val) => val),
									pointBorderWidth: 3,
									pointHoverRadius: 5,
									pointHoverBorderWidth: 2,
									pointRadius: 1,
									pointHitRadius: 10,
								},
							],
						}}
					/>
				</div>
			</div>
			<div className='w-full lg:w-1/2 bg-white  rounded'>
				<div className='pt-2 flex gap-3 justify-center font-semibold'>
					Revenue{' '}
					{type === '0'
						? 'of today'
						: type === '1'
						? 'of current week'
						: 'of current month'}
				</div>
				<div className='p-4'>
					<CChart
						type='line'
						style={{ height: '300px' }}
						className='cursor-pointer relative w-full p-4'
						options={options}
						data={{
							labels: graphData.labels,
							datasets: [
								{
									label: 'Revenue',
									backgroundColor: 'rgba(220, 220, 220, 0.2)',
									borderColor: 'rgba(255, 0, 0, 1)',
									pointBackgroundColor: 'rgba(255, 0, 0, 1)',
									pointBorderColor: 'rgba(255, 0, 0, 1)',

									data: graphData?.yaxisRevenue?.map((val) => val),
									pointBorderWidth: 3,
									pointHoverRadius: 5,
									pointHoverBorderWidth: 2,
									pointRadius: 1,
									pointHitRadius: 10,
								},
							],
						}}
					/>
				</div>
			</div>
		</>
	)
}
