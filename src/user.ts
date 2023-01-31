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
 * PostRequestUser is a user as it appears in a POST request to /users.
 * This is subtly different from a user as required in other contexts. For more
 * information, see apache/trafficcontrol#6299.
 */
export interface PostRequestUser {
	addressLine1?: string | null;
	addressLine2?: string | null;
	city?: string | null;
	company?: string | null;
	confirmLocalPasswd: string;
	country?: string | null;
	email: `${string}@${string}.${string}`;
	fullName: string;
	/** @deprecated This has no purpose and should never be used. */
	gid?: number | null;
	localPasswd: string;
	/** @deprecated This has no purpose and should never be used. */
	newUser?: boolean | null;
	phoneNumber?: string | null;
	postalCode?: string | null;
	publicSshKey?: string | null;
	role: string;
	stateOrProvince?: string | null;
	tenantId: number;
	ucdn?: string | null;
	/** @deprecated This has no purpose and should never be used. */
	uid?: number | null;
	username: string;
}

/**
 * Represents a user in a PUT request where the user's password is *not* being
 * changed.
 */
interface PutRequestNotChangingPasswordUser {
	addressLine1?: string | null;
	addressLine2?: string | null;
	city?: string | null;
	company?: string | null;
	country?: string | null;
	email: `${string}@${string}.${string}`;
	fullName: string;
	/** @deprecated This has no purpose and should never be used. */
	gid?: number | null;
	newUser?: boolean | null;
	phoneNumber?: string | null;
	postalCode?: string | null;
	publicSshKey?: string | null;
	role: string;
	stateOrProvince?: string | null;
	tenantId: number;
	ucdn?: string | null;
	/** @deprecated This has no purpose and should never be used. */
	uid?: number | null;
	username: string;
}

/**
 * PostRequestUser is a user as it appears in a POST request to /users.
 * This is subtly different from a user as required in other contexts. For more
 * information, see apache/trafficcontrol#6299.
 */
export type PutRequestUser = PostRequestUser | PutRequestNotChangingPasswordUser;

/** Generically represents a user in the context of a request. */
export type RequestUser = PutRequestUser | PostRequestUser;

/** Generically represents a user in the context of a response. */
export interface ResponseUser {
	addressLine1: string | null;
	addressLine2: string | null;
	readonly changeLogCount: number;
	city: string | null;
	company: string | null;
	country: string | null;
	email: `${string}@${string}.${string}`;
	fullName: string;
	/** @deprecated This has no purpose and should never be used. */
	gid: number | null;
	readonly id: number;
	readonly lastAuthenticated: Date | null;
	readonly lastUpdated: Date;
	/** @deprecated This has no known purpose and shouldn't be used. */
	newUser: boolean | null;
	phoneNumber: string | null;
	postalCode: string | null;
	publicSshKey: string | null;
	registrationSent?: null | Date;
	role: string;
	stateOrProvince: string | null;
	tenant: string;
	tenantId: number;
	ucdn: string;
	/** @deprecated This has no purpose and should never be used. */
	uid: number | null;
	username: string;
}

/**
 * User generically represents a user in the context of a PUT, POST, or GET
 * request or response to/from /users.
 */
export type User = RequestUser | ResponseUser;

/**
 * ResponseCurrentUser represents a response from /user/current.
 */
export interface ResponseCurrentUser {
	addressLine1: string | null;
	addressLine2: string | null;
	readonly changeLogCount: number;
	city: string | null;
	company: string | null;
	country: string | null;
	email: `${string}@${string}.${string}`;
	fullName: string;
	gid: number | null;
	readonly id: number;
	readonly lastAuthenticated: null | Date;
	readonly lastUpdated: Date;
	localUser: boolean;
	newUser: boolean;
	phoneNumber: string | null;
	postalCode: string | null;
	publicSshKey: string | null;
	readonly registrationSent: null | Date;
	role: string;
	stateOrProvince: string | null;
	tenant: string;
	tenantId: number;
	ucdn: string;
	uid: number | null;
	username: string;
}

