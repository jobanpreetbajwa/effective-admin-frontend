import React from 'react'

export default function phoneNumbers(data) {
  const broadcastNumbers = data.map((item) => {
    const number = item?.phoneNumber

    if (item?.phoneNumber?.length === 13) {
      console.log(item?.phoneNumber)
      return item?.phoneNumber
    }
  })
  return broadcastNumbers
}
