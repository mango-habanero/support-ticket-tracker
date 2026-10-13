'use client';

import { ChevronDownIcon } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { updateTicketAction } from '../actions';
import { STATUS_LABELS } from '../labels';
import { NEXT_STATUSES, type TicketStatus } from '../types';

const STATUS_VARIANTS: Record<TicketStatus, string> = {
    CLOSED:
        'border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    IN_PROGRESS:
        'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    OPEN: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

interface StatusBadgeProps {
    status: TicketStatus;
    ticketId: number;
}

export function StatusBadge({ status, ticketId }: StatusBadgeProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticStatus, setOptimisticStatus] = useOptimistic(
        status,
        (_current: TicketStatus, next: TicketStatus) => next,
    );

    const nextStatuses = NEXT_STATUSES[optimisticStatus];

    if (nextStatuses.length === 0) {
        return (
            <Badge
                className={cn('rounded-full', STATUS_VARIANTS[optimisticStatus])}
            >
                {STATUS_LABELS[optimisticStatus]}
            </Badge>
        );
    }

    const handleSelect = (next: TicketStatus) => {
        startTransition(async () => {
            setOptimisticStatus(next);
            const result = await updateTicketAction(ticketId, { status: next });

            if (!result.success) {
                toast.error(result.error.detail);
            }
        });
    };

    return (
        <Popover>
            <PopoverTrigger
                nativeButton={false}
                render={
                    <Badge
                        className={cn(
                            'cursor-pointer gap-1 rounded-full transition-opacity',
                            STATUS_VARIANTS[optimisticStatus],
                            isPending && 'opacity-60',
                        )}
                    />
                }
            >
                {STATUS_LABELS[optimisticStatus]}
                <ChevronDownIcon className="h-3 w-3 opacity-60" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-40 p-1">
                {nextStatuses.map((next) => (
                    <button
                        key={next}
                        aria-label={`Set status to ${STATUS_LABELS[next]}`}
                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                        disabled={isPending}
                        onClick={() => handleSelect(next)}
                        type="button"
                    >
                        <span
                            className={cn(
                                'h-2 w-2 rounded-full',
                                next === 'OPEN' && 'bg-green-500',
                                next === 'IN_PROGRESS' && 'bg-amber-500',
                                next === 'CLOSED' && 'bg-slate-400',
                            )}
                        />
                        <span className="flex-1">{STATUS_LABELS[next]}</span>
                    </button>
                ))}
            </PopoverContent>
        </Popover>
    );
}