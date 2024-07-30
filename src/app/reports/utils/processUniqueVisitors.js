import moment from 'moment'
export default function processUniqueVisitors(data) {
  const aggregatedData = {}

  data.forEach(({ createdAtIST }) => {
    // Parse the date string correctly
    const date = moment(createdAtIST).local()

    // Extract the hour from the date
    const hour = date.hour()

    // Initialize the hour count if it doesn't exist
    if (!aggregatedData[hour]) {
      aggregatedData[hour] = 0
    }

    // Increment count for the corresponding hour
    aggregatedData[hour] += 1
  })

  // Prepare labels and counts for the result
  const labels = Object.keys(aggregatedData).map((hour) => {
    const hourValue = parseInt(hour, 10)
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
