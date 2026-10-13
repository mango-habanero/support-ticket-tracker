'use client';

import { useTransition } from 'react';

import { useQueryStates } from 'nuqs';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { STATUS_FILTER_ITEMS } from '../labels';
import { ticketParamsParser } from '../params';
import type { TicketStatus } from '../types';

export function StatusFilter() {
    const [isPending, startTransition] = useTransition();
    const [params, setParams] = useQueryStates(ticketParamsParser, {
        shallow: false,
        startTransition,
    });

    const handleChange = (value: string | null) => {
        setParams({ page: 1, status: value as TicketStatus | null });
    };

    return (
        <Select
            disabled={isPending}
            items={STATUS_FILTER_ITEMS}
            onValueChange={handleChange}
            value={params.status ?? null}
        >
            <SelectTrigger aria-label="Filter by status" className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
                {STATUS_FILTER_ITEMS.map((item) => (
                    <SelectItem key={item.value ?? 'all'} value={item.value}>
                        {item.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}