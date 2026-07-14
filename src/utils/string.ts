export class StringUtils {
    static snakeToCamel(str: string): string {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    static camelToSnake(str: string): string {
        return str.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
}
