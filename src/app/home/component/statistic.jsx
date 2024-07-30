import React from 'react'
import moment from 'moment'
import { toast } from 'sonner'
import StoreStatisticsTable from './table'
import { Dropdown } from 'flowbite-react'
import { useState } from 'react'
import { useEffect } from 'react'
import { getStatsData } from '../../../api/function'

export default function Statistic() {
  const [type, setType] = useState('0')
  const [isStatsDataLoading, setIsStatsDataLoading] = useState(false)
  const [statsData, setStatsData] = useState(null)

  //fetchstats function asynchronously retrieves statistics data, adjusting the date format as necessary, and updates the application state accordingly
  useEffect(() => {
    const fetchstats = async () => {
      try {
        setIsStatsDataLoading(true)
        const dateObject = moment.utc()
        const formattedDate = dateObject
          .utcOffset('+05:30')
          .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        const response = await getStatsData(formattedDate)
        setStatsData(response?.data)
      } catch (error) {
        toast.error('Something went wrong')
      } finally {
        setIsStatsDataLoading(false)
      }
    }
    fetchstats()
  }, [])
  return (
    <>
      <div className='p-2 flex justify-between items-center'>
        <p className='flex items-center gap-1 font-medium'>Store Statistics</p>

        <Dropdown
          size='sm'
          label={type === '0' ? 'Today' : type === '1' ? 'Weekly' : 'Monthly'}
          dismissOnClick={true}
          className='max-h-48 overflow-auto '
          style={{ width: '125px' }}
        >
          {type !== '0' && (
            <Dropdown.Item onClick={() => (type != '0' ? setType('0') : null)}>
              Today
            </Dropdown.Item>
          )}
          {type !== '1' && (
            <Dropdown.Item onClick={() => (type != '1' ? setType('1') : null)}>
              Weekly
            </Dropdown.Item>
          )}
          {type !== '2' && (
            <Dropdown.Item onClick={() => (type != '2' ? setType('2') : null)}>
              Monthly
            </Dropdown.Item>
          )}
        </Dropdown>
      </div>

      <StoreStatisticsTable
        data={
          type === '0'
            ? statsData?.today
            : type === '1'
            ? statsData?.week
            : statsData?.month
        }
        isStatsDataLoading={isStatsDataLoading}
      />
    </>
  )
}
