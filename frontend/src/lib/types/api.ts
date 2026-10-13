export interface ErrorResponse {
    code: string;
    detail: string;
    errorReference?: string;
    errors?: FieldError[];
    instance: string;
    status: number;
    title: string;
}

export interface FieldError {
    field: string;
    message: string;
    rejectedValue?: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    first: boolean;
    last: boolean;
    message?: string;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface SuccessResponse<T> {
    code: string;
    data: T;
    message?: string;
}