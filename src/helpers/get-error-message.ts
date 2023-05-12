import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { APIError } from "features/auth/types";

export function getErrorMessage(err: unknown) {
    let title: string | undefined = undefined;
    let description: string = 'No description';
    if (isApiError(err)) {
        title = (err as any).data.error;
        description = (err as any).data.message;
    } else if (isFetchBaseQueryError(err)) {
        description = 'error' in err ? err.error : JSON.stringify(err.data);
    } else if (isErrorWithMessage(err)) {
        description = err.message
    } 

    return { title, description }
}

function isApiError(error: unknown): error is APIError {
    return typeof error === 'object' && error !== null && 'data' in error && typeof (error as any).data === 'object' &&
        'message' in (error as any).data && typeof (error as any).data.message === 'string' &&
        'error' in (error as any).data && typeof (error as any).data.error === 'string';
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
}

function isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error != null && 'message' in error && typeof (error as any).message === 'string'
}