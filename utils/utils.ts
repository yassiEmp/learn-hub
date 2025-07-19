export type Result<T> = { err: null; res: T } | { err: unknown; res: null };

/**
 * Executes an async function and returns a Result object.
 * @param func An async function to execute.
 * @returns An object: { err: null, res: T } on success, or { err: unknown, res: null } on failure.
 */
async function catchErr<T>(func: Promise<T>): Promise<Result<T>> {
    try {
        const res = await func;
        return { err: null, res };
    } catch (err) {
        return { err, res: null };
    }
}

export { catchErr }