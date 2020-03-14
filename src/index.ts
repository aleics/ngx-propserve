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

    const getSubject = (instance: any): BehaviorSubject<T | undefined> | undefined => {
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
 * `@AsObservable` is a decorator that mutates an `@Input` property to behave
 * as an `Observable`.
 *
 * @example
 *
 * @Component({
 *   selector: 'some-component',
 *   template: '<span>{{ foo$ | async }}</span>'
 * })
 * export class SomeComponent {
 *   @Input('foo') @AsObservable() foo$: number;
 * }
 */
export function AsObservable<T>(): PropertyDecorator {
  return (target: any, key: string | symbol): void => {
    const subjects = new WeakMap<any, BehaviorSubject<T | undefined>>();

    const getSubject = (instance: any): BehaviorSubject<T | undefined> | undefined => {
      if (!subjects.has(instance)) {
        subjects.set(instance, new BehaviorSubject<T | undefined>(undefined))
      }
      return subjects.get(instance);
    };

    Object.defineProperty(target, key, {
      get(): Observable<T | undefined> | undefined {
        return getSubject(this);
      },
      set(instanceNewValue: T) {
        getSubject(this)?.next(instanceNewValue);
      }
    });
  };
}

/**
 * `@Observe` is a decorator that allows to subscribe to the stream of changes
 * of another property. It can be used for `@Input` properties, but not necessarily.
 *
 * @param observedKey Key of the property to observe.
 *
 * @example
 *
 * @Component({
 *   selector: 'some-component',
 *   template: '<span>{{ foo$ | async }}</span>'
 * })
 * export class SomeComponent {
 *   @Input() foo: number;
 *   @Observe('foo') foo$: Observable<number>;
 * }
 */
export function Observe<T>(observedKey: string): PropertyDecorator {
  return (target: any, key: string | symbol): void => {
    const subjects = new WeakMap<any, BehaviorSubject<T | undefined>>();

    const getSubject = (instance: any): BehaviorSubject<T | undefined> | undefined => {
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

    Object.defineProperty(target, observedKey, {
      get(): T | undefined {
        return getSubject(this)?.getValue();
      },
      set(instanceNewValue: T): void {
        getSubject(this)?.next(instanceNewValue);
      }
    });
  };
}