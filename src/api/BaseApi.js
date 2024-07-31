import axios from 'axios'
import { toast } from 'sonner'
import statusCode from '../app/statusCodeErrors/statusCodeErrors'

const makeApiCall = async (
	method,
	url,
	data = null,
	headers = {},
	cache = false
) => {
	const headersWithContentType = {
		...headers,
		'Cache-Control': cache ? 'max-age=15' : 'no-cache', // 15sec caching if `cache` is true
	}

	const config = {
		method,
		url,
		headers: headersWithContentType,
		...(data !== null && { data }),
	}

	try {
		const response = await axios.request(config)

		return response
	} catch (error) {
		if (error?.response) {
			const status = error?.response?.status
			if (statusCode[status]) {
				toast.error(statusCode[status], {
					id: 'serverError',
				})
			} else {
				// toast.error(`Unhandled status code: ${status}`, {
				//   id: 'serverError',
				// })
			}
		} else if (error.request) {
			console.error('No response received:', error?.request)
			// Handle cases where no response was received
		} else {
			console.error('Error setting up the request:', error?.message)
			// Handle other Axios setup errors
		}
		throw error
	}
}

export default makeApiCall

// import axios from 'axios'

// const makeApiCall = async (method, url, data = null, headers = {}) => {
//   const headersWithContentType = {
//     ...headers,
//   }

//   const source = axios.CancelToken.source()
//   let requestCompleted = false
//   const setRequestTimeout = () => {
//     return setTimeout(() => {
//       if (!requestCompleted) {
//         const userConfirmed = confirm(
//           'Request timed out. Do you want to wait for another 30 seconds?'
//         )
//         if (userConfirmed) {
//           clearTimeout(timeout)
//           timeout = setRequestTimeout()
//         } else {
//           source.cancel('Request timed out after 30 seconds')
//         }
//       }
//     }, 30000)
//   }

//   let timeout = setRequestTimeout()

//   const config = {
//     method,
//     url,
//     headers: headersWithContentType,
//     cancelToken: source.token,
//     ...(data !== null && { data }),
//   }

//   try {
//     const response = await axios.request(config)
//     requestCompleted = true
//     clearTimeout(timeout)
//     return response
//   } catch (error) {
//     requestCompleted = true
//     clearTimeout(timeout)
//     if (axios.isCancel(error)) {
//       console.error('Request cancelled:', error.message)
//     } else {
//       console.error('API call error:', error)
//     }
//     throw error
//   }
// }

// export default makeApiCall
