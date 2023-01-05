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

/** Represents an ASN in an API response. */
export interface ResponseASN {
	asn: number;
	cachegroup: string;
	cachegroupId: number;
	readonly id: number;
	/**
	 * This is actually a string that represents a date/time, in a custom
	 * format. Refer to
	 * [the Traffic Ops API documentation](https://traffic-control-cdn.readthedocs.io/en/latest/api/index.html#traffic-ops-s-custom-date-time-format)
	 * for details.
	 */
	readonly lastUpdated: Date;
}

/** Represents an ASN in an API request. */
export interface RequestASN {
	asn: number;
	cachegroupId: number;
}

/** Represents, generically, an ASN in the context of a request or response. */
export type ASN = RequestASN | ResponseASN;

/**
 * LocalizationMethod values are those allowed in the 'localizationMethods' of
 * `CacheGroup`s.
 */
export const enum LocalizationMethod {
	/** Coverage Zone file lookup. */
	CZ = "CZ",
	/** Deep Coverage Zone file lookup. */
	DEEP_CZ = "DEEP_CZ",
	/** Geographic database search. */
	GEO = "GEO"
}

/**
 * Converts a LocalizationMethod to a human-readable string.
 *
 * @param l The LocalizationMethod to convert.
 * @returns A textual representation of 'l'.
 */
export function localizationMethodToString(l: LocalizationMethod): string {
	switch (l) {
		case LocalizationMethod.CZ:
			return "Coverage Zone File";
		case LocalizationMethod.DEEP_CZ:
			return "Deep Coverage Zone File";
		case LocalizationMethod.GEO:
			return "Geo-IP Database";
	}
}

/**
 * Represents a Cache Group as required by the Traffic Ops API in requests.
 */
export interface RequestCacheGroup {
	fallbacks?: Array<string> | null;
	fallbackToClosest?: boolean | null;
	/**
	 * Note that leaving latitude and longitude null or undefined **will break
	 * things**.
	 *
	 * See https://github.com/apache/trafficcontrol/issues/6378
	 */
	latitude?: number | null;
	localizationMethods?: Array<LocalizationMethod> | null;
	/**
	 * Note that leaving latitude and longitude null or undefined **will break
	 * things**.
	 *
	 * See https://github.com/apache/trafficcontrol/issues/6378
	 */
	longitude?: number | null;
	name: string;
	parentCacheGroupId?: number | null;
	secondaryParentCacheGroupId?: number | null;
	shortName: string;
	typeId: number;
}

/**
 * The basic properties common to Cache Groups in all responses.
 */
interface ResponseCacheGroupBase {
	fallbacks: Array<string>;
	fallbackToClosest: boolean;
	readonly id: number;
	readonly lastUpdated: Date;
	latitude: number | null;
	localizationMethods: Array<LocalizationMethod>;
	longitude: number | null;
	name: string;
	shortName: string;
	typeId: number;
	typeName: string;
}

/**
 * A Cache Group with a parent. All related fields are guaranteed to be
 * non-null.
 */
interface ResponseCacheGroupWithParent extends ResponseCacheGroupBase {
	parentCacheGroupId: number;
	parentCacheGroupName: string;
}

/**
 * A Cache Group with no parent. All related fields are guaranteed to be null.
 */
interface ResponseCacheGroupWithoutParent extends ResponseCacheGroupBase {
	parentCacheGroupId: null;
	parentCacheGroupName: null;
}

/**
 * A Cache Group with a secondary parent. All related fields are guaranteed to
 * be non-null.
 */
interface ResponseCacheGroupWithSecondaryParent extends ResponseCacheGroupBase {
	secondaryParentCacheGroupId: number;
	secondaryParentCacheGroupName: string;
}

/**
 * A Cache Group without a secondary parent. All related fields are guaranteed
 * to be null.
 */
interface ResponseCacheGroupWithoutSecondaryParent extends ResponseCacheGroupBase {
	secondaryParentCacheGroupId: null;
	secondaryParentCacheGroupName: null;
}

/** A Cache Group with a parent but no secondary parent. */
type ResponseCacheGroupWithParentButNotSecondary = ResponseCacheGroupWithParent & ResponseCacheGroupWithoutSecondaryParent;
/** A Cache Group with both a parent and a secondary parent. */
type ResponseCacheGroupWithParentAndSecondary = ResponseCacheGroupWithParent & ResponseCacheGroupWithSecondaryParent;
/** A Cache Group with a secondary parent but no parent. */
type ResponseCacheGroupWithSecondaryButNotParent = ResponseCacheGroupWithoutParent & ResponseCacheGroupWithSecondaryParent;
/** A Cache Group with neither a parent nor a secondary parent. */
type ResponseCacheGroupWithoutParentOrSecondary = ResponseCacheGroupWithoutParent & ResponseCacheGroupWithoutSecondaryParent;

/**
 * Represents a Cache Group as returned by the Traffic Ops API in responses.
 */
export type ResponseCacheGroup = ResponseCacheGroupWithParentButNotSecondary |
ResponseCacheGroupWithParentAndSecondary |
ResponseCacheGroupWithSecondaryButNotParent |
ResponseCacheGroupWithoutParentOrSecondary;

/**
 * Represents a Cache Group.
 *
 * Refer to https://traffic-control-cdn.readthedocs.io/en/latest/overview/cache_groups.html
 */
export type CacheGroup = RequestCacheGroup | ResponseCacheGroup;

/**
 * ResponseCacheGroupParameters represents a response from Traffic Ops to a
 * request made to its /cachegroupparameters` API endpoint.
 *
 * @deprecated In the latest API version, there is no notion of associating a
 * Parameter with a Cache Group.
 */
export interface ResponseCacheGroupParameters {
	cachegroupParameters: Array<{
		parameter: number;
		readonly lastUpdated: Date;
		/** The Name of the Cache Group associated with this Parameter. */
		cachegroup: string;
	}>;
}

/**
 * RequestCacheGroupParameter represents an association between a Cache Group
 * and a Parameter as Traffic Ops requires it in requests to its API. Note that
 * the `/cachegroupparameters` endpoint allows the request body to either be
 * one of these structures, or an array thereof.
 *
 * This is also the type of a response from Traffic Ops to the request that
 * passed this structure for the purposes of creating an association between a
 * Parameter and a Cache Group.
 *
 * @deprecated In the latest API version, there is no notion of associating a
 * Parameter with a Cache Group.
 */
export interface RequestCacheGroupParameter {
	cacheGroupId: number;
	parameterId: number;
}

/**
 * Represents a request to assign servers within a Cache Group to a specified
 * set of Delivery Services.
 */
export interface CacheGroupDeliveryServiceAssignmentRequest {
	deliveryServices: Array<number>;
}

/**
 * Represents a response from the Traffic Ops API to a request to associate the
 * servers of a Cache Group with a set of Delivery Services.
 */
export interface CacheGroupDeliveryServiceAssignmentResponse {
	deliveryServices: Array<number>;
	readonly id: number;
	serverNames: Array<string>;
}
