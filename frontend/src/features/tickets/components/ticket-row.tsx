'use client';

import { memo } from 'react';

import { TableCell, TableRow } from '@/components/ui/table';

import type { Ticket } from '../types';
import { PriorityBadge } from './priority-badge';
import { StatusBadge } from './status-badge';

const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

interface TicketRowProps {
    ticket: Ticket;
}

export const TicketRow = memo(function TicketRow({ ticket }: TicketRowProps) {
    return (
        <TableRow>
            <TableCell className="font-medium">{ticket.title}</TableCell>
            <TableCell>
                <StatusBadge status={ticket.status} ticketId={ticket.id} />
            </TableCell>
            <TableCell>
                <PriorityBadge priority={ticket.priority} />
            </TableCell>
            <TableCell className="text-muted-foreground">
                {DATE_FORMATTER.format(new Date(ticket.createdAt))}
            </TableCell>
        </TableRow>
    );
});