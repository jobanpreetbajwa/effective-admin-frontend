//This function combines and sorts time labels from two datasets, then aligns their visitor counts to create a merged output with unified labels and corresponding counts for each dataset

export default function MergeLabelsForVisitors(data1, data2) {
  const mergedLabels = Array.from(
    new Set([...data1.labels, ...data2.labels])
  ).sort((a, b) => {
    const parseTime = (time) => {
      const [hourMin, period] = time.split(' ')
      let [hour, minute] = hourMin.split(':').map(Number)
      if (period === 'PM' && hour !== 12) hour += 12
      if (period === 'AM' && hour === 12) hour = 0
      return hour * 60 + minute
    }
    return parseTime(a) - parseTime(b)
  })

  const mergedCounts1 = mergedLabels.map((label) => {
    const index = data1.labels.indexOf(label)
    return index !== -1 ? data1.counts[index] : 0
  })

  const mergedCounts2 = mergedLabels.map((label) => {
    const index = data2.labels.indexOf(label)
    return index !== -1 ? data2.counts[index] : 0
  })

  return {
    labels: mergedLabels,
    unique: mergedCounts1,
    redundant: mergedCounts2,
  }
}