/**
 * Checks if a provided user email is valid.
 *
 * @param email The email to check.
 * @returns `true` if `email` is valid, `false` otherwise.
 */
export function userEmailIsValid(email: string): email is `${string}@${string}.${string}` {
	return /^.+@.+\..+$/.test(email);
}

/**
 * Represents a request to modify the current user.
 */
export interface RequestCurrentUser {
	addressLine1?: string | null;
	addressLine2?: string | null;
	city?: string | null;
	company?: string | null;
	country?: string | null;
	email: string;
	fullName: string;
	/**
	 * @deprecated This serves no purpose and is subject to removal in the
	 * future.
	 */
	gid?: number | null;
	phoneNumber?: string | null;
	postalCode?: string | null;
	publicSshKey?: string | null;
	role: string;
	stateOrProvince?: string | null;
	tenantId: number;
	ucdn?: string | null;
	/**
	 * @deprecated This serves no purpose and is subject to removal in the
	 * future.
	 */
	uid?: number | null;
	username: string;
}

/**
 * CurrentUser generically represents a "current user" representation in the
 * context of either a request or response. This differs from a "user" in a few
 * key ways as tracked by
 * {@link https://github.com/apache/trafficcontrol/issues/6299 #6299}.
 */
export type CurrentUser = ResponseCurrentUser | RequestCurrentUser;

/**
 * Represents a Role as Traffic Ops requires it in requests.
 */
export interface RequestRole {
	/**
	 * This will be null in responses if it is null or undefined in the request.
	 */
	permissions?: Array<string> | null;
	description: string;
	name: string;
}

/**
 * Represents a Role in a response to a PUT request.
 *
 * Note that this should not be different from a `PostResponseRole` - but
 * currently is (because it's missing `lastUpdated`). This bug is tracked by
 * [apache/trafficcontrol#7248](https://github.com/apache/trafficcontrol/issues/7248).
 */
export type PutResponseRole = RequestRole;

/**
 * Represents a Role as Traffic Ops presents it in responses to POST requests.
 */
export interface PostResponseRole extends PutResponseRole {
	readonly lastUpdated: Date;
}

/**
 * Represents a Role as Traffic Ops presents it in responses.
 */
export type ResponseRole = PutResponseRole | PostResponseRole;

/**
 * A Role encapsulates the permissions to perform operations through the Traffic
 * Ops API.
 */
export type Role = RequestRole | ResponseRole;

/**
 * Represents a Tenant as Traffic Ops requires it in requests.
 */
export interface RequestTenant {
	active: boolean;
	name: string;
	parentId: number;
}

/**
 * A response to a {@link RequestTenant}.
 */
export interface RequestTenantResponse extends RequestTenant {
	readonly id: number;
	readonly lastUpdated: Date;
}

/**
 * Properties common to Tenants in (almost) all responses.
 */
interface ResponseTenantBase {
	active: boolean;
	readonly id: number;
	readonly lastUpdated: Date;
	name: string;
}

/**
 * The root Tenant - it's the only one allowed to have a `null` `parentId`.
 */
interface ResponseRootTenant extends ResponseTenantBase {
	active: true;
	name: "root";
	parentId: null;
}

/**
 * A regular Tenant - its `parentId` must not be `null`.
 */
interface ResponseRegularTenant extends ResponseTenantBase {
	// I know this doesn't work, but I'm doing it anyway.
	name: Exclude<string, "root">;
	parentId: number;
}

/**
 * Represents a Tenant as Traffic Ops presents it in responses.
 */
export type ResponseTenant = ResponseRootTenant | ResponseRegularTenant;

/**
 * A Tenant is a grouping of users to manage a shared set of CDN configuration,
 * most frequently one or more Delivery Services.
 */
export type Tenant = ResponseTenant | RequestTenant | RequestTenantResponse;
