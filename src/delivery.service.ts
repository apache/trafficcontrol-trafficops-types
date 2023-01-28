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
 * Represents the `geoLimit` field of a Delivery Service
 */
export const enum GeoLimit {
	/**
	 * No geographic limiting is to be done.
	 */
	NONE = 0,
	/**
	 * Only clients found in a Coverage Zone File may be permitted access.
	 */
	CZF_ONLY = 1,
	/**
	 * Only clients found in a Coverage Zone File OR can be geo-located within a
	 * set of country codes may be permitted access.
	 */
	CZF_AND_COUNTRY_CODES = 2
}

/**
 * Defines the supported Geograhic IP mapping database providers and their
 * respective magic number identifiers.
 */
export const enum GeoProvider {
	/** The standard database used for geo-location. */
	MAX_MIND = 0,
	/** An alternative database with dubious support. */
	NEUSTAR = 1
}

/**
 * Represents a single entry in a Delivery Service's `matchList` field.
 */
export interface DeliveryServiceMatch {
	/** A regular expression matching on something depending on the 'type'. */
	pattern: string;
	/**
	 * The number in the set of the expression, which has vague but incredibly
	 * important meaning.
	 */
	setNumber: number;
	/**
	 * The type of match which determines how it's used.
	 */
	type: string;
}

/**
 * Represents the allowed routing protocols and their respective magic number
 * identifiers.
 */
export const enum Protocol {
	/** Serve HTTP traffic only. */
	HTTP = 0,
	/** Serve HTTPS traffic only. */
	HTTPS = 1,
	/** Serve both HTTPS and HTTP traffic. */
	HTTP_AND_HTTPS = 2,
	/** Redirect HTTP requests to HTTPS URLs and serve HTTPS traffic normally. */
	HTTP_TO_HTTPS = 3
}

/**
 * Converts Protocols to a textual representation.
 *
 * @param p The Protocol to convert.
 * @returns A string representation of 'p', or a blank string if 'p' was null.
 */
export function protocolToString(p: Protocol | null): string {
	switch (p) {
		case Protocol.HTTP:
			return "Serve only unsecured HTTP requests";
		case Protocol.HTTPS:
			return "Serve only secured HTTPS requests";
		case Protocol.HTTP_AND_HTTPS:
			return "Serve both unsecured HTTP requests and secured HTTPS requests";
		case Protocol.HTTP_TO_HTTPS:
			return "Serve secured HTTPS requests normally, but redirect unsecured HTTP requests to use HTTPS";
	}
	return "";
}

/**
 * Represents the allowed values of the `qstringIgnore` field of a
 * `DeliveryService`.
 */
export const enum QStringHandling {
	/** Use the query string in the cache key and pass in upstream requests. */
	USE = 0,
	/**
	 * Don't use the query string in the cache key but do pass it in upstream
	 * requests.
	 */
	IGNORE = 1,
	/**
	 * Neither use the query string in the cache key nor pass it in upstream
	 * requests.
	 */
	DROP = 2
}

/**
 * Converts a QStringHandling to a textual representation.
 *
 * @param q The QStringHandling to convert.
 * @returns A string representation of 'q'.
 */
export function qStringHandlingToString(q: QStringHandling): string {
	switch (q) {
		case QStringHandling.USE:
			return "Use the query parameter string when deciding if a URL is cached, and pass it in upstream requests to the" +
				" Mid-tier/origin";
		case QStringHandling.IGNORE:
			return "Do not use the query parameter string when deciding if a URL is cached, but do pass it in upstream requests to the" +
				" Mid-tier/origin";
		case QStringHandling.DROP:
			return "Immediately strip URLs of their query parameter strings before checking cached objects or making upstream requests";
	}
}

/**
 * Represents the allowed values of the `rangeRequestHandling` field of a
 * `Delivery Service`.
 */
export const enum RangeRequestHandling {
	/** Range requests will not be cached. */
	NONE = 0,
	/**
	 * The entire object will be fetched in the background to be cached, with
	 * the requested range served when it becomes available.
	 */
	BACKGROUND_FETCH = 1,
	/**
	 * Cache range requests like any other request.
	 */
	CACHE_RANGE_REQUESTS = 2
}

