import { ObservableInput } from '@ngx-propserve/index';
import { Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

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

  target.foo$.subscribe(value => {
    expect(value).toEqual(2);
    done();
  });
});

test('notifies multiple change', (done) => {
  const target = new DoubleProperty<number>();

  (target as any)['foo'] = 2;
  (target as any)['bar'] = 3;

  combineLatest(target.foo$, target.bar$).pipe(
    first()
  ).subscribe({
    next: ([foo, bar]) => {
      expect(foo).toEqual(2);
      expect(bar).toEqual(3);
      done();
    },
    complete: () => done()
  });
});
