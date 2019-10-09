class DewCache extends Map {
	constructor() {
		super()
	}

	wrap(key, promise) {
		return promise.then(data => {
			this.set(key, data)
			return data
		})
	}

	fetch(key, fallback) {
		if (this.has(key)) {
			return Promise.resolve(this.get(key))
		} else {
			return fallback(key)
		}
	}
}

module.exports = DewCache
