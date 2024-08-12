// url array to base64
export function urlToBase64(url) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.onload = function () {
			const reader = new FileReader()
			reader.onloadend = function () {
				resolve(reader.result)
			}
			reader.readAsDataURL(xhr.response)
		}
		xhr.onerror = function (error) {
			reject(error)
		}
		xhr.open("GET", url)
		xhr.responseType = "blob"
		xhr.send()
	})
}

//urlArrayToBase64Array that takes an array of URLs and converts each URL to a Base64-encoded string using the urlToBase64 function
export async function urlArrayToBase64Array(urls) {
	const base64Array = []
	for (const url of urls) {
		try {
			const base64String = await urlToBase64(url)

			base64Array.push(base64String)
		} catch (error) {
			console.error("Error reading file:", error)
		}
	}

	return base64Array
}

// Function to convert a base64 string to a File object
export const base64ToFile = (base64, filename, mimeType) => {
	const byteString = atob(base64)
	const ab = new ArrayBuffer(byteString.length)
	const ia = new Uint8Array(ab)
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i)
	}
	return new File([ab], filename, { type: mimeType })
}
