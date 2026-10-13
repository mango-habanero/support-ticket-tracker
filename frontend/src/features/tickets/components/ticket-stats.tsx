import { connection } from 'next/server';

import { STATUS_LABELS } from '../labels';
import { fetchTicketStats } from '../resources';
import type { TicketStatusCount } from '../types';

export async function TicketStats() {
    await connection();

    let counts: TicketStatusCount[];

    try {
        const response = await fetchTicketStats();
        counts = response.data;
    } catch {
        return (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                Stats unavailable.
            </div>
        );
    }

    if (counts.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {counts.map((item) => (
                <div key={item.status} className="rounded-lg border bg-card p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                        {STATUS_LABELS[item.status]}
                    </p>
                    <p className="mt-1 text-2xl font-bold">{item.count}</p>
                </div>
            ))}
        </div>
    );
}