/**
 * Converts a RangeRequestHandling to a textual representation.
 *
 * @param r The RangeRequestHandling to convert.
 * @returns A string representation of 'r'.
 */
export function rangeRequestHandlingToString(r: RangeRequestHandling): string {
	switch (r) {
		case RangeRequestHandling.NONE:
			return "Do not cache Range requests";
		case RangeRequestHandling.BACKGROUND_FETCH:
			return "Use the background_fetch plugin to serve Range requests while quietly caching the entire object";
		case RangeRequestHandling.CACHE_RANGE_REQUESTS:
			return "Use the cache_range_requests plugin to directly cache object ranges";
	}
}

/**
 * The basic set of Delivery Service properties without being more specific as
 * to the routing type, as they are given in requests.
 */
interface RequestDeliveryServiceBase {
	/** Whether or not the Delivery Service is actively routed. */
	active: boolean;
	/** Whether or not anonymization services are blocked. */
	anonymousBlockingEnabled?: boolean | null;
	/**
	 * @deprecated This field no longer works and is subject to removal in the
	 * future.
	 */
	cacheurl: string | null;
	/** The TTL of DNS responses from the Traffic Router, in seconds. */
	ccrDnsTtl?: number | null;
	/** The ID of the CDN to which the Delivery Service belongs. */
	cdnId: number;
	/** A sample path which may be requested to ensure the origin is working. */
	checkPath?: string | null;
	/**
	 * A set of the query parameters that are important for Traffic Router to
	 * consider when performing "consistent hashing".
	 */
	consistentHashQueryParams?: Array<string> | null;
	/**
	 * A regular expression used to extract request path fragments for use as
	 * keys in "consistent hashing" for routing purposes.
	 */
	consistentHashRegex?: string | null;
	/** Whether or not to use "deep caching". */
	deepCachingType?: "ALWAYS" | "NEVER" | null;
	/** A human-friendly name for the Delivery Service. */
	displayName: string;
	/** An FQDN to use for DNS-routed bypass scenarios. */
	dnsBypassCname?: string | null;
	/** An IPv4 address to use for DNS-routed bypass scenarios. */
	dnsBypassIp?: string | null;
	/** An IPv6 address to use for DNS-routed bypass scenarios. */
	dnsBypassIp6?: string | null;
	/** The TTL of DNS responses served in bypass scenarios. */
	dnsBypassTtl?: number | null;
	/** The Delivery Service's DSCP. */
	dscp: number;
	ecsEnabled?: boolean | null;
	/** Extra header rewrite text used at the Edge tier. */
	edgeHeaderRewrite?: string | null;
	firstHeaderRewrite?: string | null;
	fqPacingRate?: number | null;
	/**
	 * Describes limitation of content availability based on geographic
	 * location.
	 */
	geoLimit: GeoLimit;
	/**
	 * The countries from which content access is allowed in the event that
	 * geographic limiting is taking place with a setting that allows for
	 * specific country codes to access content.
	 */
	geoLimitCountries?: string | null;
	/**
	 * A URL to which to re-direct users who are blocked because of
	 * geographic-based access limiting
	 */
	geoLimitRedirectUrl?: string | null;
	/**
	 * The provider of the IP-address-to-geographic-location database.
	 */
	geoProvider: GeoProvider;
	/**
	 * The globally allowed maximum megabits per second to be served for the
	 * Delivery Service.
	 */
	globalMaxMbps?: number | null;
	/**
	 * The globally allowed maximum transactions per second to be served for the
	 * Delivery Service.
	 */
	globalMaxTps?: number | null;
	/** A URL to be used in HTTP-routed bypass scenarios. */
	httpBypassFqdn: string | null;
	/**
	 * A URL from which information about a Delivery Service may be obtained.
	 * Historically, this has been used to link to the support ticket that
	 * requested the Delivery Service's creation.
	 */
	infoUrl: string | null;
	/** The number of caches across which to spread content. */
	initialDispersion?: number | null;
	innerHeaderRewrite?: string | null;
	/** Whether or not routing of IPv6 clients should be supported. */
	ipv6RoutingEnabled?: boolean | null;
	lastHeaderRewrite?: string | null;
	/** Whether or not logging should be enabled for the Delivery Service. */
	logsEnabled: boolean;
	/** A textual description of arbitrary length. */
	longDesc?: string | null;
	/**
	 * A textual description of arbitrary length.
	 *
	 * @deprecated This has been removed in the latest API version.
	 */
	longDesc1?: string | null;
	/**
	 * A textual description of arbitrary length.
	 *
	 * @deprecated This has been removed in the latest API version.
	 */
	longDesc2?: string | null;
	/**
	 * Sets the maximum number of answers Traffic Router may provide in a single
	 * DNS response for this Delivery Service.
	 */
	maxDnsAnswers?: number | null;
	/**
	 * The maximum number of connections that cache servers are allowed to open
	 * to the Origin(s).
	 *
	 * @default 0
	 */
	maxOriginConnections?: number | null;
	/**
	 * The maximum size (in bytes) of the request header that is allowed for
	 * this Delivery Service.
	 *
	 * @since 3.1
	 * @default 0
	 */
	maxRequestHeaderBytes?: number | null;
	/** Extra header rewrite text to be used at the Mid-tier. */
	midHeaderRewrite?: string | null;
	/** The latitude that should be used when geo-location of a client fails. */
	missLat?: number | null;
	/** The longitude that should be used when geo-location of a client fails.*/
	missLong?: number | null;
	/** Whether or not Multi-Site Origin is in use. */
	multiSiteOrigin?: boolean | null;
	/** The URL of the Origin server, which I think means nothing for MSO. */
	orgServerFqdn?: string | null;
	/** A string used to shield the Origin, somehow. */
	originShield?: string | null;
	/**
	 * An integral, unique identifer for the Profile used by the Delivery
	 * Service.
	 */
	profileId?: number | null;
	/** The protocols served by the Delivery Service. */
	protocol?: Protocol | null;
	/**
	 * How query strings ought to be handled by cache servers serving content
	 * for this Delivery Service.
	 */
	qstringIgnore?: QStringHandling | null;
	/**
	 * How HTTP Range requests ought to be handled by cache servers serving
	 * content for this Delivery Service.
	 */
	rangeRequestHandling?: RangeRequestHandling | null;
	rangeSliceBlockSize?: null | number;
	/** Some raw text to be inserted into regex_remap.config. */
	regexRemap?: string | null;
	/** Whether or not regional geo-blocking should be used. */
	regionalGeoBlocking: boolean;
	/** Some raw text to be inserted into remap.config. */
	remapText: string | null;
	/**
	 * The lowest-level DNS label used in URLs for the Delivery Service.
	 *
	 * @default "cdn"
	 */
	routingName?: string | null;
	serviceCategory?: string | null;
	/**
	 * Whether or not responses from the cache servers for this Delivery
	 * Service's content will be signed.
	 */
	signed?: boolean | null;
	/**
	 * The algorithm used to sign responses from the cache servers for this
	 * Delivery Service's content.
	 */
	signingAlgorithm?: "url_sig" | "uri_signing" | null;
	/** The generation of SSL key used by this Delivery Service. */
	sslKeyVersion?: number | null;
	/**
	 * An integral, unique identifier for the Tenant to whom this Delivery
	 * Service belongs.
	 */
	tenantId: number;
	topology?: string | null;
	/**
	 * HTTP headers that should be logged from client requests by Traffic
	 * Router.
	 */
	trRequestHeaders?: string | null;
	/** Extra HTTP headers that Traffic Router should provide in responses. */
	trResponseHeaders?: string | null;
	/** The integral, unique identifier of the type of the Delivery Service. */
	typeId: number;
	/** The second-lowest-level DNS label used in the Delivery Service's URLs.*/
	xmlId: string;
}

