export function deepCopy<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(deepCopy) as unknown as T;
    const copy = Object.create(Object.getPrototypeOf(obj));
    for (const key of Object.keys(obj)) {
        (copy as any)[key] = deepCopy((obj as any)[key]);
    }
    return copy;
}
