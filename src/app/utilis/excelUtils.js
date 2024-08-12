import ExcelJS from 'exceljs'
import { urlToBase64 } from './converters.js'

// Function to convert JSON data to an Excel file
export const exportExcelFile = async (products) => {
	const workbook = new ExcelJS.Workbook()
	const sheet = workbook.addWorksheet('My Sheet')
	sheet.properties.defaultRowHeight = 120

	// Header
	sheet.getRow(1).height = 40

	sheet.getRow(1).font = {
		// name: "Comic Sans MS",
		// family: 4,
		size: 16,
		bold: true,
	}

	sheet.columns = [
		{
			header: 'Product Id',
			key: 'unique_id',
			width: 20,
		},

		{
			header: 'Product Name',
			key: 'name',
			width: 40,
		},

		{
			header: 'Price',
			key: 'price',
			width: 15,
		},

		{
			header: 'Product Status',
			key: 'prod_status',
			width: 25,
		},

		{
			header: 'Show Price',
			key: 'is_pricing',
			width: 20,
		},

		{
			header: 'Photo',
			key: 'thumbnail',
			width: 30,
		},
	]

	const promise = Promise.all(
		products?.map(async (product, index) => {
			const rowNumber = index + 1

			sheet.addRow({
				unique_id: product?.unique_id,
				name: product?.name,
				price: product?.mrp_price,
				is_pricing: product?.is_pricing,
				prod_status: product?.prod_status,
			})

			const result = await urlToBase64(product?.img_ids?.[0]?.url)
			const splitted = product?.img_ids?.[0]?.url.split('.')
			const extName = splitted[splitted.length - 1]

			const imageId = workbook.addImage({
				base64: result,
				extension: extName,
			})

			// Set the image Thumbnail height/width
			const imageHeight = 100
			const imageWidth = 100

			// Convert pixels to points (1 point = 1/72 inch, 96 DPI for images)
			const rowHeight = imageHeight / (96 / 72) + 10
			// Set the row height
			sheet.getRow(rowNumber + 1).height = rowHeight

			// Adjust for 0-based index in addImage
			sheet.addImage(imageId, {
				tl: { col: 5, row: rowNumber },
				ext: { width: imageWidth, height: imageHeight },
			})
		})
	)

	return promise.then(() => {
		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			const url = window.URL.createObjectURL(blob)
			const anchor = document.createElement('a')
			anchor.href = url
			anchor.download = 'export_data.xlsx'
			anchor.click()
			window.URL.revokeObjectURL(url)
		})
	})
}

// Function to convert Excel file to JSON data
export const importExcelFile = (file) => {
	return new Promise((resolve, reject) => {
		if (file) {
			const reader = new FileReader()

			reader.onload = (e) => {
				const worker = new Worker(
					new URL('./workers/excelWorker.js', import.meta.url),
					{ type: 'module' }
				)

				worker.onmessage = (event) => {
					console.log('worker onmessage', event.data)
					const { status, jsonData, error } = event.data
					if (status === 'success') {
						resolve(jsonData)
					} else {
						reject(new Error(error))
					}
					worker.terminate()
				}

				worker.onerror = (error) => {
					reject(error.message)
					worker.terminate()
				}

				worker.postMessage({
					fileData: e.target.result,
				})
			}

			reader.readAsArrayBuffer(file)
		} else {
			reject(new Error('No file provided'))
		}
	})
}