/**
 * Represents an HTTP-type Delivery Service in the context of a request.
 *
 * Note that since Type is utterly determined by `typeId`, it's not possible to
 * know without communicating with the server in some way whether or not any
 * given object is actually HTTP-typed.
 */
export interface RequestHTTPDeliveryService extends RequestDeliveryServiceBase {
	/** The number of caches across which to spread content. */
	initialDispersion: number;
	/** Whether or not routing of IPv6 clients should be supported. */
	ipv6RoutingEnabled: boolean;
	/** The latitude that should be used when geo-location of a client fails. */
	missLat: number;
	/** The longitude that should be used when geo-location of a client fails.*/
	missLong: number;
	/** Whether or not Multi-Site Origin is in use. */
	multiSiteOrigin: boolean;
	/** The URL of the Origin server, which I think means nothing for MSO. */
	orgServerFqdn: string;
	/** The protocols served by the Delivery Service. */
	protocol: Protocol;
	/**
	 * How query strings ought to be handled by cache servers serving content
	 * for this Delivery Service.
	 */
	qstringIgnore: QStringHandling;
	/**
	 * How HTTP Range requests ought to be handled by cache servers serving
	 * content for this Delivery Service.
	 */
	rangeRequestHandling: RangeRequestHandling;
}

/**
 * Represents a DNS-type Delivery Service in the context of a request.
 *
 * Note that since Type is utterly determined by `typeId`, it's not possible to
 * know without communicating with the server in some way whether or not any
 * given object is actually DNS-typed.
 */
