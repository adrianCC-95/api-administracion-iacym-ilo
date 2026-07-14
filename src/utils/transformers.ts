export function toNumberOrUndefined(value: any): number | undefined {
    if (value === null || value === undefined) return undefined;
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
}

export function toBooleanOrOriginal(value: any): boolean | any {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
}

export function toTrim(value: any) {
    if (typeof value !== 'string') return value;
    return value.trim().toLowerCase();
}
