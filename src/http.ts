/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Transform, pipeline } from "stream";
import net = require("net");
import tls = require("tls");

const noop = () => void 0;

async function createTimeoutForPromise<T>(promise: PromiseLike<T>, rejector: (reason?: any) => void, timeout: number): Promise<T> {
	let timer: NodeJS.Timeout | undefined = undefined;
	const timerPromise = new Promise<T>((_, reject) => {
		timer = setTimeout(() => {
			const error = new Error("Timeout reached");
			reject(error);
			rejector(error);
		}, timeout);
	});
	const value = await Promise.race([promise, timerPromise]);
	if (timer) clearTimeout(timer);
	return value;
}

function getHostname(host: string): string {
	if (host[0] === "[") {
		const idx = host.indexOf("]");
		return host.substr(1, idx - 1);
	}

	const idx = host.indexOf(":");
	if (idx === -1) return host;

	return host.substr(0, idx);
}

function getServerName(host?: string) {
	if (!host) return null;

	const servername = getHostname(host);
	if (net.isIP(servername)) return "";

	return servername;
}

const defaultTimeoutMS = 10000;

async function connect(url: string, opts?: { method?: string; headers?: { [header: string]: any }, bodyInit?: Buffer; }): Promise<import("net").Socket> {
	const decoded = new URL(url);
	const options: Required<typeof opts> = {
		method: "get",
		headers: {
			Host: decoded.host
		},
		bodyInit: Buffer.allocUnsafe(0)
	};
	if (opts) {
		if (!opts.bodyInit) delete opts.bodyInit;
		if (opts.headers) Object.assign(options.headers, opts.headers);
		delete opts.headers;
		Object.assign(options, opts);
	}
	const port = decoded.port.length ? Number(decoded.port) : (decoded.protocol === "https:" || decoded.protocol === "wss:" ? 443 : 80);
	const servername = getServerName(decoded.host) || undefined;
	let socket: import("net").Socket;
	const connectOptions: import("tls").ConnectionOptions = { host: decoded.host, port, rejectUnauthorized: false, ALPNProtocols: ["http/1.1", "http/1.0"], servername };

	let res: Parameters<ConstructorParameters<PromiseConstructor>["0"]>["0"] | undefined = undefined;
	let rej: Parameters<ConstructorParameters<PromiseConstructor>["0"]>["1"] | undefined = undefined;
	const promise = new Promise((resolve, reject) => {
		res = resolve;
		rej = reject;
	}).catch(() => void 0);

	if (port === 443) socket = tls.connect(connectOptions, res);
	else socket = net.connect(connectOptions as import("net").NetConnectOpts, res);

	socket.setNoDelay(true);

	await createTimeoutForPromise(promise, rej!, defaultTimeoutMS);

	if (opts?.bodyInit) options.headers["Content-Length"] = opts.bodyInit.byteLength;
	const stringRequest = `${options.method.toUpperCase()} ${decoded.pathname}${decoded.search} HTTP/1.1\n${Object.entries(options.headers).map(i => `${i[0]}: ${i[1]}`).join("\r\n")}\r\n\r\n`;
	let buf: Buffer;
	if (opts?.bodyInit) buf = Buffer.concat([Buffer.from(stringRequest), opts.bodyInit]);
	else buf = Buffer.from(stringRequest);

	if (socket.writable) socket.write(buf);
	return socket;
}

async function socketToRequest(socket: import("net").Socket): Promise<ConnectionResponse> {
	const response = pipeline(socket, new ConnectionResponse(), noop);
	let rej: Parameters<ConstructorParameters<PromiseConstructor>["0"]>["1"] | undefined = undefined;
	let listenerFn;
	const promise = new Promise<ConnectionResponse>((res, reject) => {
		rej = reject;
		listenerFn = () => res(response);
		response.once("done", listenerFn);
	}).catch(() => void 0);
	try {
		await createTimeoutForPromise(promise, rej!, defaultTimeoutMS);
	} catch (e) {
		socket.end();
		socket.destroy();
		socket.removeListener("end", listenerFn);
		throw e;
	}
	return response;
}

const responseRegex = /(HTTP\/[\d.]+) (\d+) ?(.+)?/;
const headerRegex = /([^:]+): *([^\r\n]+)/;
const carriageAndNewlineRegex = /\r\n/;

type ConnectionResponseEvents = {
	headers: [ConnectionResponse["headers"]];
	readable: [];
	data: [any];
	end: [];
	close: [];
	error: [Error];
	done: [];
}

interface ConnectionResponse {
	addListener<E extends keyof ConnectionResponseEvents>(event: E, listener: (...args: ConnectionResponseEvents[E]) => any): this;
	emit<E extends keyof ConnectionResponseEvents>(event: E, ...args: ConnectionResponseEvents[E]): boolean;
	eventNames(): Array<keyof ConnectionResponseEvents>;
	listenerCount(event: keyof ConnectionResponseEvents): number;
	listeners(event: keyof ConnectionResponseEvents): Array<(...args: Array<any>) => any>;
	off<E extends keyof ConnectionResponseEvents>(event: E, listener: (...args: ConnectionResponseEvents[E]) => any): this;
	on<E extends keyof ConnectionResponseEvents>(event: E, listener: (...args: ConnectionResponseEvents[E]) => any): this;
	once<E extends keyof ConnectionResponseEvents>(event: E, listener: (...args: ConnectionResponseEvents[E]) => any): this;
	prependListener<E extends keyof ConnectionResponseEvents>(event: E, listener: (...args: ConnectionResponseEvents[E]) => any): this;
	prependOnceListener<E extends keyof ConnectionResponseEvents>(event: E, listener: (...args: ConnectionResponseEvents[E]) => any): this;
	rawListeners(event: keyof ConnectionResponseEvents): Array<(...args: Array<any>) => any>;
	removeAllListeners(event?: keyof ConnectionResponseEvents): this;
	removeListener<E extends keyof ConnectionResponseEvents>(event: E, listener: (...args: ConnectionResponseEvents[E]) => any): this;
}

