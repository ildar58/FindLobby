import {UniBooleanHandler} from '../types/handler.type';
import {uniAssert} from '../classes/assert.class';

/**
 * Decorator for checking input values for undefined. You can also pass
 * optional assertion to check input against.
 *
 * CAUTION: This decorator overwrites other getters and setters.
 */
export function uniDefaultProp<T extends object, K extends keyof T>(
    assertion?: UniBooleanHandler<T[K]>,
    ...args: any[]
): PropertyDecorator {
    return (target, key) => {
        const {name} = target.constructor;
        const errorGetDefaultMessage = errorGetDefault(key, name);
        const errorSetDefaultMessage = errorSetDefault(key, name);

        Object.defineProperty(target, key, {
            get(): undefined {
                uniAssert.assert(false, errorGetDefaultMessage);

                return undefined;
            },
            set(this: T, initialValue: T[K]) {
                const isValid = initialValue !== undefined;
                const errorMessage = errorSetDefaultInitial(key, name);
                let currentValue = initialValue;

                uniAssert.assert(isValid, errorMessage);

                if (isValid && assertion) {
                    uniAssert.assert(
                        assertion.call(this, initialValue),
                        `${String(key)} in ${name} received:`,
                        initialValue,
                        ...args
                    );
                }

                Object.defineProperty(this, key, {
                    get(): T[K] {
                        return currentValue;
                    },
                    set(this: T, value: T[K]) {
                        const isValid = value !== undefined;
                        const backupValue = initialValue;

                        uniAssert.assert(
                            isValid,
                            errorSetDefaultMessage,
                            String(backupValue)
                        );

                        if (isValid && assertion) {
                            uniAssert.assert(
                                assertion.call(this, value),
                                `${String(key)} in ${name} received:`,
                                value,
                                ...args
                            );
                        }

                        currentValue = isValid ? value : backupValue;
                    },
                });
            },
        });
    };
}

function errorGetDefault(key: string | symbol, component: string): string {
    return `Default value for ${String(
        key
    )} was not provided in ${component}, error in Taiga UI Angular Kit`;
}

function errorSetDefault(key: string | symbol, component: string): string {
    return `Undefined was passed as ${String(
        key
    )} to ${component}, which is invalid input, using default value:`;
}

function errorSetDefaultInitial(
    key: string | symbol,
    component: string
): string {
    return `Undefined was passed as default value for ${String(
        key
    )} to ${component}, error in Taiga UI Angular Kit`;
}
