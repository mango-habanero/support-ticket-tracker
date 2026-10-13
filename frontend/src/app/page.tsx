import { Suspense } from 'react';

import { StatusFilter } from '@/features/tickets/components/status-filter';
import { TicketForm } from '@/features/tickets/components/ticket-form';
import { TicketStats } from '@/features/tickets/components/ticket-stats';
import { TicketTable } from '@/features/tickets/components/ticket-table';
import { ticketParamsCache } from '@/features/tickets/params';
import { listTickets } from '@/features/tickets/resources';

interface TicketTrackerPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function TicketTrackerPage({
                                              searchParams,
                                          }: TicketTrackerPageProps) {
    return (
        <div className="container mx-auto p-6">
            <h1 className="mb-6 text-2xl font-bold">Ticket Tracker</h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                <main className="space-y-4">
                    <Suspense fallback={<StatsSkeleton />}>
                        <TicketStats />
                    </Suspense>

                    <Suspense fallback={<FilterSkeleton />}>
                        <StatusFilter />
                    </Suspense>

                    <Suspense fallback={<TableSkeleton />}>
                        <TicketList searchParams={searchParams} />
                    </Suspense>
                </main>

                <aside className="lg:sticky lg:top-6 lg:self-start">
                    <TicketForm />
                </aside>
            </div>
        </div>
    );
}

async function TicketList({ searchParams }: TicketTrackerPageProps) {
    const { limit, page, status } = await ticketParamsCache.parse(searchParams);

    const response = await listTickets({ limit, page, status });

    return (
        <TicketTable
            data={response.data}
            pageCount={response.totalPages}
            totalElements={response.totalElements}
        />
    );
}

function FilterSkeleton() {
    return <div className="h-8 w-50 animate-pulse rounded-md bg-muted" />;
}

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="h-20 animate-pulse rounded-lg border bg-muted" />
            <div className="h-20 animate-pulse rounded-lg border bg-muted" />
            <div className="h-20 animate-pulse rounded-lg border bg-muted" />
        </div>
    );
}

function TableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-100 animate-pulse rounded-md border bg-muted" />
            <div className="h-12 animate-pulse rounded-md bg-muted" />
        </div>
    );
}