import { REGEX } from './regex';

export class NumberUtils {
    private number: number;
    private defaultLocale: string = 'es-PE';

    constructor(value: string | number) {
        this.number = Number(value);
    }

    static isValidId(value: number | string) {
        if (typeof value === 'string' && !REGEX.POSITIVE_INT.test(value)) {
            return false;
        }

        const numberUtils = new NumberUtils(value);
        return Number.isInteger(numberUtils.number) && numberUtils.number > 0 && Number.isFinite(numberUtils.number);
    }

    static toCurrency(value: string | number) {
        const numberUtils = new NumberUtils(value);
        const defaultCurrency = 'PEN';

        return numberUtils.number.toLocaleString(numberUtils.defaultLocale, {
            style: 'currency',
            currency: defaultCurrency,
        });
    }
}
