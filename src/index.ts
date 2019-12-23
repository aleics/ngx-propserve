import { ReplaySubject } from 'rxjs';
import { Input } from '@angular/core';
import { __decorate } from 'tslib';

/**
 * `@ObservableInput` is a decorator that allows you to define a reactive
 * `@Input` property that subscribes to the changes of an specific input
 * property.
 * @param inputKey key of the input property.
 */
export function ObservableInput<T>(inputKey: string): PropertyDecorator {
  const listener = new ReplaySubject<T>(1);
  return (target: any, key: string | symbol): void => {
    target[key] = listener.asObservable();

    // Define input property with an observer setter
    const set = (value: T): void => {
      listener.next(value);
    };

    Reflect.deleteProperty(target, inputKey);
    Reflect.defineProperty(target, inputKey, { set });

    // Include Input decorator for observed property
    __decorate([Input(inputKey)], target, inputKey, null);
  };
}

/**
 * `@AsObservable` transforms the `@Input` property into an `Observable`
 */
export function AsObservable<T>(): PropertyDecorator {
  const listener = new ReplaySubject<T>(1);

  return (target: any, key: string | symbol): void => {
    const get = () => listener.asObservable();
    const set = (value: T): void => listener.next(value);

    Reflect.defineProperty(target, key, { get, set });
  };
}