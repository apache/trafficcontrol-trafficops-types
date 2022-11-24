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
 * Represents the SSL Keys for a Delivery Service within a CDN as presented by
 * Traffic Ops in its responses to requests made to its
 * `/cdns/name/{{name}}/sslkeys` API endpoint.
 */
export interface CDNDeliveryServiceSSLKeys {
	certificate: {
		crt: string;
		key: string;
	};
	deliveryservice: string;
}

/** Represents an SSL Key uploaded for a Delivery Service. */
export interface DeliveryServiceSSLKeyUpload {
	authType?: string | null;
	cdn: string;
	certificate: {
		/** Certificate */
		crt: string;
		/** Certificate Signing Request */
		csr: string;
		/** Private SSL Key */
		key: string;
	};
	deliveryservice: string;
	hostname: string;
	/**
	 * The XMLID of the Delivery Service that will use/is using this SSL
	 * certificate/key pair.
	 */
	key: string;
	version: string;
}

/**
 * Represents a request to have Traffic Ops generate an SSL Key/Certificate pair
 * for a Delivery Service.
 */
export interface DeliveryServiceSSLKeyGenerationRequest {
	businessUnit: string;
	cdn: string;
	city: string;
	country: string;
	hostname: string;
	/**
	 * The XMLID of the Delivery Service for which an SSL Key/Certificate pair
	 * will be generated.
	 */
	key: string;
	organization: string;
	state: string;
	version: string;
}

/**
 * Represents a request to have Traffic Ops generate an SSL Key/Certificate pair
 * for a Delivery Service using LetsEncrypt (or another configured ACME
 * service).
 *
 * @deprecated This has been superseded by the more general
 * {@link ACMEDeliveryServiceSSLKeyGenerationRequest}.
 */
export interface LetsEncryptDeliveryServiceSSLKeyGenerationRequest {
	cdn: string;
	deliveryservice: string;
	hostname: string;
	key: string;
	version: string;
}

/**
 * Represents a request to have Traffic Ops request an SSL Key/Certificate pair
 * for a Delivery Service from an ACME provider.
 */
export interface ACMEDeliveryServiceSSLKeyGenerationRequest{
	/**
	 * The certificate provider correlating to an ACME account in cdn.conf or
	 * Let’s Encrypt.
	 */
	authType: string;
	/**
	 * The XMLID of the Delivery Service for which keys will be generated.
	 *
	 * Either the `key` or the `deliveryservice` field must be provided. If both
	 * are provided, then they must match.
	 */
	key?: string | null | undefined;
	/**
	 * The XMLID of the Delivery Service for which keys will be generated.
	 *
	 * Either the `key` or the `deliveryservice` field must be provided. If both
	 * are provided, then they must match.
	 */
	deliveryservice?: string | null | undefined;
	/**
	 * An integer that defines the "version" of the key - which may be thought
	 * of as the sequential generation; that is, the higher the number the more
	 * recent the key.
	 */
	version: string;
	/** The desired hostname of the Delivery Service. */
	hostname: string;
}

/**
 * Represents a Delivery Service's SSL Key/Certificate pair as presented by
 * Traffic Ops in responses.
 */
export interface ResponseDeliveryServiceSSLKey {
	certificate: {
		crt: string;
		key: string;
		csr: string;
	};
	deliveryservice: string;
	cdn: string;
	businessUnit?: string;
	city?: string;
	organization?: string;
	hostname?: string;
	country?: string;
	state?: string;
	version: string;
	expiration: Date;
}
