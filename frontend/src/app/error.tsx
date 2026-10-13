'use client';

import { useEffect } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorProps {
    error: Error & { digest?: string };
    retry: () => void;
}

export default function TicketTrackerError({ error, retry }: ErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center p-6">
            <Alert className="w-full max-w-md" variant="destructive">
                <AlertTitle>Unable to load tickets</AlertTitle>
                <AlertDescription className="space-y-4">
                    <p>
                        An unexpected error occurred while loading this page. Please try
                        again.
                    </p>
                    {error.digest && (
                        <p className="font-mono text-xs text-muted-foreground">
                            Reference: {error.digest}
                        </p>
                    )}
                    <Button onClick={retry} variant="outline">
                        Try again
                    </Button>
                </AlertDescription>
            </Alert>
        </div>
    );
}