export interface RequestDNSDeliveryService extends RequestDeliveryServiceBase {
	/** Whether or not routing of IPv6 clients should be supported. */
	ipv6RoutingEnabled: boolean;
	/** The latitude that should be used when geo-location of a client fails. */
	missLat: number;
	/** The longitude that should be used when geo-location of a client fails.*/
	missLong: number;
	/** Whether or not Multi-Site Origin is in use. */
	multiSiteOrigin: boolean;
	/** The URL of the Origin server, which I think means nothing for MSO. */
	orgServerFqdn: string;
	/** The protocols served by the Delivery Service. */
	protocol: Protocol;
	/**
	 * How query strings ought to be handled by cache servers serving content
	 * for this Delivery Service.
	 */
	qstringIgnore: QStringHandling;
	/**
	 * How HTTP Range requests ought to be handled by cache servers serving
	 * content for this Delivery Service.
	 */
	rangeRequestHandling: RangeRequestHandling;
}

/**
 * Represents a STEERING-type Delivery Service in the context of a request.
 *
 * Note that since Type is utterly determined by `typeId`, it's not possible to
 * know without communicating with the server in some way whether or not any
 * given object is actually STEERING-typed.
 */
export type RequestSteeringDeliveryService = RequestDeliveryServiceBase;

/**
 * Represents an ANY_MAP-type Delivery Service in the context of a request.
 *
 * Note that since Type is utterly determined by `typeId`, it's not possible to
 * know without communicating with the server in some way whether or not any
 * given object is actually ANY_MAP-typed.
 */
export type RequestAnyMapDeliveryService = RequestDeliveryServiceBase;

/**
 * Represents a Delivery Service as required by the Traffic Ops API in requests.
 */
export type RequestDeliveryService = RequestHTTPDeliveryService | RequestDNSDeliveryService | RequestSteeringDeliveryService | RequestAnyMapDeliveryService;

/**
 * The basic set of Delivery Service properties without being more specific as
 * to the routing type, as they are found in responses.
 */
