# 0.19.1
Security, bug fixes and route changes
- Audit log reasons are now URL encoded. Reasons with non latin1 characters (Japanese, emoji, etc) should work now. Sorry about that.
- Fixed a request that failed without getting a response (ECONNRESET, DNS failure, etc) permanently deadlocking its route's rate limit bucket, which also kept the process from exiting.
- Fixed every Ratelimiter being kept alive forever by its hourly bucket sweep.
- Changed ChannelMethods#createChannelInvite target_users uploading a csv with the now officially supported target_user_ids JSON body property. The old target_users value SnowTransfer stubbed in for convenience will still be supported for now, but is deprecated and will be removed in a later release.
- Added support for the shard query param in UserMethods#getGuilds which is now required for large bots.

# 0.19.0
Idk why I didn't make 0.18.1 this version number. Anyways, the StateMachine now queues doTransition calls so that ones pushed on the same tick dont go in a confusing order.
i.e. doTransition from inside of a transition callback.

# 0.18.1
Another really big update which started out as some simple bug fixes, but surprisingly non breaking.

- Fixed request retries with retryRequests/retryFailed deadlocking the route's rate limit bucket.
	- The retry was enqueued into the same bucket that was blocked waiting for the retry to finish, so the request promise never settled and every later request on that route hung forever. Retries now free the bucket before re-queueing.
	- Retries also now preserve the rawResponse flag. Previously a retried InviteMethods#getInviteTargetUsers would explode because it got parsed JSON instead of a Response.
- Fixed the baseURL option being silently ignored by the RequestHandler. It's also exposed on the SnowTransfer options now, along with a custom fetch implementation.
- Requests without a body no longer send the literal string "undefined" as the JSON body (with a Content-Type to match). Discord tolerated it, but yuck.
- DiscordAPIError#code is now the actual Discord error code (e.g. 10008 Unknown Message) parsed from JSON error bodies instead of always being 4000. Validation error details are still included in the message.
- Bucket cooldowns now only wait on the counters that are actually exhausted. Previously the wait was the max across all counters, so e.g. reaction routes with a 250ms reset could stall for up to a second on the global counter's window.
- 400 responses are no longer retried when retryRequests is enabled. Retrying a malformed request was never going to go differently.
- The hourly bucket sweep no longer deletes buckets that still have queued calls or are mid-cooldown, which could briefly let two buckets for the same route run in parallel.
- ChannelMethods#createVoiceMessage now uses the configured fetch implementation for the CDN upload, actually checks that the upload succeeded, and uses MessageFlags.IsVoiceMessage instead of a magic number.
- Query params/data objects passed to methods are no longer mutated (appendQuery deleted undefined keys from your object, createInteractionResponse wrote allowed_mentions into your data).
	- This is now backed by Constants#cloneUserInput, which copies payloads before the library writes to them: plain objects and arrays are deep cloned, while Buffers, Blobs and streams are intentionally shared by reference (copying those is either wasteful or impossible). Your payloads stay reusable across calls and retries.
- The file property of files now also accepts a factory function returning (or resolving to) a file, and Blob/File are now properly advertised in the method signatures (the form handler always supported them).
	- Streams are single use - once a request consumed one, sending the same payload again would upload nothing. Pass file: () => fs.createReadStream(path) and the factory is called once per materialization, so reusing the payload just works. The new FileInput and SendableFile types document this right where your editor's hover can see it.
- Fixed multipart uploads crashing with "Received non-Uint8Array chunk" when given a Readable that emits strings (e.g. Readable.from(["text"])). Stream contents are now collected through Blob, which is fine with string and Buffer chunks alike.
- WebhookMethods#executeWebhook now treats empty embeds/components/files arrays as missing, matching ChannelMethods#createMessage.
- Fixed the JSDoc example for AssetsMethods#createGuildSticker passing tags as an array - it's a comma separated string.
- strings added to forms without a filename param route through the overload for strings instead of wrapping them in a Blob
- Tokens are only considered pre-prefixed if they start with "Bot " or "Bearer " (with the space).
- Fixed the StateMachine onEnter error message naming the wrong state.
- Added a test suite (node:test, no new dependencies, `npm test`) covering the ratelimiter/request handler core, request transformations, client-side validation, and pure functions. Deliberately no fixture tests of endpoint wrappers - those only test the mock.
- Removed dep on broken tsup.
	- This also allows the emitted code to be more readable which eliminates the "need" for a sourcemap.
	- Also fixes needing to use funny naming schemes for imports of classes across different files lest tsup minification for the dts and js would start naming the base class something else entirely and wrap it instead of.. yknow. Using the name the dev defined even though it'd be valid in that context.
- Removed @protected tag from classes so that they'd be visible in the docs by default.

# 0.18.0
First entry in this changelog. This is a major one - possibly the biggest one save for the js -> ts rewrite. We'll start with the most interesting/impactful.

- Consistency changes across the board. This includes method names, code formatting, etc. (I finally updated eslint to v10)
	- This is quite a few breaking changes and makes up a good chunk of this update. The original method names didn't get a redirect to the new ones. Sorry in advance for the migration struggle.
	- I had to struggle migrating Discord.js a few times, don't think this library is safe from the same struggles >:D jk. I think this will be the only time this kinda thing happens.
	- PATCH methods have been changed from a mix of update/edit/??? prefixes to just edit* preferably. Some methods are special snowflakes.
	- DELETE methods have been changed to prefix with delete*
	- Bulk methods like channel bulk delete messages was simplified to deleteMessages. There were more though.
	- SkuMethods#getSkus was SkuMethods#GetSkus (PascalCase instead of camelCase like literally every other method)
- Found and fixed some actual bugs.
	- GuildScheduledEventMethods#getGuildScheduledEvent and UserMethods#getGuild was accidentally passing the query string params to the JSON body param for the request.
	- IntervalCounter#take would continue to decrement remaining past 0 into the negatives. It would still return false regardless, but this could probably have been problematic in external use cases outside of this lib.
	- request retry logic would go indefinitely instead of decrementing the remaining amount.
- Removed some types being exported from the package.
	- These types were actually just straight up deleted as discord-api-types added them.
- Added a generateWaveform function to Constants.
	- This function is supposed to be used for ChannelMethods#createVoiceMessage, but it doesn't do the whole thing for you. Please read the JSDoc for it!
	- Huge thank you to @Lulalaby for her original C# implementation.
- Removed any lingering references to removeEveryone.
- Fixed some errors with docs.
	- Some of it was spelling related.
	- Some docs entries had invalid JS in it, so anyone who copy pasted and saw an error... Oops! My bad.
- Changed some method return types to be from discord-api-types.
	- Previously for HTTP 204 routes, the return type was never, which was incorrect and made some design patterns, specifically mock test writing annoying as you cannot naturally return the type never in JS without unconditionally throwing an Error or calling process.exit()
	- A PR from yours truly changed it to undefined. I had changed them to void locally for a bit and commented out the types from dapi types, but now that's fixed so they're back.
- VSCode settings deprecated the setting originally used to specify the TS version in editor, so the path was changed.
- Deleted the old travis.yml
- Updated the examples.
- Added a build script that runs both build:src and build:docs.
- Added a lint script.
