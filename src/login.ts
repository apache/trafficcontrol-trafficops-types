/**
 * @license Apache-2.0
 *
 * Copyright 2022 ocket8888
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The standard, traditional body of a login request.
 */
export interface LoginRequest {
	/** The user's password. */
	p: string;
	/** The user's username. */
	u: string;
}

/**
 * The body of a login request submitted through the `/user/login/oauth`
 * endpoint of the Traffic Ops API.
 */
export interface OAuthLoginRequest {
	authCodeTokenUrl: string;
	code: string;
	clientId: string;
	redirectUri: string;
}

/**
 * The body of a login request submitted through the `/user/login/token`
 * endpoint of the Traffic Ops API.
 */
export interface TokenLoginRequest {
	/** The user's authentication token. */
	t: string;
}

/**
 * The body of a password reset request submitted through the
 * `/user/reset_password` endpoint of the Traffic Ops API.
 */
export interface ResetPasswordRequest {
	email: `${string}@${string}.${string}`;
}

/**
 * The body of a new user registration request submitted through the
 * `/users/register` endpoint of the Traffic Ops API.
 */
export interface RegistrationRequest {
	email: `${string}@${string}.${string}`;
	role: string;
	tenantId: number;
}
