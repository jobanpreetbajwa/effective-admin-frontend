import { Dropdown } from 'flowbite-react'
import React from 'react'
import PaginationButtons from '../../orders/components/pagination'
import { useState } from 'react'

export default function FilterBar({
  searchItem,
  LIMIT,
  totalPages,
  currentPage,
  setCurrentPage,
  setType,
}) {
  const [filterList, setFilterList] = useState([
    { type: 0, value: 'Name : A-Z' },
    { type: 1, value: 'Name : Z-A' },
    { type: 2, value: 'Order : max-min' },
    { type: 3, value: 'Order : min-max' },
  ])
  const [filter, setFilter] = useState({
    type: 0,
    value: filterList[0].value,
  })

  return (
    <div className='flex p-3 justify-between items-center'>
      <div>
        <Dropdown
          outline
          label={`Sort by ${filter?.value}`}
          dismissOnClick={true}
          className='max-h-48  overflow-auto px-2 text-sm'
          style={{ width: '230px' }}
        >
          {filterList?.map((item, i) => {
            if (item?.value === filter?.value) {
              return
            }
            return (
              <Dropdown.Item
                key={i}
                style={{ width: '210px' }}
                className='hover:cursor-pointer border-b'
                onClick={() => {
                  setFilter({
                    type: item?.type,
                    value: item?.value,
                  })
                  setType(item?.type)
                }}
              >
                {item?.value}
              </Dropdown.Item>
            )
          })}
        </Dropdown>
      </div>
      <div>
        <PaginationButtons
          LIMIT={LIMIT}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        ></PaginationButtons>
      </div>
    </div>
  )
}
