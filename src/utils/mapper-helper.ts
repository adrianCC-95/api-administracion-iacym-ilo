export class MapperHelper {
    static require<T>(value: T | null | undefined, field: string): T {
        if (!value) {
            throw new Error(`${field} relation was not loaded.`);
        }

        return value;
    }
}
