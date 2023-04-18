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
 * This file is for modeling and functionality related to Server objects
 */

import type { Alert } from "./alert";

/** IPAddress is a single IP address of a single network interface of a server. */
export interface IPAddress {
	/** The actual IP address. */
	address: string;
	/** The IP address of a gateway for this IP, if one exists/is known. */
	gateway: string | null;
	/** Whether or not this IP address is responsible for serving ATC traffic. */
	serviceAddress: boolean;
}

/** Interface is a server's network interface. */
export interface Interface {
	/** The IP addresses assigned to this network interface. */
	ipAddresses: Array<IPAddress>;
	/** The maximum bandwidth for considering the server healthy, if any. */
	maxBandwidth: number | null;
	/**
	 * Whether or not the Traffic Monitor should consider this network interface
	 * in health calculations.
	 */
	monitor: boolean;
	/** The maximum transmission unit of the network interface, if known. */
	mtu: number | null;
	/** The name of the network interface in the `/dev` directory. */
	name: string;
}

/**
 * Searches a collection of IPAddresses exhaustively for service addresses.
 *
 * @param ips The IPAddresses to search.
 * @returns A tuple of the found IPv4 and IPv6 addresses, each being `null` if
 * not found.
 */
function exhaustiveServiceAddresses(ips: Array<IPAddress>): [IPAddress | null, IPAddress | null] {
	let ipv4 = null;
	let ipv6 = null;
	for (const ip of ips) {
		if (ip.serviceAddress) {
			if (ip.address.includes(":")) {
				if (ipv6 !== null) {
					throw new Error(`found two IPv6 service addresses: '${ipv6.address}' and '${ip.address}'`);
				}
				ipv6 = ip;
			} else if (ipv4 !== null) {
				throw new Error(`found two IPv4 service addresses: '${ipv4.address}' and '${ip.address}'`);
			} else {
				ipv4 = ip;
			}
		}
	}
	return [ipv4, ipv6];
}

/**
 * Searches for service IP Addresses in the given collection, traversing the
 * list as little as possible to find a valid set.
 * @param ips The collection of IPs to search.
 * @returns A tuple of the found IPv4 and IPv6 addresses, each being `null` if
 * not found.
 */
function inexhaustiveServiceAddresses(ips: Array<IPAddress>): [IPAddress | null, IPAddress | null] {
	let ipv4 = null;
	let ipv6 = null;
	for (const ip of ips) {
		if (ip.serviceAddress) {
			if (ip.address.includes(":")) {
				if (ipv6 !== null) {
					throw new Error(`found two IPv6 service addresses: '${ipv6.address}' and '${ip.address}'`);
				}
				ipv6 = ip;
			} else if (ipv4 !== null) {
				throw new Error(`found two IPv4 service addresses: '${ipv4.address}' and '${ip.address}'`);
			} else {
				ipv4 = ip;
			}
		}
		if (ipv4 !== null && ipv6 !== null) {
			break;
		}
	}
	return [ipv4, ipv6];
}

/**
 * Extracts the "service" address of an {@link IPAddress} collection or
 * {@link Interface}.
 *
 * @param infs The interfaces from which to extract service addresses.
 * @param exhaustive If `true`, the function will check for service addresses
 * exhaustively. When this is `false`, the function returns as soon as it finds
 * one service address per address family - essentially assuming that there are
 * no duplicates. Exhaustive searches will ensure there is no more than one
 * service address per family by checking the entire collection.
 * @returns A tuple of the IPv4 service address of the interface (or `null` if
 * it doesn't have one) and the IPv6 service address of the interface (or `null`
 * if it doesn't have one). Note that this function does not check for the case
 * when a collection of IPs has no service addresses - it is up to the caller to
 * recognize that a return value of `[null, null]` indicates an invalid
 * collection.
 * @throws {Error} When more than one service address is found for a single
 * address family.
 */
export function serviceAddresses(infs: Array<Interface>, exhaustive = false): [ipv4Address: IPAddress | null, ipv6Address: IPAddress | null] {
	const arr = infs.map(inf=>inf.ipAddresses).flat();
	if (exhaustive) {
		return exhaustiveServiceAddresses(arr);
	}
	return inexhaustiveServiceAddresses(arr);
}

