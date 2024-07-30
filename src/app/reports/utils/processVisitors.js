import moment from 'moment'

//function aggregates visitor data by hour from a given dataset, converting timestamps to local time and formatting the hours in a 12-hour AM/PM format, returning an object with formatted time labels and corresponding visitor counts
export default function processVisitors(data) {
  const aggregatedData = {}
  data.forEach(({ createdAtIST }) => {
    const Date = moment(createdAtIST[0]).local()

    const hour = Date.hour()

    if (!aggregatedData[hour]) {
      aggregatedData[hour] = 0
    }
    // Increment count for the corresponding hour
    aggregatedData[hour] += 1
  })
  const labels = Object.keys(aggregatedData).map((hour) => {
    const hourValue = parseInt(hour)
    const ampm = hourValue >= 12 ? 'PM' : 'AM'
    const displayHour = hourValue % 12 || 12
    return `${displayHour}:00 ${ampm}`
  })

  const counts = Object.values(aggregatedData)
  console.log(labels, 'labels')
  console.log(counts, 'counts')
  return {
    labels,
    counts,
  }
}