interface ResponseDeliveryServiceBase {
	/** Whether or not the Delivery Service is actively routed. */
	active: boolean;
	/** Whether or not anonymization services are blocked. */
	anonymousBlockingEnabled: boolean;
	/**
	 * @deprecated This field no longer works and is subject to removal in the
	 * future.
	 */
	cacheurl: string | null;
	/** The TTL of DNS responses from the Traffic Router, in seconds. */
	ccrDnsTtl: number | null;
	/** The ID of the CDN to which the Delivery Service belongs. */
	cdnId: number;
	/**
	 * The Name of the CDN to which the Delivery Service belongs.
	 *
	 * This is null in response to PUT or POST requests where it was null or
	 * unspecified in the response.
	 */
	cdnName: string | null;
	/** A sample path which may be requested to ensure the origin is working. */
	checkPath: string | null;
	/**
	 * A set of the query parameters that are important for Traffic Router to
	 * consider when performing "consistent hashing".
	 */
	consistentHashQueryParams: null | [string, ...Array<string>];
	/**
	 * A regular expression used to extract request path fragments for use as
	 * keys in "consistent hashing" for routing purposes.
	 */
	consistentHashRegex: string | null;
	/** Whether or not to use "deep caching". */
	deepCachingType: "ALWAYS" | "NEVER";
	/** A human-friendly name for the Delivery Service. */
	displayName: string;
	/** An FQDN to use for DNS-routed bypass scenarios. */
	dnsBypassCname: string | null;
	/** An IPv4 address to use for DNS-routed bypass scenarios. */
	dnsBypassIp: string | null;
	/** An IPv6 address to use for DNS-routed bypass scenarios. */
	dnsBypassIp6: string | null;
	/** The TTL of DNS responses served in bypass scenarios. */
	dnsBypassTtl: number | null;
	/** The Delivery Service's DSCP. */
	dscp: number;
	ecsEnabled: boolean;
	/** Extra header rewrite text used at the Edge tier. */
	edgeHeaderRewrite: string | null;
	/**
	 * A list of the URLs which may be used to request Delivery Service content.
	 *
	 * These are generated on-the-fly by Traffic Ops based on the structure of
	 * the given Delivery Service - as such, they cannot be directly modified.
	 */
	readonly exampleURLs: readonly string[];
	firstHeaderRewrite: string | null;
	fqPacingRate: number;
	/**
	 * Describes limitation of content availability based on geographic
	 * location.
	 */
	geoLimit: GeoLimit;
	/**
	 * The countries from which content access is allowed in the event that
	 * geographic limiting is taking place with a setting that allows for
	 * specific country codes to access content.
	 */
	geoLimitCountries: string | null;
	/**
	 * A URL to which to re-direct users who are blocked because of
	 * geographic-based access limiting
	 */
	geoLimitRedirectURL: string | null;
	/**
	 * The provider of the IP-address-to-geographic-location database.
	 */
	geoProvider: GeoProvider;
	/**
	 * The globally allowed maximum megabits per second to be served for the
	 * Delivery Service.
	 */
	globalMaxMbps: number | null;
	/**
	 * The globally allowed maximum transactions per second to be served for the
	 * Delivery Service.
	 */
	globalMaxTps: number | null;
	/** A URL to be used in HTTP-routed bypass scenarios. */
	httpBypassFqdn: string | null;
	/** An integral, unique identifier for the Delivery Service. */
	readonly id: number;
	/**
	 * A URL from which information about a Delivery Service may be obtained.
	 * Historically, this has been used to link to the support ticket that
	 * requested the Delivery Service's creation.
	 */
	infoUrl: string | null;
	/** The number of caches across which to spread content. */
	initialDispersion: number;
	innerHeaderRewrite: string | null;
	/** Whether or not routing of IPv6 clients should be supported. */
	ipv6RoutingEnabled: boolean;
	lastHeaderRewrite: string | null;
	/** When the Delivery Service was last updated via the API. */
	readonly lastUpdated: Date;
	/** Whether or not logging should be enabled for the Delivery Service. */
	logsEnabled: boolean;
	/** A textual description of arbitrary length. */
	longDesc: string | null;
	/**
	 * A textual description of arbitrary length.
	 *
	 * @deprecated This has been removed in the latest API version.
	 */
	longDesc1?: string;
	/**
	 * A textual description of arbitrary length.
	 *
	 * @deprecated This has been removed in the latest API version.
	 */
	longDesc2?: string;
	/**
	 * A list of regular expressions for routing purposes which should not ever
	 * be modified by hand.
	 */
	matchList: Array<DeliveryServiceMatch>;
	/**
	 * Sets the maximum number of answers Traffic Router may provide in a single
	 * DNS response for this Delivery Service.
	 */
	maxDnsAnswers: number | null;
	/**
	 * The maximum number of connections that cache servers are allowed to open
	 * to the Origin(s).
	 */
	maxOriginConnections: number;
	/**
	 * The maximum size (in bytes) of the request header that is allowed for
	 * this Delivery Service.
	 *
	 * @since 3.1
	 */
	maxRequestHeaderBytes: number;
	/** Extra header rewrite text to be used at the Mid-tier. */
	midHeaderRewrite: string | null;
	/** The latitude that should be used when geo-location of a client fails. */
	missLat: number;
	/** The longitude that should be used when geo-location of a client fails.*/
	missLong: number;
	/** Whether or not Multi-Site Origin is in use. */
	multiSiteOrigin: boolean;
	/** A string used to shield the Origin, somehow. */
	originShield: string | null;
	/** The URL of the Origin server, which I think means nothing for MSO. */
	orgServerFqdn: string | null;
	/** The protocols served by the Delivery Service. */
	protocol: Protocol | null;
	/**
	 * How query strings ought to be handled by cache servers serving content
	 * for this Delivery Service.
	 */
	qstringIgnore: QStringHandling | null;
	/**
	 * How HTTP Range requests ought to be handled by cache servers serving
	 * content for this Delivery Service.
	 */
	rangeRequestHandling: RangeRequestHandling | null;
	rangeSliceBlockSize: null | number;
	/** Some raw text to be inserted into regex_remap.config. */
	regexRemap: string | null;
	/** Whether or not regional geo-blocking should be used. */
	regionalGeoBlocking: boolean;
	/** Some raw text to be inserted into remap.config. */
	remapText: string | null;
	/** The lowest-level DNS label used in URLs for the Delivery Service. */
	routingName: string;
	serviceCategory: string | null;
	/**
	 * Whether or not responses from the cache servers for this Delivery
	 * Service's content will be signed.
	 */
	signed: boolean;
	/**
	 * The algorithm used to sign responses from the cache servers for this
	 * Delivery Service's content.
	 */
	signingAlgorithm: "url_sig" | "uri_signing" | null;
	/** The generation of SSL key used by this Delivery Service. */
	sslKeyVersion: number | null;
	/** The name of the Tenant to whom this Delivery Service belongs. */
	tenant: string;
	/**
	 * An integral, unique identifier for the Tenant to whom this Delivery
	 * Service belongs.
	 */
	tenantId: number;
	topology: string | null;
	/** Extra HTTP headers that Traffic Router should provide in responses. */
	trResponseHeaders: string | null;
	/**
	 * HTTP headers that should be logged from client requests by Traffic
	 * Router.
	 */
	trRequestHeaders: string | null;
	/** The type of the Delivery Service. */
	type: string;
	/** The integral, unique identifier of the type of the Delivery Service. */
	typeId: number;
	/** The second-lowest-level DNS label used in the Delivery Service's URLs.*/
	xmlId: string;
}

