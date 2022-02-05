let timer = null

export function debounce(functional, timeout = 300) {
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			functional.apply(this, args)
		}, timeout)
	}
}

export function betweenTime(dateTime1 = null, dateTime2 = null, type = 'minute') {
	const minute = 1000 * 60
	const hour = minute * 60
	const day = hour * 24
	const year = day * 365

	let dt1 = new Date()
	let dt2 = new Date()
	if (dateTime1) {
		dt1 = new Date(dateTime1)
		dt1 = dt1 instanceof Date && !isNaN(dt1) ? dt1 : new Date()
	}
	if (dateTime2) {
		dt2 = new Date(dateTime2)
		dt2 = dt2 instanceof Date && !isNaN(dt2) ? dt2 : new Date()
	}

	const diff = dt2.getTime() - dt1.getTime()
	if (type === 'minute') {
		return diff / minute
	} else if (type === 'hour') {
		return diff / hour
	} else if (type === 'day') {
		return diff / day
	} else {
		return diff / year
	}
}
