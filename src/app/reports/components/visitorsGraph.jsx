import React from 'react'
import { CChart } from '@coreui/react-chartjs'
export default function VisitorsGraph({ options, visitorGraphData }) {
  return (
    <CChart
      className='cursor-pointer relative w-full p-4 '
      type='line'
      options={options}
      data={{
        labels: visitorGraphData?.labels,

        datasets: [
          {
            label: 'Unique',
            backgroundColor: 'rgba(151, 187, 205, 0.2)',
            borderColor: 'rgba(151, 187, 205, 1)',
            pointBackgroundColor: 'rgba(151, 187, 205, 1)',
            pointBorderColor: 'rgba(151, 187, 205, 1)',
            data: visitorGraphData?.unique,
            pointBorderWidth: 3,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
          },
          {
            label: 'Visitors',
            backgroundColor: 'rgb(255, 192, 0,0.2)',
            borderColor: 'rgb(255, 192, 0)',
            pointBackgroundColor: 'rgb(255, 192, 0)',
            pointBorderColor: 'rgb(255, 192, 0)',
            data: visitorGraphData?.redundant,
            pointBorderWidth: 3,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
          },
        ],
      }}
    />
  )
}