/**
 * A Delivery Service with a Profile. If a Delivery Service has a Profile, all
 * of the related properties are guaranteed to be non-null in responses.
 */
interface ResponseDeliveryServiceWithProfile extends ResponseDeliveryServiceBase {
	/** A description of the Profile used by the Delivery Service (read-only) */
	profileDescription: string;
	/**
	 * An integral, unique identifer for the Profile used by the Delivery
	 * Service.
	 */
	profileId: number;
	/** The name of the Profile used by the Delivery Service. */
	profileName: string;
}

/**
 * A Delivery Service with a Profile. If a Delivery Service does not has a
 * Profile, all of the related properties are guaranteed to be null in
 * responses.
 */
interface ResponseDeliveryServiceWithoutProfile extends ResponseDeliveryServiceBase {
	/** A description of the Profile used by the Delivery Service (read-only) */
	profileDescription: null;
	/**
	 * An integral, unique identifer for the Profile used by the Delivery
	 * Service.
	 */
	profileId: null;
	/** The name of the Profile used by the Delivery Service. */
	profileName: null;
}

/**
 * Represents a Delivery Service as returned by the Traffic Ops API in
 * responses.
 */
export type ResponseDeliveryService = ResponseDeliveryServiceWithProfile | ResponseDeliveryServiceWithoutProfile;

