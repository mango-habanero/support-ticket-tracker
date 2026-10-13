export const NEXT_STATUSES: Record<TicketStatus, readonly TicketStatus[]> = {
    CLOSED: [],
    IN_PROGRESS: ['CLOSED'],
    OPEN: ['IN_PROGRESS', 'CLOSED'],
};

export const TICKET_STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED'] as const;

export type TicketPriority = 'HIGH' | 'LOW' | 'MEDIUM';

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface CreateTicketRequest {
    description?: string;
    priority: TicketPriority;
    title: string;
}

export interface Ticket {
    createdAt: string;
    description: string | null;
    id: number;
    priority: TicketPriority;
    status: TicketStatus;
    title: string;
}

export interface TicketStatusCount {
    count: number;
    status: TicketStatus;
}

export interface UpdateTicketRequest {
    status: TicketStatus;
}