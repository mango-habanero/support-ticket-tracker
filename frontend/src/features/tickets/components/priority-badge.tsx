import { cva, type VariantProps } from 'class-variance-authority';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { PRIORITY_LABELS } from '../labels';
import type { TicketPriority } from '../types';

const priorityBadgeVariants = cva('rounded-full', {
    variants: {
        priority: {
            HIGH: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            LOW: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            MEDIUM:
                'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
        },
    },
});

interface PriorityBadgeProps extends VariantProps<typeof priorityBadgeVariants> {
    priority: TicketPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
    return (
        <Badge
            aria-label={`Priority: ${PRIORITY_LABELS[priority]}`}
            className={cn(priorityBadgeVariants({ priority }))}
        >
            {PRIORITY_LABELS[priority]}
        </Badge>
    );
}