import type { RESTPostOAuth2AccessTokenResult } from "discord-api-types/v10";

import Endpoints = require("./Endpoints");

/**
 * Get an oauth token after being authorized
 * @since 0.11.0
 * @param clientId The ID of your application. For older bots, this is different from your bot's user ID
 * @param redirectURI The URI Discord will redirect the user to after they authorize
 * @param clientSecret The secret of your client you can obtain from the Application page
 * @param code The code returned from Discord from the oauth authorize flow
 * @returns The authorization
 *
 * @example
 * const { tokenless } = require("snowtransfer")
 * const result = await tokenless.getOauth2Token(id, redirectURI, secret, code)
 */
async function getOauth2Token(clientId: string, redirectURI: string, clientSecret: string, code: string): Promise<RESTPostOAuth2AccessTokenResult> {
	const response = await fetch(`${Endpoints.BASE_HOST}${Endpoints.OAUTH2_TOKEN}`, {
		method: "POST",
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: redirectURI
		})
	});
	return response.json() as Promise<RESTPostOAuth2AccessTokenResult>;
}

export = {
	getOauth2Token
}
