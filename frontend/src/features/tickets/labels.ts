import { TICKET_STATUSES, type TicketPriority, type TicketStatus } from './types';

export const PRIORITY_ITEMS = [
    { label: 'Low', value: 'LOW' as const },
    { label: 'Medium', value: 'MEDIUM' as const },
    { label: 'High', value: 'HIGH' as const },
] satisfies { label: string; value: TicketPriority }[];

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
    HIGH: 'High',
    LOW: 'Low',
    MEDIUM: 'Medium',
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
    CLOSED: 'Closed',
    IN_PROGRESS: 'In Progress',
    OPEN: 'Open',
};

export const STATUS_ITEMS = TICKET_STATUSES.map((value) => ({
    label: STATUS_LABELS[value],
    value,
}));

export const STATUS_FILTER_ITEMS: { label: string; value: TicketStatus | null }[] = [
    { label: 'All Statuses', value: null },
    ...STATUS_ITEMS,
];