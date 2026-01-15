import { Blob, File } from "buffer";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import { deprecate } from "util";

import {
	type APIMessageTopLevelComponent,

	ComponentType
} from "discord-api-types/v10";

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
	GLOBAL_REQUESTS_PER_SECOND: 50,
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
		// @ts-expect-error It's a Buffer. If the user experiences an error, then let it be known that I don't care
		if (value instanceof Buffer) form.append(name, new Blob([value]), filename);
		else if (value instanceof Blob || value instanceof File) form.append(name, value, filename);
		else if (value instanceof Readable || value instanceof ReadableStream) {
			const blob = await new Response(value instanceof ReadableStream ? value : Readable.toWeb(value)).blob();
			form.set(name, blob, filename);
		} else throw new Error(`Don't know how to add ${value?.constructor?.name ?? typeof value} to form`);
	},
	replaceEveryone: deprecate(function replaceEveryone<T extends string | Array<APIMessageTopLevelComponent> | APIMessageTopLevelComponent>(content: T): T {
		if (typeof content === "string") return content.replace(mentionRegex, replaceEveryoneMatchProcessor) as T;
		if (Array.isArray(content)) return content.map(comp => Constants.replaceEveryone(comp)) as T;
		switch (content.type) {
			case ComponentType.Section:
			case ComponentType.Container:
				content.components = Constants.replaceEveryone(content.components);
				break;
			case ComponentType.TextDisplay:
				content.content = Constants.replaceEveryone(content.content);
				break;
			default:
				return content;
		}
		return content;
	}, "SnowTransfer: disableEveryone option has been deprecated and will be removed in a future release. Please use allowed_mentions instead."),
	reasonToXAuditLogReasonHeader(reason?: string | { reason?: string }): { "X-Audit-Log-Reason"?: string } {
		let r: string | undefined = undefined;
		if (typeof reason === "string") r = reason;
		else {
			r = reason?.reason;
			if (r) delete reason!.reason;
		}
		if (!r) return {};
		return { "X-Audit-Log-Reason": r };
	}
};

export = Constants;
