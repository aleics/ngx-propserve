import { Observable } from 'rxjs';
import { AsObservable } from '@ngx-propserve/index';
import { expectValues } from './test.helpers';

class SingleProperty<T> {
  @AsObservable<T>() foo!: Observable<T>;
}

test('initializes property as observable', () => {
  const target = new SingleProperty<number>();

  expect(target.foo).toBeDefined();
  expect(target.foo instanceof Observable).toEqual(true);
});

test('doesn\'t notify values from another instance', (done) => {
  const someInstance = new SingleProperty();
  const someOtherInstance = new SingleProperty();

  expectValues(someOtherInstance.foo, [undefined, 1], done);

  (someInstance as any).foo = 2;
  (someOtherInstance as any).foo = 1;
});