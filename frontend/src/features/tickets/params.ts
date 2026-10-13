import {
    createSearchParamsCache,
    parseAsInteger,
    parseAsStringEnum,
} from 'nuqs/server';

import { TICKET_STATUSES, type TicketStatus } from './types';

export const ticketParamsParser = {
    limit: parseAsInteger.withDefault(20),
    page: parseAsInteger.withDefault(1),
    status: parseAsStringEnum<TicketStatus>([...TICKET_STATUSES]),
};

export const ticketParamsCache = createSearchParamsCache(ticketParamsParser);