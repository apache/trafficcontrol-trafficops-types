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

/** The basic fields common to all ISO request bodies. */
interface ISOFields {
	disk: string;
	domainName: string;
	hostName: string;
	interfaceMtu: number;
	interfaceName?: string | null;
	ip6Address?: string | null;
	ip6Gateway?: string | null;
	mgmtInterface?: string | null;
	mgmtIpAddress?: string | null;
	mgmtIpGateway?: string | null;
	mgmtIpNetmask?: string | null;
	osVersionDir: string;
	rootPass: string;
}

/**
 * An ISO generation request. If DHCP isn't used, network information must be
 * manually supplied.
 */
interface ISORequestDHCP extends ISOFields {
	dhcp: "no";
	ipAddress: string;
	ipGateway: string;
	ipNetmask: string;
}

/**
 * An ISO generation request. If DHCP is used, network inforation need not be
 * supplied.
 */
interface ISORequestNonDHCP extends ISOFields {
	dhcp: "yes";
}

/**
 * Represents a request to the `/isos` endpoint of the Traffic Ops API.
 */
export type ISORequest = ISORequestDHCP | ISORequestNonDHCP;

/**
 * Represents a response from the Traffic Ops API to a request made to its
 * `/osversions` endpoint.
 */
export interface OSVersions {
	[osversion: string]: string;
}