class ConnectionResponse extends Transform {
	private headersReceived = false;
	public headers: { [header: string]: string };
	public protocol: string;
	public status: number;
	public message: string;
	public body: Buffer | null = null;

	private _bodyRes: (value: Buffer | null) => void;
	private _bodyPromise = new Promise<Buffer | null>(res => this._bodyRes = res);
	private _bodyAccumulator: BufferAccumulator | null = null;
	private _finished = false;

	public constructor() {
		super();
		this.once("done", () => {
			this._bodyRes(this.body);
			this._finished = true;
		});
	}

	public async json(): Promise<any> {
		if (this._finished) return this.body ? JSON.parse(String(this.body)) : {};
		const d = await this._bodyPromise;
		return d ? JSON.parse(String(d)) : {};
	}

	public _transform(chunk: Buffer, encoding: BufferEncoding, callback: import("stream").TransformCallback): void {
		let result: Buffer | null = null;
		let justReceivedHeaders = false;
		let chunkCancel: boolean | null = null;

		if (this.headersReceived && this.headers["transfer-encoding"] === "chunked") {
			const parsed = this._parseChunk(chunk);
			if (typeof parsed === "boolean") chunkCancel = parsed;
			else result = parsed;
		} else if (chunk.subarray(0, 5).toString("latin1") === "HTTP/") {
			result = this._parseHead(chunk);
			this.emit("headers", this.headers);
			this.headersReceived = true;
			justReceivedHeaders = true;
			if (this.headers["transfer-encoding"] === "chunked") this._bodyAccumulator = new BufferAccumulator(this.headers["content-length"] ? Number(this.headers["content-length"]) : void 0);
		}

		if (result) {
			this.push(result);
			if (this._bodyAccumulator) this._bodyAccumulator.add(result);
			else {
				this.body = result;
				this.emit("done");
			}
		} else {
			if ((!justReceivedHeaders || (justReceivedHeaders && this.headers["transfer-encoding"] !== "chunked")) && (chunkCancel === null || chunkCancel === true)) {
				if (this._bodyAccumulator) this.body = this._bodyAccumulator.concat();
				this.emit("done");
			}
		}
		callback();
	}

	private _parseHead(chunk: Buffer): Buffer | null {
		const lines = chunk.toString("latin1").split("\n");
		const match = (lines[0] || "").match(responseRegex);
		const headers = {};
		if (!match) {
			this.protocol = "UNKNOWN";
			this.status = 0;
			this.message = "";
			this.headers = headers;
			return null;
		} else {
			let passed = 1;
			for (const line of lines.slice(1)) {
				const header = line.match(headerRegex);
				if (!header) break;
				passed++;
				headers[header[1].toLowerCase()] = header[2];
			}
			const sliced = lines.slice(passed + 2);
			this.protocol = match[1];
			this.status = Number(match[2]);
			this.message = match[3] || "";
			this.headers = headers;
			if (!sliced.length) return null;
			const remaining = Buffer.from(sliced.join("\n"));
			if (remaining.length) return remaining;
			return null;
		}
	}

	private _parseChunk(chunk: Buffer): Buffer | boolean {
		const str = chunk.toString();
		const split = str.split(carriageAndNewlineRegex).filter(l => l.length);
		const [length, last] = split.slice(-2);
		if (length === "0") return true;
		if (!last) return false;
		return Buffer.from(last);
	}
}

export type AccumulatorNode = {
	chunk: Buffer;
	next: AccumulatorNode | null;
}

class BufferAccumulator {
	public first: AccumulatorNode | null = null;
	public last: AccumulatorNode | null = null;
	public size = 0;
	public expecting: number | null;

	private _allocated: Buffer | null = null;
	private _streamed: number | null = null;

	public constructor(expecting?: number) {
		if (expecting) {
			this._allocated = Buffer.allocUnsafe(expecting);
			this._streamed = 0;
		}
		this.expecting = expecting ?? null;
	}

	public add(buf: Buffer): void {
		if (this._allocated && this._streamed !== null && this.expecting !== null) {
			if (this._streamed === this.expecting) return;
			if ((this._streamed + buf.byteLength) > this.expecting) buf.subarray(0, this.expecting - this._streamed).copy(this._allocated, this._streamed);
			else buf.copy(this._allocated, this._streamed);
			return;
		}
		if (!this.first) this.first = { chunk: buf, next: null };
		if (this.last) this.last.next = { chunk: buf, next: null };
		this.last = { chunk: buf, next: null };
		this.size += buf.byteLength;
	}

	public concat(): Buffer | null {
		if (this._allocated) return this._allocated;
		if (!this.first) return null;
		if (!this.first.next) return this.first.chunk;
		const r = Buffer.allocUnsafe(this.size);
		let written = 0;
		let current: AccumulatorNode | null = this.first;
		while (current) {
			current.chunk.copy(r, written);
			written += current.chunk.byteLength;
			current = current.next;
		}
		return r;
	}
}

export {
	socketToRequest,
	connect,
	ConnectionResponse,
	BufferAccumulator
};
