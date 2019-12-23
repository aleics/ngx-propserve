import { AsObservable } from '@ngx-propserve/index';
import { Observable } from 'rxjs';

class SingleProperty<T> {
  @AsObservable<T>() foo!: Observable<T>;
}

test('initializes property as observable', () => {
  const target = new SingleProperty<number>();

  expect(target.foo).toBeDefined();
  expect(target.foo instanceof Observable).toEqual(true);
});

test('notifies changes', (done) => {
  const target = new SingleProperty<number>();

  target.foo.subscribe(value => {
    expect(value).toEqual(2);
    done();
  });

  (target as any).foo = 2;
});