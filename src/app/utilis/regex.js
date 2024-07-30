import { toast } from 'sonner'

const MAX_LIMIT = 999999
const ONLY_NUMBERS = /^(0|[1-9][0-9]*)$/
const ONLY_FLOATING_POINT_REGEX = /^[-+]?([0-9]+(\.[0-9]{0,2})?|\.[0-9]+)$/

//ONLY_FLOATING_POINT_HANDLER, which is a function used to handle input events (e) typically associated with input fields.
//that validates only integers are allowed
export const ONLY_NUMBERS_HANDLER = (e) => {
	if (!ONLY_NUMBERS.test(e.target.value) && e.target.value) {
		e.target.value = e.target.value.replace(/\D/g, '')

		toast.warning('Only Integer is allowed', {
			id: 'integer',
		})

		return false
	}

	return true
}
//ONLY_FLOATING_POINT_HANDLER, which is a function used to handle input events (e) typically associated with input fields.
//that validates floating-point numbers with up to 2 decimal points

export const ONLY_FLOATING_POINT_HANDLER = (e) => {
	let inputValue = e.target.value
	let filteredValue = ''

	// Filter out invalid characters and keep only valid floating-point numbers
	for (let i = 0; i < inputValue.length; i++) {
		const char = inputValue[i]
		const testValue = filteredValue + char

		if (ONLY_FLOATING_POINT_REGEX.test(testValue)) {
			filteredValue = testValue
		} else {
			// Display a warning toast notification for invalid input
			toast.warning('Only numbers are allowed up to 2 decimal points', {
				id: 'floating-point',
			})
		}
	}

	// Check if the input value exceeds the maximum limit
	const numericValue = parseFloat(filteredValue)
	if (numericValue > MAX_LIMIT) {
		// Truncate the number to be within the limit
		filteredValue = String(MAX_LIMIT)
		toast.warning('The maximum allowed value is 999999', {
			id: 'floating-point',
		})
	}

	// Update the input value
	e.target.value = filteredValue

	// Return true if the value is valid
	return (
		ONLY_FLOATING_POINT_REGEX.test(filteredValue) && numericValue <= MAX_LIMIT
	)
}
