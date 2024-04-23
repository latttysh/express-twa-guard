export class UnauthorizedError extends Error {
    readonly status: number;
    readonly inner: string;

    constructor(status: number = 401, error: string) {
        super(error);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
        this.status = status;
        this.name = 'UnauthorizedError';
    }
}