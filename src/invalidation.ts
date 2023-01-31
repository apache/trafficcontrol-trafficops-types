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

/** JobType enumerates the valid types of Job. */
export const enum JobType {
	/**
	 * Requests that cache servers ignore caching rules and forcibly retrieve a
	 * new copy of the content.
	 *
	 * @deprecated This should never be necessary, as it only has value when an
	 * Origin doesn't respect HTTP standards.
	 */
	REFETCH = "REFETCH",
	/** Requests that cache servers treat content as stale. */
	REFRESH = "REFRESH"
}

/**
 * InvalidationJob objects represent periods of time over which specific objects
 * may not be cached.
 */
export interface ResponseInvalidationJob {
	/**
	 * A regular expression that matches content to be "invalidated" or
	 * "revalidated".
	 */
	assetUrl: string;
	/** The name of the user that created the Job. */
	createdBy: string;
	/** The XMLID of the Delivery Service within which the Job will operate. */
	deliveryService: string;
	/** An integral, unique identifier for this Job. */
	readonly id: number;
	/** The type of Job. */
	invalidationType: JobType;
	/** The time at which the Job is scheduled to start. */
	startTime: Date;
	/** The number of hours for which the Job will remain active. */
	ttlHours: number;
}

/**
 * A NewInvalidationJob is the data structure used to request creation of a new
 * content invalidation job through the API.
 */
export interface RequestInvalidationJob {
	/** The XMLID of the Delivery Service to which the Job will apply. */
	deliveryService: string;
	/** The type of revalidation to perform. */
	invalidationType: JobType;
	/** A pattern that matches content to be invalidated. */
	regex: string;
	/** The effective starting date/time for the Job. */
	startTime: Date | string;
	/** The number of hours for which the Job will remain in effect. */
	ttlHours: number;
}

/** Represents a content invalidation job. */
export type InvalidationJob = RequestInvalidationJob | ResponseInvalidationJob;
