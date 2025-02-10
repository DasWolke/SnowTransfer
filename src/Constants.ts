import { Blob, File } from "buffer";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

const mentionRegex = /@([^<>@ ]*)/gsmu;
const isValidUserMentionRegex = /^[&!]?\d+$/;

function replaceEveryoneMatchProcessor(_match: string, target: string): string {
	if (isValidUserMentionRegex.test(target)) return `@${target}`;
	else return `@\u200b${target}`;
}

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
	DO_NOT_RETRY_STATUS_CODES: new Set([401, 403, 404, 405, 411, 413, 429]),
	DEFAULT_RETRY_LIMIT: 3,
	async standardMultipartHandler(data: { files: Array<{ name: string; file: Buffer | Blob | File | Readable | ReadableStream }>; data?: any; }): Promise<FormData> {
		const form = new FormData();

		if (data.files && Array.isArray(data.files) && data.files.every(f => !!f.name && !!f.file)) {
			let index = 0;
			for (const file of data.files) {
				await Constants.standardAddToFormHandler(form, `files[${index}]`, file.file, file.name);

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
	async standardAddToFormHandler(form: FormData, name: string, value: Buffer | Blob | File | Readable | ReadableStream, filename?: string): Promise<void> {
		if (value instanceof Buffer) form.append(name, new Blob([value]), filename);
		else if (value instanceof Blob || value instanceof File) form.append(name, value, filename);
		else if (value instanceof Readable || value instanceof ReadableStream) {
			const blob = await new Response(value instanceof ReadableStream ? value : Readable.toWeb(value)).blob();
			form.set(name, blob, filename);
		} else throw new Error(`Don't know how to add ${value?.constructor?.name ?? typeof value} to form`);
	},
	replaceEveryone(content: string): string {
		return content.replace(mentionRegex, replaceEveryoneMatchProcessor);
	}
};

export = Constants;