/**
 * Represents a nebulous "server" object as returned by Traffic Ops in
 * responses.
 */
export interface ResponseServer {
	/** The Cache Group to which the server belongs. */
	cachegroup: string;
	/**
	 * The integral, unique identifier of the Cache Group to which the server
	 * belongs.
	 */
	cachegroupId: number;
	/**
	 * The integral, unique identifier of the CDN to which the server belongs.
	 */
	cdnId: number;
	/** The name of the CDN to which the server belongs. */
	cdnName: string;
	/**
	 * The servers FQDN without its hostname - e.g. 'apache.org' from
	 * 'trafficcontrol.apache.org'.
	 */
	domainName: string;
	/**
	 * Legacy field with no purpose.
	 *
	 * @deprecated This field has no purpose and is subject to removal in the
	 * future.
	 */
	guid: number | null;
	/**
	 * The server's hostname, e.g. 'trafficcontrol' from
	 * 'trafficcontrol.apache.org'.
	 */
	hostName: string;
	/** The port used to serve HTTPS responses, if any. */
	httpsPort: number | null;
	/** An integral, unique identifier for this Server. */
	readonly id: number;
	/** The IP address of the Server's ILO interface. */
	iloIpAddress: string | null;
	/** The IP address of the gateway to the Server's ILO interface. */
	iloIpGateway: string | null;
	/**
	 * A netmask that describes the subnet allocated to the Server's ILO
	 * interface.
	 */
	iloIpNetmask: string | null;
	/** The Server's ILO interface's password. */
	iloPassword: string | null;
	/** The Server's ILO interface's root user's name. */
	iloUsername: string | null;
	/** The Server's network interfaces. */
	interfaces: Array<Interface>;
	/** The date/time at which the Server was last updated. */
	readonly lastUpdated: Date;
	/** The IP address of the server's management interface. */
	mgmtIpAddress: string | null;
	/** The IP address of the gateway to the Server's management interface. */
	mgmtIpGateway: string | null;
	/**
	 * The netmask that describes the subnet allocated to the Server's
	 * management interface.
	 */
	mgmtIpNetmask: string | null;
	/** The reason the Server has been taken out of service. */
	offlineReason: string | null;
	/** The physical location in which the Server resides. */
	physLocation: string;
	/**
	 * An integral, unique identifier for the physical location in which the
	 * Server resides.
	 */
	physLocationId: number;
	/** The Profile used by the Server. */
	profile: string | null;
	/**
	 * A description of the Profile used by the Server.
	 *
	 * @deprecated Future representations of Server objects will drop the
	 * Profile description entirely, as it's trivially deduced from Profile
	 * identity.
	 */
	profileDesc: string | null;
	/**
	 * An integral, unique identifier for the Profile used by the Server.
	 *
	 * @deprecated In the latest API version, a server's Profile is identified
	 * only by name, not unique, integral identifier.
	 */
	profileId: number | null;
	/**
	 * An _ordered_ array of strings representing the Profiles used by this server
	 */
	profileNames: Array<string>;
	/** Whether or not revalidations are pending for this Server. */
	revalPending: boolean;
	/**
	 * Legacy field with no purpose.
	 *
	 * @deprecated This field has no purpose and is subject to removal in the
	 * future.
	 */
	rack: string | null;
	/** The hostname of the router that routes to this Server. */
	routerHostName: string | null;
	/** The... name... of the port... used by the Server's router?? */
	routerPortName: string | null;
	/** The Server's status. */
	status: string;
	/** An integral, unique, identifier for the Server's Status. */
	statusId: number;
	/** The time at which the server's status was last updated. */
	statusLastUpdated: Date | null;
	/** The port on which the Server listens for incoming TCP connections. */
	tcpPort: number | null;
	/** The type of the Server. */
	type: string;
	/** An integral, unique identifier for the Type of this Server. */
	typeId: number;
	/** Whether or not this Server has updates pending. */
	updPending: boolean;
	/**
	 * The string used by Traffic Router for consistent hashing to this Server.
	 *
	 * This is generated for the server upon its creation, and cannot be
	 * modified afterwards.
	 */
	readonly xmppId: string;
	/** legacy field with no purpose. */
	xmppPasswd?: string | null;
}

