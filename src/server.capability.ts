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

/** Represents a request to create or modify a Server Capability. */
export interface RequestServerCapability {
	name: string;
}

/**
 * Represents a Server Capability as it is presented by Traffic Ops in responses
 * to requests made to its API to create or modify Server Capabilities.
 */
export interface RequestServerCapabilityResponse {
	readonly lastUpdated: Date;
	name: string;
	/**
	 * @deprecated This field exists erroneously and will probably be removed at
	 * some point.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	RequestedName: string;
}

/**
 * Represents a Server Capability as it appears in responses from Traffic Ops to
 * GET requests made to its `/server_capabilities` API endpoint.
 */
export interface ResponseServerCapability {
	readonly lastUpdated: Date;
	name: string;
}

/**
 * Represents in an arbitrary context the ability of a Server to perform some
 * function.
 */
export type ServerCapability = RequestServerCapability | RequestServerCapabilityResponse | ResponseServerCapability;

/**
 * Represents a request to associate the requirement of a Server Capability with
 * a Delivery Service.
 */
export interface RequestDeliveryServiceRequiredCapability {
	deliveryServiceID: number;
	requiredCapability: string;
}

/**
 * Represents a response from Traffic Ops to a request to associate the
 * requirement of a Server Capability with a Delivery Service.
 */
export interface RequestDeliveryServiceRequiredCapabilityResponse {
	deliveryServiceID: number;
	readonly lastUpdated: Date;
	requiredCapability: string;
}

/**
 * Represents the requirement of a Delivery Service that its assigned servers
 * have a given Server Capability as they appear in responses to GET requests
 * made to `/deliveryservices_required_capabilities`.
 */
export interface ResponseDeliveryServiceRequiredCapability {
	deliveryServiceID: number;
	readonly lastUpdated: Date;
	requiredCapability: string;
	xmlID: string;
}

/**
 * Represents in an arbitrary context the requirement of a Delivery Service that
 * cache servers responsible for serving its content have the ability to perform
 * some special function defined by a Server Capability.
 */
export type DeliveryServiceRequiredCapability = RequestDeliveryServiceRequiredCapability | RequestDeliveryServiceRequiredCapabilityResponse | ResponseDeliveryServiceRequiredCapability;

/**
 * Represents a request to associate a cache server with some Server Capability
 * it ostensibly possesses.
 */
export interface RequestServerServerCapability {
	serverCapability: string;
	serverId: number;
}

/**
 * Represents a response from Traffic Ops to a request to associate a Server
 * Capability with a cache server.
 */
export interface RequestServerServerCapabilityResponse {
	readonly lastUpdated: Date;
	serverCapability: string;
	serverId: number;
}

/**
 * Represents an association between a cache server and a Server Capability
 * which it ostensibly possesses as such associations appear in responses to GET
 * requests made to the `/server_server_capabilities` endpoint of the Traffic
 * Ops API.
 */
export interface ResponseServerServerCapability {
	readonly lastUpdated: Date;
	serverCapability: string;
	serverHostName: string;
	serverId: number;
}

/**
 * Represents in an arbitrary context the association between a cache server and
 * a Server Capability it ostensibly possesses.
 */
export type ServerServerCapability = RequestServerServerCapability | RequestServerServerCapabilityResponse | ResponseServerServerCapability;

/**
 * Represents a response to a request to simultaneously create multiple
 * associations between servers and Server Capabilities they now possess.
 */
export interface ResponseMultipleServerCapabilities {
	serverIds: Array<number>;
	serverCapabilities: Array<string>;
}

/**
 * Represents a request to simultaneously create multiple associations between
 * servers and Server Capabilities they will then possess.
 */
export interface RequestMultipleServerCapabilities extends ResponseMultipleServerCapabilities{
	/**
	 * The purpose of this property is unknown, and it may be removed before
	 * 4.1's release.
	 */
	pageType: "server" | "sc";
}

/**
 * Generically represents multiple simultaneously created server-and-Server
 * Capability associations in the context of either a request or a response.
 */
export type MultipleServerCapabilities = RequestMultipleServerCapabilities | ResponseMultipleServerCapabilities;
