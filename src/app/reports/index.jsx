import React from 'react'

import { Dropdown } from 'flowbite-react'
import { useState } from 'react'
import { useEffect } from 'react'
import {
	getReportData,
	getStatsData,
	getVisitorGraphData,
} from '../../api/function'
import { toast } from 'sonner'
import moment from 'moment'
import GraphShimmer from '../shimmer/graph'
import Today_Lastmonth_Stats from '../shimmer/today_Lastmonth_Stats'
import PendingOrdersStats from './components/pendingOrdersStats'
import StatsCard from './components/statsCard'
import './tooltip.css'
import ProductViewsStats from './components/productViewsStats'
import VisitorGraphShimmer from '../shimmer/visitorGraphShimmer'
import processGraphData from './utils/processGraphData'

import processVisitors from './utils/processVisitors'
import MergeLabelsForVisitors from './utils/mergeLabelsForVisitors'
import VisitorsGraph from './components/visitorsGraph'
import Order_Revenue_Graph from './components/order_Revenue_Graph'
import processUniqueVisitors from './utils/processUniqueVisitors'

export default function Reports() {
	const [type, setType] = useState('0')
	const [isStatsDataLoading, setIsStatsDataLoading] = useState(false)
	const [isGraphDataLoading, setIsGraphDataLoading] = useState(false)
	const [isVisitorGraphDataLoading, setIsVisitorGraphDataLoading] =
		useState(false)
	const [visitorGraphData, setVisitorGraphData] = useState(null)
	const [graphData, setGraphData] = useState({
		labels: [],
		yaxisRevenue: [],
		yaxisOrders: [],
	})
	const [todaysStatsData, setTodaysStatsData] = useState({
		orders: '',
		sales: '',
		visitors: '',
	})
	const [monthsStatsData, setMonthsStatsData] = useState({
		orders: '',
		sales: '',
		visitors: '',
	})
	const [weekStatsData, setWeekStatsData] = useState({
		orders: '',
		sales: '',
		visitors: '',
	})

	const options = {
		elements: { line: { tension: 0.3, spanGaps: false } },
		height: 50,
		maintainAspectRatio: false,
		legend: {
			display: true,
		},
		scales: {
			y: {
				ticks: {
					color: 'gray',
					precision: type === '0' ? 0 : undefined,
				},
			},
		},
		tooltip: {
			enabled: true,
		},
	}

	useEffect(() => {
		//Fetch total orders,total revenue and total unique visitors data for statistic card.

		const fetchstats = async () => {
			try {
				setIsStatsDataLoading(true)
				const dateObject = moment.utc()
				const formattedDate = dateObject
					.utcOffset('+05:30')
					.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
				getStatsData(formattedDate).then((response) => {
					if (response?.data) {
						setIsStatsDataLoading(false)
						setTodaysStatsData({
							orders: response?.data?.today?.orders,
							sales: response?.data?.today?.sales,
							visitors: response?.data?.today?.visitors,
						})
						setMonthsStatsData({
							orders: response?.data?.month?.orders,
							sales: response?.data?.month?.sales,
							visitors: response?.data?.month?.visitors,
						})
						setWeekStatsData({
							orders: response?.data?.week?.orders,
							sales: response?.data?.week?.sales,
							visitors: response?.data?.week?.visitors,
						})
					}
				})
			} catch (error) {
				setIsStatsDataLoading(false)
				toast.error('Something went wrong', {
					id: 'error',
				})
			}
		}
		fetchstats()
	}, [])

	useEffect(() => {
		//Fetch order & revenue graph data based on type

		const fetchReports = async () => {
			setIsGraphDataLoading(true)
			try {
				const dateObject = moment.utc()
				const formattedDate = dateObject
					.utcOffset('+05:30')
					.format('YYYY-MM-DDTHH:mm:ss.SSSZ')

				const data = type
				setGraphData((prev) => {
					return {
						labels: [],
						yaxisOrders: [],
						yaxisRevenue: [],
					}
				})
				const response = await getReportData(data, formattedDate)
				setIsGraphDataLoading(false)

				if (response?.data) {
					let revenue = []
					let daysArray = []
					let orders = []
					let months = []
					if (type === '0') {
						setGraphData(processGraphData(response?.data))
					} else if (type === '1') {
						response?.data.map((item, i) => {
							orders = [...orders, item?.totalOrders]
							daysArray = [...daysArray, item?.day]
							revenue = [...revenue, item?.revenue]
						})
						setGraphData({
							labels: daysArray,
							yaxisRevenue: revenue,
							yaxisOrders: orders,
						})
					} else {
						response?.data.map((item, i) => {
							orders = [...orders, item?.totalOrders]
							months = [...months, item?.month]
							revenue = [...revenue, item?.revenue]
						})
						setGraphData({
							labels: months,
							yaxisRevenue: revenue,
							yaxisOrders: orders,
						})
					}
				}
			} catch (error) {
				setIsGraphDataLoading(false)

				toast.error('Something went wrong', {
					id: 'error',
				})
			}
		}
		fetchReports()

		//Fetch visitor graph data based on type

		const fetchVisitorsData = async () => {
			try {
				const dateObject = moment.utc()
				const formattedDate = dateObject
					.utcOffset('+05:30')
					.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
				setIsVisitorGraphDataLoading(true)
				const response = await getVisitorGraphData({ formattedDate, type })
				setIsVisitorGraphDataLoading(false)
				if (type === '0') {
					const [uniqueData, redundantData] = response.data

					//Performing modifications on visitors graph data for today's data.

					const responseUnique = processUniqueVisitors(uniqueData.unique)

					const responseAll = processVisitors(redundantData.reduntant)

					const mergedData = MergeLabelsForVisitors(responseUnique, responseAll)
					setVisitorGraphData(mergedData)
				} else if (type === '1') {
					let labels = []
					let unique = []
					let redundant = []

					if (response?.data && response.data.length > 0) {
						response?.data?.forEach((item) => {
							labels.push(item?.day)
							unique.push(item?.uniqueVisitors)
							redundant.push(item?.redundantVisitors)
						})

						//Need to show labels from monday to sunday

						if (labels.length > 1) {
							labels = [...labels.slice(1), labels[0]]
							unique = [...unique.slice(1), unique[0]]
							redundant = [...redundant.slice(1), redundant[0]]
						}
					}

					setVisitorGraphData({
						labels: labels,
						unique: unique,
						redundant: redundant,
					})
				} else {
					let labels = []
					let unique = []
					let redundant = []

					response?.data.map((item, i) => {
						labels.push(item?.month)
						unique.push(item?.uniqueVisitors)
						redundant.push(item?.redundantVisitors)
					})

					setVisitorGraphData({
						labels: labels,
						unique: unique,
						redundant: redundant,
					})
				}
			} catch (error) {
				toast.error('Something went wrong', {
					id: 'error',
				})
			}
		}
		fetchVisitorsData()
	}, [type])

	return (
		<div className='flex flex-col gap-4 px-10 py-8 bg-slate-50'>
			<div className='grid grid-cols-1 gap-4'>
				<div className='flex justify-between items-center w-full '>
					<div className='p-2 text-2xl font-bold'>Your Reports</div>
					<Dropdown
						label={type === '0' ? 'Today' : type === '1' ? 'Weekly' : 'Monthly'}
						dismissOnClick={true}
						className='max-h-48 overflow-auto '
						style={{ width: '200px' }}
					>
						{type !== '0' && (
							<Dropdown.Item
								onClick={() => (type != '0' ? setType('0') : null)}
							>
								Today
							</Dropdown.Item>
						)}
						{type !== '1' && (
							<Dropdown.Item
								onClick={() => (type != '1' ? setType('1') : null)}
							>
								Weekly
							</Dropdown.Item>
						)}
						{type !== '2' && (
							<Dropdown.Item
								onClick={() => (type != '2' ? setType('2') : null)}
							>
								Monthly
							</Dropdown.Item>
						)}
					</Dropdown>
				</div>

				<div className='flex flex-col w-full lg:flex-row gap-3 '>
					{!isStatsDataLoading ? (
						<div className='flex w-full flex-col gap-3 lg:w-96 '>
							<StatsCard
								item={
									type === '0'
										? todaysStatsData
										: type === '1'
										? weekStatsData
										: monthsStatsData
								}
								type={type}
							/>
						</div>
					) : (
						<Today_Lastmonth_Stats />
					)}
					<div
						style={{ width: 'calc(100% - 24rem)' }}
						className='sm:w-calc(100% - 1rem) visitor-graph h-96 flex justify-center lg:w-calc(100% - 24rem) bg-white  rounded-lg lg:h-auto'
					>
						{!isVisitorGraphDataLoading ? (
							<VisitorsGraph
								options={options}
								visitorGraphData={visitorGraphData}
							/>
						) : (
							<VisitorGraphShimmer />
						)}
					</div>
				</div>
				{!isGraphDataLoading ? (
					<>
						<div className='w-full flex flex-col lg:flex-row gap-3 '>
							<Order_Revenue_Graph
								type={type}
								options={options}
								graphData={graphData}
							/>
						</div>
					</>
				) : (
					<GraphShimmer />
				)}
				<div className='w-full flex flex-col lg:flex-row gap-3'>
					<PendingOrdersStats />

					<ProductViewsStats />
				</div>
			</div>
		</div>
	)
}
