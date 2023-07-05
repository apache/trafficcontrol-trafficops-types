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
 * A single node in a Topology, as it appears in requests.
 */
export interface RequestTopologyNode {
	cachegroup: string;
	parents?: Array<number> | null;
}

/**
 * A singlenode in a Topology, as it appears in responses.
 */
export interface ResponseTopologyNode {
	cachegroup: string;
	parents: Array<number>;
}

/**
 * A generic Topology node, in the context of either a request or response.
 */
export type TopologyNode = RequestTopologyNode | ResponseTopologyNode;

/**
 * Represents a Topology as Traffic Ops requires it in requests to its API.
 */
export interface RequestTopology {
	description?: string | null;
	name: string;
	nodes: Array<RequestTopologyNode>;
}

/**
 * Represents a Topology as it appears in responses to requests made to the
 * Traffic Ops API to create or modify a Topology.
 */
export interface RequestTopologyResponse {
	description: string;
	readonly lastUpdated: Date;
	name: string;
	nodes: Array<ResponseTopologyNode>;
	/**
	 * @deprecated This field is included erroneously and will be removed in the
	 * future.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	RequestedName: string;
}

/**
 * Represents a Topology as it appears in responses from the Traffic Ops API to
 * GET requests made to its `/topologies` endpoint.
 */
export interface ResponseTopology {
	description: string;
	readonly lastUpdated: Date;
	name: string;
	nodes: Array<ResponseTopologyNode>;
}

/**
 * Represents in an arbitrary context a hierarchical system of groups of cache
 * servers that can be used to serve Delivery Service content.
 */
export type Topology = RequestTopology | RequestTopologyResponse | ResponseTopology;
