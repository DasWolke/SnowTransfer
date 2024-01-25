import { Blob } from "buffer";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import { File, FormData } from "undici";

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
	standardMultipartHandler(data: { files: Array<{ name: string; file: Buffer | Blob | File | Readable | ReadableStream }>; data?: any; }): FormData {
		const form = new FormData();

		if (data.files && Array.isArray(data.files) && data.files.every(f => !!f.name && !!f.file)) {
			let index = 0;
			for (const file of data.files) {
				Constants.standardAddToFormHandler(form, `files[${index}]`, file.file, file.name);

				// @ts-ignore
				delete file.file;
				index++;
			}
		}

		// @ts-ignore
		if (data.data) delete data.files; // Interactions responses are weird, but I need to support it
		form.append("payload_json", JSON.stringify(data));
		return form;
	},
	standardAddToFormHandler(form: FormData, name: string, value: Buffer | Blob | File | Readable | ReadableStream, filename?: string) {
		if (value instanceof Buffer) form.append(name, new Blob([value]), filename);
		else if (value instanceof Blob || value instanceof File) form.append(name, value, filename);
		else {
			// https://stackoverflow.com/questions/75793118/streaming-multipart-form-data-request-with-native-fetch-in-node-js/75795888#75795888
			form.set(name, {
				[Symbol.toStringTag]: "File",
				name: name,
				stream: () => value instanceof ReadableStream ? Readable.fromWeb(value) : value,
			}, filename);
		}
	}
};

export = Constants;
