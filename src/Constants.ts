import { Readable } from "node:stream";

import type { FileInput } from "./Types";

const Constants = {
	REST_API_VERSION: 10 as const,
	GET_CHANNEL_MESSAGES_MIN_RESULTS: 1 as const,
	GET_CHANNEL_MESSAGES_MAX_RESULTS: 100 as const,
	GET_GUILD_SCHEDULED_EVENT_USERS_MIN_RESULTS: 1 as const,
	GET_GUILD_SCHEDULED_EVENT_USERS_MAX_RESULTS: 100 as const,
	SEARCH_MEMBERS_MIN_RESULTS: 1 as const,
	SEARCH_MEMBERS_MAX_RESULTS: 1000 as const,
	BULK_DELETE_MESSAGES_MIN: 2 as const,
	BULK_DELETE_MESSAGES_MAX: 100 as const,
	OK_STATUS_CODES: new Set([200, 201, 204, 304]),
	DO_NOT_RETRY_STATUS_CODES: new Set([400, 401, 403, 404, 405, 411, 413]),
	DEFAULT_RETRY_LIMIT: 3,
	GLOBAL_REQUESTS_PER_SECOND: 50,
	/**
	 * Deep clones arrays and plain objects, passing everything else (Buffers, Blobs, streams, class instances) through by reference.
	 *
	 * Used to copy user supplied payloads before the library writes to them (defaulting allowed_mentions, deleting keys, etc),
	 * so the caller's objects stay reusable across calls and are unchanged by retries. Exotic values are intentionally shared,
	 * since they are either wasteful (Buffer) or impossible (streams) to copy.
	 * @since 0.18.1
	 * @param value Value to clone
	 */
	cloneUserInput<T>(value: T): T {
		if (Array.isArray(value)) return value.map(v => Constants.cloneUserInput(v)) as T;
		if (value !== null && typeof value === "object") {
			const proto = Object.getPrototypeOf(value);
			if (proto === Object.prototype || proto === null) {
				const cloned: Record<string, any> = {};
				for (const [key, v] of Object.entries(value)) {
					cloned[key] = Constants.cloneUserInput(v);
				}
				return cloned as T;
			}
		}
		return value;
	},
	async standardMultipartHandler(data: { files: Array<{ name: string; file: FileInput }>; data?: any; }): Promise<FormData> {
		const form = new FormData();
		// Cloned so the deletes below can't spend the caller's payload. File contents are shared by reference, not copied
		const payload = Constants.cloneUserInput(data);

		if (payload.files && Array.isArray(payload.files) && payload.files.every(f => !!f.name && !!f.file)) {
			let index = 0;
			for (const file of payload.files) {
				await Constants.standardAddToFormHandler(form, `files[${index}]`, file.file, file.name);

				// @ts-expect-error Cannot delete non optional, but I have to
				delete file.file;
				index++;
			}
		}

		// @ts-expect-error Cannot delete non optional, but I have to
		if (payload.data) delete payload.files; // Interactions responses are weird, but I need to support it
		form.append("payload_json", JSON.stringify(payload));
		return form;
	},
	async standardAddToFormHandler(form: FormData, name: string, value: string | FileInput, filename?: string): Promise<void> {
		// Factories produce a fresh file per materialization, so payloads containing streams can be reused across calls
		if (typeof value === "function") value = await value();
		if (typeof value === "string" && !filename) form.append(name, value);
		// @ts-expect-error It's a Buffer and it works. If node changes the backend to not accept a plain Buffer, then we can talk
		else if (value instanceof Buffer || typeof value === "string") form.append(name, new Blob([value]), filename);
		else if (value instanceof Blob || value instanceof File) form.append(name, value, filename);
		// Node Readables may emit string or Buffer chunks; Blob accepts both as parts, unlike Response which only takes bytes
		else if (value instanceof Readable) form.set(name, new Blob(await value.toArray()), filename);
		else if (value instanceof ReadableStream) form.set(name, await new Response(value).blob(), filename);
		else throw new Error(`Don't know how to add ${value?.constructor?.name ?? typeof value} to form`);
	},
	reasonHeader(reason?: string): { "X-Audit-Log-Reason"?: string } {
		return reason ? { "X-Audit-Log-Reason": encodeURIComponent(reason) } : {};
	},
	/**
	 * Generates a waveform from mono PCM samples
	 *
	 * Discord expects 1 byte per datapoint (0-255), at most 256 datapoints, base64 encoded.
	 * SnowTransfer does not do the whole process of converting the audio Buffer to a waveform string,
	 * since doing so properly requires decoding the actual audio (Opus, MP3, AAC, FLAC, ...) into raw PCM samples,
	 * and that needs a real audio codec library or an `ffmpeg` binary, neither of which this package depends on.
	 *
	 * This function just does the important part - chunking samples sequentially in time (not interleaving/round-robin),
	 * so each byte represents the amplitude of one time slice of the recording, left to right.
	 *
	 * To get `pcmSamples` in the first place:
	 * WAV is the only format decodable without extra tooling, since it's just a header followed by raw PCM.
	 * For Ogg/Opus, MP3, M4A, FLAC, etc., you'll need to decode to PCM first, e.g. by shelling out to ffmpeg
	 * (`ffmpeg -i input -f s16le -ac 1 -ar 48000 -`) or using a native/wasm decoder of your choice.
	 * prism-media is an option and is the backend of discord.js' voice package for the purpose of converting arbitrary
	 * audio formats into PCM for some functionality, like gain modification, to then convert into opus packets for Discord.
	 * Though it does depend on ffmpeg for unrecognized formats.
	 * @param pcmSamples mono PCM, e.g. Int16 samples in the range -32768..32767
	 */
	generateWaveform(pcmSamples: Array<number>, durationSeconds: number, maxPoints = 256) {
		if (maxPoints > 256) maxPoints = 256;
		const points = Math.min(maxPoints, Math.ceil(durationSeconds * 10)); // Discord samples at most once per 100ms
		const chunkSize = Math.ceil(pcmSamples.length / points);
		const waveformArr = [];

		for (let i = 0; i < points; i++) {
			const start = i * chunkSize;
			const end = Math.min(start + chunkSize, pcmSamples.length);
			const chunk = pcmSamples.slice(start, end);

			if (chunk.length === 0) {
				waveformArr[i] = 0;
				continue;
			}

			const sumSquares = chunk.reduce((acc, cur) => acc + (cur * cur), 0);
			const rms = Math.sqrt(sumSquares / chunk.length); // root-mean-square amplitude of this chunk
			waveformArr[i] = Math.round((rms / 32768) * 255);
		}

		return Buffer.from(waveformArr).toString("base64");
	}
};

export = Constants;
