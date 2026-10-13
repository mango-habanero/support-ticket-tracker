'use server';

import { revalidatePath } from 'next/cache';

import { ApiError } from '@/lib/api-client';
import type { ErrorResponse } from '@/lib/types/api';

import { createTicket, updateTicket } from './resources';
import type {
    CreateTicketRequest,
    Ticket,
    UpdateTicketRequest,
} from './types';

interface ActionFailure {
    error: ErrorResponse;
    success: false;
}

interface ActionSuccess<T> {
    data: T;
    success: true;
}

export type ActionState<T> = ActionFailure | ActionSuccess<T>;

function toFailure(error: unknown): ActionFailure {
    if (error instanceof ApiError) {
        return { error: error.response, success: false };
    }

    return {
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            detail: 'An unexpected error occurred while processing your request.',
            instance: '',
            status: 500,
            title: 'An unexpected error occurred while processing your request.',
        },
        success: false,
    };
}

export async function createTicketAction(
    data: CreateTicketRequest,
): Promise<ActionState<Ticket>> {
    try {
        const response = await createTicket(data);
        revalidatePath('/');
        return { data: response.data, success: true };
    } catch (error) {
        return toFailure(error);
    }
}

export async function updateTicketAction(
    id: number,
    data: UpdateTicketRequest,
): Promise<ActionState<Ticket>> {
    try {
        const response = await updateTicket(id, data);
        revalidatePath('/');
        return { data: response.data, success: true };
    } catch (error) {
        return toFailure(error);
    }
}