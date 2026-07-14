export const isObject = (value: any): boolean => {
    return value && typeof value === 'object' && !Array.isArray(value);
};

export const isArray = (value: any): boolean => {
    return Array.isArray(value);
};

export const isEmpty = (value: any): boolean => {
    if (value === undefined || value === null) return true;

    if (isArray(value)) {
        return value?.length === 0;
    }

    if (isObject(value)) {
        return Object.keys(value)?.length === 0;
    }

    return value?.length === 0;
};
