import { BehaviorSubject, Observable } from 'rxjs';
import { Input } from '@angular/core';
import { __decorate } from 'tslib';

/**
 * `@ObservableInput` is a decorator that allows you to define a reactive
 * `@Input` property that subscribes to the changes of an specific input
 * property.
 *
 * Disclaimer: This won't work out-of-the-box when using AOT compilation. For
 * enabling it define `NO_ERRORS_SCHEMA` as schema in your module.
 *
 * @example
 *
 * @Component({
 *   selector: 'some-component',
 *   template: '<span>{{ foo$ | async }}</span>'
 * })
 * export class SomeComponent {
 *   @ObservableInput('foo') foo$: number;
 * }
 */
export function ObservableInput<T>(inputKey: string): PropertyDecorator {
  return (target: any, key: string | symbol): void => {
    const subjects = new WeakMap<any, BehaviorSubject<T | undefined>>();

    const getSubject = (instance: any) => {
      if (!subjects.has(instance)) {
        subjects.set(instance, new BehaviorSubject<T | undefined>(undefined))
      }
      return subjects.get(instance);
    };

    Object.defineProperty(target, key, {
      get(): Observable<T | undefined> | undefined {
        return getSubject(this);
      }
    });

    // Define input property with an observer setter
    Object.defineProperty(target, inputKey, {
      set(value: T) {
        getSubject(this)?.next(value);
      }
    });

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