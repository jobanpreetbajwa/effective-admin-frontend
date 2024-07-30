import { Table } from 'flowbite-react'
export default function CustomersShimmer() {
  return (
    <Table.Row>
      <Table.Cell className='flex gap-2 animate-pulse w-fit'>
        <div className='w-10 h-4 bg-gray-200 rounded'></div>
        <div className='w-28 h-4 bg-gray-200 rounded'></div>
      </Table.Cell>
      <Table.Cell className='animate-pulse'>
        <div className='w-32 h-4 bg-gray-200 rounded'></div>
      </Table.Cell>
      <Table.Cell className='animate-pulse'>
        <div className='h-4 bg-gray-200 rounded w-32'></div>
      </Table.Cell>
      <Table.Cell className='animate-pulse'>
        <div className='h-4 bg-gray-200 rounded w-32'></div>
      </Table.Cell>
      <Table.Cell className='animate-pulse'>
        <div className='h-4 bg-gray-200 rounded w-32'></div>
      </Table.Cell>
      <Table.Cell className='animate-pulse'>
        <div className='h-4 bg-gray-200 rounded w-32'></div>
      </Table.Cell>
      <Table.Cell className='animate-pulse'>
        <div className='h-4 bg-gray-200 rounded w-32'></div>
      </Table.Cell>
    </Table.Row>
  )
}
