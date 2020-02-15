import { ObservableInput } from '@ngx-propserve/index';
import { Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import { expectValues } from './test.helpers';

class SingleProperty<T> {
  @ObservableInput<T>('foo') foo$!: Observable<T>;
}

class DoubleProperty<T> {
  @ObservableInput<T>('foo') foo$!: Observable<T>;
  @ObservableInput<T>('bar') bar$!: Observable<T>;
}

test('creates observer property from any', () => {
  const target: { foo$?: Observable<number> } = {};

  const observeHandler = ObservableInput('foo');
  observeHandler(target, 'foo$');

  expect(target.foo$).toBeDefined();
  expect(target.foo$ instanceof Observable).toEqual(true);
});

test('deletes existing input key', () => {
  const target: { foo$?: Observable<number>; foo: number } = { foo: 0 };

  const observeHandler = ObservableInput('foo');
  observeHandler(target, 'foo$');

  const fooDescriptor = Object.getOwnPropertyDescriptor(target, 'foo');
  expect(fooDescriptor && fooDescriptor.set).toBeDefined();
});

test('creates observer property from class', () => {
  const target = new SingleProperty<number>();

  expect(target.foo$).toBeDefined();
  expect(target.foo$ instanceof Observable).toEqual(true);
});

test('notifies single change', (done) => {
  const target = new SingleProperty<number>();

  (target as any)['foo'] = 2;

  expectValues(target.foo$, [2], done);
});

test('notifies multiple change', (done) => {
  const target = new DoubleProperty<number>();

  (target as any).foo = 2;
  (target as any).bar = 3;

  const combination$ = combineLatest(target.foo$, target.bar$).pipe(
    first()
  );

  expectValues(combination$, [[2, 3]], done);
});

test('doesn\'t notify values from another instance', (done) => {
  const someInstance = new SingleProperty();
  const someOtherInstance = new SingleProperty();

  expectValues(someOtherInstance.foo$, [undefined, 1], done);

  (someInstance as any).foo = 2;
  (someOtherInstance as any).foo = 1;
});