/**
 * Represents a Delivery Service.
 */
export type DeliveryService = RequestDeliveryService | ResponseDeliveryService;

/**
 * Determines if the Delivery Service is a candidate for bypassing.
 *
 * @param ds The Delivery Service to check.
 * @returns `true` if it can have bypass settings, `false` otherwise.
 */
export function bypassable(ds: DeliveryService): boolean {
	if (!Object.prototype.hasOwnProperty.call(ds, "type")) {
		return false;
	}

	switch ((ds as ResponseDeliveryService).type) {
		case "HTTP":
		case "HTTP_LIVE":
		case "HTTP_LIVE_NATNL":
		case "DNS":
		case "DNS_LIVE":
		case "DNS_LIVE_NATNL":
			return true;
		default:
			return false;
	}
}

/**
 * Represents a Delivery Service "Regular Expression" as Traffic Ops requires it
 * in requests.
 */
export interface RequestDeliveryServiceRegexp {
	pattern: string;
	setNumber: number;
	type: number;
}

/**
 * Represents a Delivery Service "Regular Expression" as Traffic Ops presents it
 * in responses.
 */
export interface ResponseDeliveryServiceRegexp {
	readonly id: number;
	pattern: string;
	setNumber: number;
	type: number;
	typeName: string;
}

/** Represents a Delivery Service "Regular Expression" in an arbitrary context. */
export type DeliveryServiceRegexp = RequestDeliveryServiceRegexp | ResponseDeliveryServiceRegexp;

/**
 * Represents the Delivery Service "Regular Expressions" of a Delivery Service
 * as they appear in responses from the Traffic Ops API's
 * `/deliveryservices_regexes` endpoint.
 */
export interface DeliveryServicesRegexps {
	/** The Delivery Service's XMLID. */
	dsName: string;
	regexes: Array<{
		pattern: string;
		setNumber: number;
		type: string;
	}>;
}

/**
 * Represents a request to update the "safe" fields of a Delivery Service - i.e.
 * the ones that are modifiable through the `/deliveryservices/{{ID}}/safe`
 * endpoint of the Traffic Ops API.
 */
export interface DSSafeUpdateRequest {
	displayName: string;
	infoUrl?: string | null;
	longDesc?: string | null;
	/** @deprecated This has been removed in the latest API version. */
	longDesc1?: string | null;
}

/**
 * Represents a request to associate zero or more servers with a Delivery
 * Service.
 *
 * This is redundant with {@link RequestDeliveryServiceServer}, so
 * applications are recommended to pick one API endpoint to use for such
 * assignments, which will determine the representation used. Generally it boils
 * down to whether you'd rather use hostnames (which can't be guaranteed to be
 * unique to a server so they may be a bad choice!) and XMLIDs or numeric IDs to
 * identify servers and Delivery Services.
 */
export interface RequestDeliveryServicesServers {
	serverNames: Array<string>;
}

/**
 * Represents a response from Traffic Ops to a request to associate zero or more
 * servers with a Delivery Service.
 *
 * This is redundant with {@link ResponseDeliveryServiceServer}, so
 * applications are recommended to pick one API endpoint to use for such
 * assignments, which will determine the representation used. Generally it boils
 * down to whether you'd rather use hostnames (which can't be guaranteed to be
 * unique to a server so they may be a bad choice!) and XMLIDs or numeric IDs to
 * identify servers and Delivery Services.
 */
export interface ResponseDeliveryServicesServers {
	serverNames: Array<string>;
	xmlId: string;
}

