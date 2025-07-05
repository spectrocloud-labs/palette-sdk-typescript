/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PaletteConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

export interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  params?: any;
  data?: any;
  responseType?: string;
}

// This is the mutator that Orval will use
export const customInstance = async <T>(
  url: string,
  options: RequestInit & { paletteConfig?: PaletteConfig }
): Promise<T> => {
  const { paletteConfig, ...requestInit } = options;

  if (!paletteConfig) {
    throw new Error("PaletteConfig is required but not provided");
  }

  const { baseURL, headers = {}, timeout, signal } = paletteConfig;

  // If the URL already includes the base URL, use it as-is, otherwise prepend baseURL
  const targetUrl = url.startsWith("http") ? url : `${baseURL}${url}`;

  const finalRequestInit: RequestInit = {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...requestInit.headers,
    },
    signal: signal || requestInit.signal,
  };

  // Handle timeout
  let timeoutId: NodeJS.Timeout | undefined;
  const controller = new AbortController();

  if (timeout && !finalRequestInit.signal) {
    timeoutId = setTimeout(() => controller.abort(), timeout);
    finalRequestInit.signal = controller.signal;
  }

  try {
    const response = await fetch(targetUrl, finalRequestInit);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle different response types
    const contentType = response.headers.get("content-type");

    let data: any;
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else if (contentType?.includes("text/")) {
      data = await response.text();
    } else {
      data = await response.blob();
    }

    // Return the response in the expected Orval format
    return {
      data,
      status: response.status,
      headers: response.headers,
    } as T;
  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    throw error;
  }
};

// Helper function for creating pre-configured API clients
export const createConfiguredInstance = <T>(config: PaletteConfig) => {
  return async (url: string, options: RequestInit = {}): Promise<T> => {
    return customInstance<T>(url, { ...options, paletteConfig: config });
  };
};

export default customInstance;
