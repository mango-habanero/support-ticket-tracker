'use client';

import { useTransition } from 'react';

import { useQueryStates } from 'nuqs';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { ticketParamsParser } from '../params';
import type { Ticket } from '../types';
import { PaginationControls } from './pagination-controls';
import { TicketRow } from './ticket-row';

interface TicketTableProps {
    data: Ticket[];
    pageCount: number;
    totalElements: number;
}

export function TicketTable({
                                data,
                                pageCount,
                                totalElements,
                            }: TicketTableProps) {
    const [isPending, startTransition] = useTransition();
    const [params, setParams] = useQueryStates(ticketParamsParser, {
        shallow: false,
        startTransition,
    });

    const handlePageChange = (page: number) => {
        void setParams({ page });
    };

    const handlePageSizeChange = (size: number) => {
        void setParams({ limit: size, page: 1 });
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    className="h-24 text-center text-sm text-muted-foreground"
                                    colSpan={4}
                                >
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((ticket) => (
                                <TicketRow key={ticket.id} ticket={ticket} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <PaginationControls
                currentPage={params.page}
                disabled={isPending}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageCount={pageCount}
                pageSize={params.limit}
                totalElements={totalElements}
            />
        </div>
    );
}