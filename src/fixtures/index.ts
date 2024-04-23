export const formatUnixTimestampToISO = (timestamp: number) => {
	const date = new Date(timestamp * 1000) // Convert seconds to milliseconds
	const year = date.getFullYear()
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')
	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')
	const dateObject = new Date(`${year}-${month}-${day}T${hours}:${minutes}`)
	return dateObject.toISOString()
}

export const formatISOTimestamp = (isoTimestamp: string) => {
	const date = new Date(isoTimestamp)

	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed in JavaScript
	const year = date.getFullYear()

	const hours12 = date.getHours() % 12 || 12 // Converts 0 to 12 for midnight
	const amPm = date.getHours() >= 12 ? 'PM' : 'AM'

	const hours = String(hours12).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	const timeZone = new Intl.DateTimeFormat('en-US', {
		timeZoneName: 'short',
	}).resolvedOptions().timeZone

	return `${hours}:${minutes} ${amPm} (${day}:${month}:${year}) ${timeZone}`
}

export const isFutureTimestamp = (isoTimestamp: string, currentTime: Date) => {
	if (isoTimestamp === undefined) {
		return true
	}
	const inputDate = new Date(isoTimestamp)

	// Return true if the input date is in the future, false otherwise
	return inputDate > currentTime
}