/**
 * Represents a request to associate a Delivery Service with zero or more
 * servers as Traffic Ops requires it in requests to its
 * `/deliveryserviceserver` API endpoint.
 *
 * This is redundant with {@link RequestDeliveryServicesServers}, so
 * applications are recommended to pick one API endpoint to use for such
 * assignments, which will determine the representation used. Generally it boils
 * down to whether you'd rather use hostnames (which can't be guaranteed to be
 * unique to a server so they may be a bad choice!) and XMLIDs or numeric IDs to
 * identify servers and Delivery Services.
 */
export interface RequestDeliveryServiceServer {
	dsId: number;
	/** @default false */
	replace?: boolean | null;
	/** @default [] */
	servers?: Array<number> | null;
}

/**
 * Represents a single association shown in responses to GET requests made to
 * `/deliveryserviceserver` endpoint of the Traffic Ops API.
 *
 * This is redundant with {@link ResponseDeliveryServicesServers}, so
 * applications are recommended to pick one API endpoint to use for such
 * assignments, which will determine the representation used. Generally it boils
 * down to whether you'd rather use hostnames (which can't be guaranteed to be
 * unique to a server so they may be a bad choice!) and XMLIDs or numeric IDs to
 * identify servers and Delivery Services.
 */
export interface ResponseDeliveryServiceServer {
	deliveryService: number;
	readonly lastUpdated: Date;
	server: number;
}

/**
 * Represents a Service Category as Traffic Ops requires it in requests.
 */
export interface RequestServiceCategory {
	name: string;
}

/**
 * Represents a Service Category as Traffic Ops presents it in responses.
 */
export interface ResponseServiceCategory {
	readonly lastUpdated: Date;
	name: string;
}

/**
 * Service Categories are used to group Delivery Services for the purposes of
 * metrics and analytics. Cache servers will add the value of a Delivery
 * Service's Service Category as the `X-CDN-SVC` HTTP Header in their downstream
 * responses.
 */
export type ServiceCategory = RequestServiceCategory | ResponseServiceCategory;

/**
 * Represents a Static DNS Entry as Traffic Ops requires it in requests.
 */
export interface RequestStaticDNSEntry {
	address: string;
	/** @default null */
	cachegroupId?: number | null;
	deliveryserviceId: number;
	host: string;
	/** In seconds */
	ttl: number;
	typeId: number;
}

/**
 * A response to a {@link RequestStaticDNSEntry}.
 */
export interface RequestStaticDNSEntryResponse {
	address: string;
	cachegroupId: number | null;
	cachegroup: string | null;
	deliveryserviceId: number;
	deliveryservice: string | null;
	host: string;
	readonly id: number;
	readonly lastUpdated: Date;
	/** In seconds */
	ttl: number;
	type: string;
	typeId: number;
}

/**
 * All of the properties common to Static DNS Entries as presented in responses.
 */
interface ResponseStaticDNSEntryBase {
	address: string;
	deliveryserviceId: number;
	deliveryservice: string;
	host: string;
	readonly id: number;
	readonly lastUpdated: Date;
	/** In seconds */
	ttl: number;
	type: string;
	typeId: number;
}

/**
 * Represents a Static DNS Entry with an associated Cache Group as Traffic Ops
 * presents it in responses.
 */
interface ResponseStaticDNSEntryWithCacheGroup extends ResponseStaticDNSEntryBase {
	cachegroupId: number;
	cachegroup: string;
}

/**
 * Represents a Static DNS Entry without an associated Cache Group as Traffic
 * Ops presents it in responses.
 */
interface ResponseStaticDNSEntryWithoutCacheGroup extends ResponseStaticDNSEntryBase {
	cachegroupId: null;
	cachegroup: null;
}

/**
 * Represents a Static DNS Entry as Traffic Ops presents it in responses.
 */
export type ResponseStaticDNSEntry = ResponseStaticDNSEntryWithCacheGroup | ResponseStaticDNSEntryWithoutCacheGroup;

/**
 * A Static DNS Entry represents a custom DNS record for a Delivery Service.
 */
export type StaticDNSEntry = RequestStaticDNSEntry | RequestStaticDNSEntryResponse | ResponseStaticDNSEntry;
