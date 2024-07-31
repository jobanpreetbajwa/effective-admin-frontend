import { toast } from 'sonner'
import { useState, useEffect } from 'react'

import SearchBar from './components/searchBar'
import FilterBar from './components/filterBar'
import CustomersTable from './components/customersTable'
import { getCustomers, searchCustomers } from '../../api/function'

export default function Customers() {
  const [limit, setLimit] = useState(12)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [customerData, setCustomerData] = useState(null)
  const [searchItem, setSearchItem] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState(0)

  //getCustomerList function asynchronously fetches a list of customers, either by searching with specific criteria or by applying filters.
  const getCustomerList = async () => {
    try {
      setIsLoading(true)
      let response = null
      if (searchItem) {
        response = await searchCustomers({
          data: { query: searchItem },
          limit,
          currentPage,
          type,
        })
      } else {
        response = await getCustomers(limit, currentPage, type)
      }
      setCustomerData(response?.data?.customers)
      setTotalPages(response?.data?.totalCount)
    } catch (error) {
      console.log(error)
      toast.error('Something Went Wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (limit) {
      getCustomerList()
    }
  }, [currentPage, searchItem, type])

  return (
    <div className='flex flex-col w-full h-full '>
      <div className='grid grid-cols-1'>
        <SearchBar
          type={type}
          searchItem={searchItem}
          customersData={customerData}
          setSearchItem={setSearchItem}
          setCurrentPage={setCurrentPage}
        />
        <FilterBar
          LIMIT={limit}
          setType={setType}
          searchItem={searchItem}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <CustomersTable
          limit={limit}
          isLoading={isLoading}
          currentPage={currentPage}
          customersData={customerData}
        />
      </div>
    </div>
  )
}
