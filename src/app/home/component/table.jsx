import { Table } from 'flowbite-react'
import { NavLink } from 'react-router-dom'
import DashboardStatsShimmer from '../../shimmer/dashboardStatsShimmer'

function StoreStatisticsTable({ data, isStatsDataLoading }) {
  return (
    <div className='overflow-x-auto h-fit '>
      <Table>
        <Table.Head>
          <Table.HeadCell>Visitor</Table.HeadCell>
          <Table.HeadCell>Order</Table.HeadCell>
          <Table.HeadCell>Revenue</Table.HeadCell>
        </Table.Head>
        <Table.Body className='divide-y'>
          {!isStatsDataLoading ? (
            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
              <Table.Cell>{data?.visitors}</Table.Cell>
              <Table.Cell>{data?.orders}</Table.Cell>
              <Table.Cell>{data?.sales}</Table.Cell>
            </Table.Row>
          ) : (
            <DashboardStatsShimmer />
          )}
        </Table.Body>
      </Table>
      <NavLink
        to={'/reports'}
        className='p-4 text-xs flex justify-end font-semibold text-blue-700'
      >
        View detailed reports
      </NavLink>
    </div>
  )
}

export default StoreStatisticsTable