/**
 * Represents a server of some kind in the context of a request to Traffic Ops.
 */
export interface RequestServer {
	/**
	 * The integral, unique identifier of the Cache Group to which the server
	 * belongs.
	 */
	cachegroupId: number;
	/**
	 * The integral, unique identifier of the CDN to which the server belongs.
	 */
	cdnId: number;
	 /**
	 * The servers FQDN without its hostname - e.g. 'apache.org' from
	 * 'trafficcontrol.apache.org'.
	 */
	domainName: string;
	/**
	 * Legacy field with no purpose.
	 *
	 * @deprecated This field has no purpose and is subject to removal in the
	 * future.
	 */
	guid?: number | null;
	/**
	 * The server's hostname, e.g. 'trafficcontrol' from
	 * 'trafficcontrol.apache.org'.
	 */
	hostName: string;
	/** The port used to serve HTTPS responses, if any. */
	httpsPort?: number | null;
	/** The IP address of the Server's ILO interface. */
	iloIpAddress?: string | null;
	/** The IP address of the gateway to the Server's ILO interface. */
	iloIpGateway?: string | null;
	/**
	 * A netmask that describes the subnet allocated to the Server's ILO
	 * interface.
	 */
	iloIpNetmask?: string | null;
	/** The Server's ILO interface's password. */
	iloPassword?: string | null;
	/** The Server's ILO interface's root user's name. */
	iloUsername?: string | null;
	/** The Server's network interfaces. */
	interfaces: Array<Interface>;
	/** The IP address of the server's management interface. */
	mgmtIpAddress?: string | null;
	/** The IP address of the gateway to the Server's management interface. */
	mgmtIpGateway?: string | null;
	/**
	 * The netmask that describes the subnet allocated to the Server's
	 * management interface.
	 */
	mgmtIpNetmask?: string | null;
	/** The reason the Server has been taken out of service. */
	offlineReason?: string | null;
	/**
	 * An integral, unique identifier for the physical location in which the
	 * Server resides.
	 */
	physLocationId: number;
	/**
	 * An integral, unique identifier for the Profile used by the Server.
	 *
	 * @deprecated In the latest API version, a server's Profile is identified
	 * only by name, not unique, integral identifier.
	 */
	profileId: number | null;
	/**
	 * An _ordered_ array of strings representing the Profiles used by this server
	 */
	profileNames: Array<string>;
	/**
	 * Legacy field with no purpose.
	 *
	 * @deprecated This field has no purpose and is subject to removal in the
	 * future.
	 */
	rack?: string | null;
	/** The hostname of the router that routes to this Server. */
	routerHostName?: string | null;
	/** The... name... of the port... used by the Server's router?? */
	routerPortName?: string | null;
	/** An integral, unique, identifier for the Server's Status. */
	statusId: number;
	/** A port on which the Server listens for TCP connections. */
	tcpPort?: number | null;
	/** An integral, unique identifier for the Type of this Server. */
	typeId: number;
}

/**
 * Generically represents a Server in the context of either a request or a
 * response.
 */
export type Server = RequestServer | ResponseServer;

/**
 * Servercheck models the data returned by the /servercheck API endpoint.
 */
export interface Servercheck {
	/** contains the server's Status */
	adminState: string;
	/** the name of the Cache Group to which the server belongs */
	cacheGroup: string;
	/**
	 * Checks emulates a map of check names to their numbers. All values are
	 * numbers, but some may express boolean concepts; for example, the ORT
	 * check uses 1 to represent "true" and any other value indicates "false".
	 */
	checks?: Record<string, number>;
	/** the server's hostname */
	hostName: string;
	/** the server's ID */
	id: number;
	/** the name of the server's Profile */
	profile: string;
	/** whether or not the server has pending revalidations */
	revalPending: boolean;
	/** the name of the server's Type */
	type: string;
	/** whether or not the server has updates pending */
	updPending: boolean;
}

/**
 * Represents a request to add a result to the table of "checks".
 */
export interface ServercheckUploadRequest {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	host_name: string;
	id: number;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	servercheck_short_name: string;
	value: string | number;
}

/**
 * Builds a true Map from the Servercheck's "checks" property.
 *
 * @param srv The Servercheck to convert.
 * @returns A map of servercheck check names to their values.
 */
