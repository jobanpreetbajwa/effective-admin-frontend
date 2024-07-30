import { Table } from 'flowbite-react'
export default function DashboardStatsShimmer() {
  return (
    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 animate-pulse p-1'>
      <Table.Cell>
        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
      </Table.Cell>
      <Table.Cell>
        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
      </Table.Cell>
      <Table.Cell>
        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
      </Table.Cell>
    </Table.Row>
  )
}
