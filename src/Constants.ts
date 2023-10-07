import FormData = require("form-data");

import { Readable } from "stream";
import { ReadableStream } from "stream/web";

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
	OK_STATUS_CODES: [200, 201, 204, 304],
	standardMultipartHandler(data: { files: Array<{ name: string; file: Buffer | Readable | ReadableStream }>; data?: any; }): FormData {
		const form = new FormData();
		if (data.files && Array.isArray(data.files) && data.files.every(f => !!f.name && !!f.file)) {
			let index = 0;
			for (const file of data.files) {
				const asAcceptable = file.file instanceof ReadableStream ? Readable.fromWeb(file.file) : file.file;
				form.append(`files[${index}]`, asAcceptable, { filename: file.name });
				// @ts-ignore
				delete file.file;
				index++;
			}
		}
		// @ts-ignore
		if (data.data) delete data.files; // Interactions responses are weird, but I need to support it
		form.append("payload_json", JSON.stringify(data));
		return form;
	}
};

export = Constants;
