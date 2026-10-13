import type { ErrorResponse } from '@/lib/types/api';

const DEFAULT_TIMEOUT_MS = 10_000;
const INITIAL_RETRY_DELAY_MS = 1_000;
const MAX_RETRIES = 2;

export class ApiError extends Error {
    readonly response: ErrorResponse;
    readonly status: number;

    constructor(response: ErrorResponse, status: number) {
        super(response.detail);
        this.name = 'ApiError';
        this.response = response;
        this.status = status;
    }
}

export class ConnectionError extends Error {
    constructor(url: string, cause: Error) {
        super(`Connection failed for ${url}`);
        this.name = 'ConnectionError';
        this.cause = cause;
    }
}

export class TimeoutError extends Error {
    constructor(url: string, timeoutMs: number) {
        super(`Request timed out after ${timeoutMs}ms for ${url}`);
        this.name = 'TimeoutError';
    }
}

interface FetchConfiguration {
    headers?: Record<string, string>;
    maxRetries?: number;
    timeout?: number;
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout<T>(
    url: string,
    options: RequestInit,
    timeoutMs: number,
): Promise<T> {
    const signal = AbortSignal.timeout(timeoutMs);

    const response = await fetch(url, { ...options, signal });

    if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new ApiError(errorData, response.status);
    }

    if (
        response.status === 204 ||
        response.headers.get('content-length') === '0'
    ) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export async function baseFetch<T>(
    baseUrl: string,
    endpoint: string,
    options: RequestInit = {},
    config: FetchConfiguration = {},
): Promise<T> {
    const fetchOptions: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...config.headers,
            ...options.headers,
        },
    };

    const isRead = (options.method ?? 'GET').toUpperCase() === 'GET';
    const maxRetries = config.maxRetries ?? (isRead ? MAX_RETRIES : 0);
    const timeoutMs = config.timeout ?? DEFAULT_TIMEOUT_MS;
    const url = `${baseUrl}${endpoint}`;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fetchWithTimeout<T>(url, fetchOptions, timeoutMs);
        } catch (error) {
            lastError = error as Error;

            if (error instanceof ApiError) {
                throw error;
            }

            if (error instanceof DOMException && error.name === 'TimeoutError') {
                lastError = new TimeoutError(url, timeoutMs);
            }

            if (attempt === maxRetries) {
                break;
            }

            const delayMs = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
            await delay(delayMs);
        }
    }

    if (lastError instanceof TimeoutError) {
        throw lastError;
    }

    throw new ConnectionError(url, lastError as Error);
}