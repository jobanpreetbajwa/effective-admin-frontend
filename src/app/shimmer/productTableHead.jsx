export default function ProductTableHead() {
  return (
    <div className='w-full text-xs text-gray-700 uppercase bg-gray-900 dark:bg-gray-700 dark:text-gray-400 animate-pulse'>
      <div className='flex gap-4 px-6 py-3 justify-between'>
        <div className='flex gap-3 w-1/4'>
          <div className='w-4 h-4 bg-gray-300 rounded mr-2'></div>
          <div className='h-4 bg-gray-200 rounded w-full'></div>
        </div>
        <div className='h-4 bg-gray-200 rounded w-1/4'></div>
        <div className='h-4 bg-gray-200 rounded w-1/4'></div>
      </div>
    </div>
  )
}
