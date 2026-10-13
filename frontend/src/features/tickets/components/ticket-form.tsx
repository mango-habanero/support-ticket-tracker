'use client';

import { useActionState, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { createTicketAction, type ActionState } from '../actions';
import { PRIORITY_ITEMS } from '../labels';
import type { CreateTicketRequest, Ticket, TicketPriority } from '../types';

const initialState: ActionState<Ticket> | null = null;

export function TicketForm() {
    const [formKey, setFormKey] = useState(0);

    const [state, formAction, isPending] = useActionState(
        async (_previous: ActionState<Ticket> | null, formData: FormData) => {
            const description = String(formData.get('description') ?? '').trim();
            const payload: CreateTicketRequest = {
                description: description || undefined,
                priority: formData.get('priority') as TicketPriority,
                title: String(formData.get('title') ?? '').trim(),
            };
            const result = await createTicketAction(payload);

            if (result.success) {
                setFormKey((k) => k + 1);
                toast.success('Ticket created successfully.');
            } else if (!result.error.errors || result.error.errors.length === 0) {
                toast.error(result.error.detail);
            }

            return result;
        },
        initialState,
    );

    const fieldError = (field: string): string | undefined =>
        state && !state.success
            ? state.error.errors?.find((e) => e.field === field)?.message
            : undefined;

    const titleError = fieldError('title');
    const descriptionError = fieldError('description');
    const priorityError = fieldError('priority');

    return (
        <form action={formAction} className="space-y-6" key={formKey}>
            <FieldGroup>
                <Field data-invalid={titleError ? true : undefined}>
                    <FieldLabel htmlFor="ticket-title">Title</FieldLabel>
                    <Input
                        aria-describedby={titleError ? 'ticket-title-error' : undefined}
                        aria-invalid={titleError ? true : undefined}
                        disabled={isPending}
                        id="ticket-title"
                        name="title"
                        required
                    />
                    {titleError && (
                        <FieldError id="ticket-title-error">{titleError}</FieldError>
                    )}
                </Field>

                <Field data-invalid={descriptionError ? true : undefined}>
                    <FieldLabel htmlFor="ticket-description">Description</FieldLabel>
                    <Textarea
                        aria-describedby={
                            descriptionError ? 'ticket-description-error' : undefined
                        }
                        aria-invalid={descriptionError ? true : undefined}
                        disabled={isPending}
                        id="ticket-description"
                        name="description"
                        rows={4}
                    />
                    {descriptionError && (
                        <FieldError id="ticket-description-error">
                            {descriptionError}
                        </FieldError>
                    )}
                </Field>

                <Field data-invalid={priorityError ? true : undefined}>
                    <FieldLabel htmlFor="ticket-priority">Priority</FieldLabel>
                    <Select
                        disabled={isPending}
                        items={PRIORITY_ITEMS}
                        name="priority"
                        required
                    >
                        <SelectTrigger
                            aria-describedby={
                                priorityError ? 'ticket-priority-error' : undefined
                            }
                            aria-invalid={priorityError ? true : undefined}
                            className="w-full"
                            id="ticket-priority"
                        >
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            {PRIORITY_ITEMS.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {priorityError && (
                        <FieldError id="ticket-priority-error">{priorityError}</FieldError>
                    )}
                </Field>
            </FieldGroup>

            <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? 'Creating…' : 'Create Ticket'}
            </Button>
        </form>
    );
}