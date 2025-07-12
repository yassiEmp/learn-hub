/**
 * Executes an async function and returns a tuple with either the result or the error.
 * @param func An async function to execute.
 * @returns An object: { err: null, res: T } on success, or { err: unknown, res: null } on failure.
 */
async function catchErr<T>(func: Promise<T>): Promise<[unknown, T | null]> {
    try {
        const res = await func ;
        return [null, res];
    } catch (err) {
        return [err, null];
    }
}

export { catchErr }