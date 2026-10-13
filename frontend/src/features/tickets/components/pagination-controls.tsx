'use client';

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface PaginationControlsProps {
    currentPage: number;
    disabled?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageCount: number;
    pageSize: number;
    totalElements: number;
}

export function PaginationControls({
                                       currentPage,
                                       disabled = false,
                                       onPageChange,
                                       onPageSizeChange,
                                       pageCount,
                                       pageSize,
                                       totalElements,
                                   }: PaginationControlsProps) {
    const safeTotalElements = Math.max(totalElements, 0);
    const safePageCount = Math.max(pageCount, 1);
    const safeCurrentPage = Math.min(Math.max(currentPage, 1), safePageCount);

    const startItem =
        safeTotalElements === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
    const endItem =
        safeTotalElements === 0
            ? 0
            : Math.min(safeCurrentPage * pageSize, safeTotalElements);

    const canGoPrevious = safeCurrentPage > 1;
    const canGoNext = safeCurrentPage < safePageCount;

    return (
        <div className="flex flex-col gap-3 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                Showing {startItem} to {endItem} of {safeTotalElements} results
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center justify-between gap-2 sm:justify-start">
                    <p className="shrink-0 text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => onPageSizeChange(Number(value))}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-8 w-[72px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                    <p className="min-w-0 text-sm font-medium text-muted-foreground">
                        Page {safeCurrentPage} of {safePageCount}
                    </p>

                    <Pagination className="mx-0 w-auto justify-end">
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    aria-label="Go to first page"
                                    disabled={!canGoPrevious || disabled}
                                    onClick={() => onPageChange(1)}
                                    size="icon"
                                    variant="outline"
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    aria-label="Go to previous page"
                                    disabled={!canGoPrevious || disabled}
                                    onClick={() => onPageChange(safeCurrentPage - 1)}
                                    size="icon"
                                    variant="outline"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    aria-label="Go to next page"
                                    disabled={!canGoNext || disabled}
                                    onClick={() => onPageChange(safeCurrentPage + 1)}
                                    size="icon"
                                    variant="outline"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    aria-label="Go to last page"
                                    disabled={!canGoNext || disabled}
                                    onClick={() => onPageChange(safePageCount)}
                                    size="icon"
                                    variant="outline"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}