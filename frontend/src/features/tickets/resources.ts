import { baseFetch } from '@/lib/api-client';
import type { PaginatedResponse, SuccessResponse } from '@/lib/types/api';

import type {
    CreateTicketRequest,
    Ticket,
    TicketStatus,
    TicketStatusCount,
    UpdateTicketRequest,
} from './types';

const MAX_LIMIT = 100;
const MIN_LIMIT = 1;
const MIN_PAGE = 1;

export interface ListTicketsParams {
    limit?: number;
    page?: number;
    status?: TicketStatus | null;
}

function apiBaseUrl(): string {
    const baseUrl = process.env.API_BASE_URL;

    if (!baseUrl) {
        throw new Error('API_BASE_URL is not set.');
    }

    return baseUrl;
}

function buildTicketQuery(params: ListTicketsParams): string {
    const query = new URLSearchParams();

    if (params.limit !== undefined) {
        if (params.limit < MIN_LIMIT || params.limit > MAX_LIMIT) {
            throw new RangeError(`limit must be between ${MIN_LIMIT} and ${MAX_LIMIT}`);
        }
        query.set('limit', String(params.limit));
    }

    if (params.page !== undefined) {
        if (params.page < MIN_PAGE) {
            throw new RangeError(`page must be at least ${MIN_PAGE}`);
        }
        query.set('page', String(params.page));
    }

    if (params.status !== undefined && params.status !== null) {
        query.set('status', params.status);
    }

    return query.toString();
}

export async function createTicket(
    data: CreateTicketRequest,
): Promise<SuccessResponse<Ticket>> {
    return baseFetch<SuccessResponse<Ticket>>(apiBaseUrl(), '/tickets', {
        body: JSON.stringify(data),
        method: 'POST',
    });
}

export async function fetchTicketStats(): Promise<
    SuccessResponse<TicketStatusCount[]>
> {
    return baseFetch<SuccessResponse<TicketStatusCount[]>>(
        apiBaseUrl(),
        '/tickets/stats',
    );
}

export async function listTickets(
    params: ListTicketsParams = {},
): Promise<PaginatedResponse<Ticket>> {
    const query = buildTicketQuery(params);
    const endpoint = query ? `/tickets?${query}` : '/tickets';
    return baseFetch<PaginatedResponse<Ticket>>(apiBaseUrl(), endpoint);
}

export async function updateTicket(
    id: number,
    data: UpdateTicketRequest,
): Promise<SuccessResponse<Ticket>> {
    return baseFetch<SuccessResponse<Ticket>>(apiBaseUrl(), `/tickets/${id}`, {
        body: JSON.stringify(data),
        method: 'PATCH',
    });
}