export function checkMap(srv: Servercheck): Map<string, number | boolean> {
	const ret = new Map();
	if (!srv.checks) {
		return ret;
	}
	for (const [key, value] of Object.entries(srv.checks)) {
		switch (key) {
			case "ILO":
			case "10G":
			case "FQDN":
			case "DSCP":
			case "10G6":
			case "MTU":
				ret.set(key, value === 1);
				break;
			default:
				ret.set(key, value);
				break;
		}
	}
	return ret;
}

/**
 * A Servercheck Extension as Traffic Ops requires it in requests.
 */
export interface RequestServercheckExtension {
	/* eslint-disable @typescript-eslint/naming-convention */
	/** @default null */
	additional_config_json?: string | null;
	/** @default null */
	description?: string | null;
	info_url: string;
	isactive: 0 | 1;
	name: string;
	servercheck_short_name: string;
	script_file: string;
	type: string;
	version: string;
	/* eslint-enable @typescript-eslint/naming-convention */
}

/**
 * Traffic Ops's non-standard response to a {@link RequestServercheckExtension}.
 */
export interface RequestServercheckExtensionResponse {
	alerts: Array<Alert>;
	supplemental: {
		readonly id: number;
	};
}

/**
 * Represents a Servercheck Extension as presented by Traffic Ops in responses.
 */
export interface ResponseServercheckExtension {
	/* eslint-disable @typescript-eslint/naming-convention */
	additional_config_json: string | null;
	description: string | null;
	readonly id: number;
	info_url: string;
	isactive: 0 | 1;
	name: string;
	servercheck_short_name: string;
	script_file: string;
	type: string;
	version: string;
	/* eslint-enable @typescript-eslint/naming-convention */
}

/**
 * A Servercheck extension is a "check"-type extension to Traffic Ops that
 * provides servercheck data for later retrieval through the `/servercheck`
 * endpoint.
 */
export type ServercheckExtension = RequestServercheckExtension | ResponseServercheckExtension;

/**
 * @deprecated This gives no useful information that a {@link Server} doesn't,
 * so there's no reason to use it.
 */
export interface ServerDetails  {
	cachegroup: string;
	cdnName: string;
	deliveryservices?: [number, ...number[]];
	domainName: string;
	/** @deprecated this has no known purpose, and you shouldn't invent one. */
	guid: string | null;
	/**
	 * @deprecated This field is legacy and cannot be populated, and should be
	 * removed soon (if this whole type isn't).
	 */
	hardwareInfo: unknown;
	hostName: string;
	httpsPort: number | null;
	readonly id: number;
	iloIpAddress: string;
	iloIpGateway: string;
	iloIpNetmask: string;
	iloPassword: string;
	iloUsername: string;
	interfaces: Array<Interface>;
	mgmtIpAddress: string;
	mgmtIpGateway: string;
	mgmtIpNetmask: string;
	offlineReason: string;
	physLocation: string;
	profile: string | null;
	/** @deprecated This has been removed from the latest API version. */
	profileDesc: string | null;
	/** @deprecated this has no known purpose, and you shouldn't invent one. */
	profileNames: Array<string>;
	rack: string;
	routerHostName: string;
	routerPortName: string;
	status: string;
	tcpPort: number | null;
	type: string;
	xmppId: string;
	xmppPasswd: string;
}

/**
 * Represents the various statuses of a Server to give a complete view of its
 * current state.
 */
export interface ServerUpdateStatus {
	configApplyTime: Date;
	configUpdateTime: Date;
	/* eslint-disable @typescript-eslint/naming-convention */
	host_id: number;
	host_name: string;
	parent_pending: boolean;
	parent_reval_pending: boolean;
	revalUpdateTime: Date;
	revalApplyTime: Date;
	reval_pending: boolean;
	status: string;
	upd_pending: boolean;
	use_reval_pending: boolean;
	/* eslint-enable @typescript-eslint/naming-convention */
}

/**
 * Represents a response from Traffic Ops to a request to associate zero or more
 * Delivery Services with a server.
 */
export interface ServerDeliveryServices {
	dsIds: Array<number>;
	serverId: number;
	replace: boolean;
}
