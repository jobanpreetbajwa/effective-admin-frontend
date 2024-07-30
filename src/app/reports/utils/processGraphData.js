import moment from 'moment'

//This function aggregate time-based sales data and converts each timestamp into a 12-hour format with AM/PM labels,also sorted data chronologically within AM and PM periods.
const processGraphData = (data) => {
  const processedData = {
    labels: [],
    yaxisOrders: [],
    yaxisRevenue: [],
  }

  data.forEach((item) => {
    const saleDate = moment(item.date).local()
    const hour = saleDate.hour()
    const minutes = saleDate.minutes()

    let formattedTime
    if (hour < 12) {
      formattedTime = `${hour}:00 AM`
    } else {
      if (hour === 12) {
        formattedTime = `${hour}:00 PM`
      } else {
        formattedTime = `${hour % 12}:00 PM`
      }
    }

    const existingIndex = processedData.labels.findIndex(
      (label) => label === formattedTime
    )

    if (existingIndex !== -1) {
      processedData.yaxisOrders[existingIndex] += item.totalOrders
      processedData.yaxisRevenue[existingIndex] += item.revenue
    } else {
      processedData.labels.push(formattedTime)
      processedData.yaxisOrders.push(item.totalOrders)
      processedData.yaxisRevenue.push(item.revenue)
    }
  })

  const amData = processedData.labels.filter((label) => label.includes('AM'))
  const pmData = processedData.labels.filter((label) => label.includes('PM'))

  amData.sort((a, b) => {
    const hourA = parseInt(a.split(':')[0])
    const hourB = parseInt(b.split(':')[0])
    return hourA - hourB
  })

  const sortedLabels = amData.concat(pmData)
  const sortedOrders = []
  const sortedRevenue = []

  sortedLabels.forEach((label) => {
    const index = processedData.labels.indexOf(label)
    sortedOrders.push(processedData.yaxisOrders[index])
    sortedRevenue.push(processedData.yaxisRevenue[index])
  })

  const result = {
    labels: sortedLabels,
    yaxisOrders: sortedOrders,
    yaxisRevenue: sortedRevenue,
  }

  return result
}

export default processGraphData
