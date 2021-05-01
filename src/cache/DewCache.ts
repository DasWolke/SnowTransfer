class DewCache extends Map {
	public constructor() {
		super();
	}

	public async wrap(key: string, promise: Promise<any>) {
		const data = await promise;
		this.set(key, data);
		return data;
	}

	public async fetch(key: string, fallback: (key?: string) => any) {
		if (this.has(key)) {
			return Promise.resolve(this.get(key));
		} else {
			return fallback(key);
		}
	}
}

export = DewCache;
