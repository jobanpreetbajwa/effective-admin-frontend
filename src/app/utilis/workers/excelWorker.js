import ExcelJS from 'exceljs'
import { v4 as uuidv4 } from 'uuid'
import { base64ToFile } from '../converters'

self.onmessage = async (event) => {
	const { fileData } = event.data
	try {
		const data = new Uint8Array(fileData)
		const workbook = new ExcelJS.Workbook()
		await workbook.xlsx.load(data)

		const worksheet = workbook.getWorksheet(1)
		const jsonData = []
		let headers = []

		worksheet.getRow(1).eachCell((cell) => {
			headers.push(cell.value)
		})

		worksheet.eachRow((row, rowNumber) => {
			if (rowNumber === 1) return
			const rowData = {}
			row.eachCell((cell, colNumber) => {
				rowData[headers[colNumber - 1]] = cell.value
			})

			jsonData.push(rowData)
		})

		workbook.eachSheet((worksheet) => {
			worksheet.getImages().forEach((image, index) => {
				const { imageId } = image
				const imageDetails = workbook.getImage(imageId)

				if (imageDetails && imageDetails.buffer) {
					const base64Image = imageDetails.buffer.toString('base64')
					const mimeType = `image/${imageDetails.extension}`
					const fileName = `image_${index}.${imageDetails.extension}`
					const fileObject = base64ToFile(base64Image, fileName, mimeType)

					jsonData[index].image = fileObject
					jsonData[index].uuid = uuidv4()
				}
			})
		})

		self.postMessage({ status: 'success', jsonData })
	} catch (error) {
		self.postMessage({ status: 'error', error: error.message })
	}
}
