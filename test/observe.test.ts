import { Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Observe } from '@ngx-propserve/index';
import { expectValues } from './test.helpers';

class SingleProperty {
  @Input() foo!: number;
  @Observe('foo') foo$!: Observable<number>;
}

test('initializes property as observable', () => {
  const target = new SingleProperty();

  expect(target.foo$ instanceof Observable).toEqual(true);
});

test('notifies changes', (done) => {
  const target = new SingleProperty();
  expectValues(target.foo$, [undefined, 2], done);

  target.foo = 2;
});

test('doesn\'t notify values from another instance', (done) => {
  const someInstance = new SingleProperty();
  const someOtherInstance = new SingleProperty();

  expectValues(someOtherInstance.foo$, [undefined, 1], done);

  someInstance.foo = 2;
  someOtherInstance.foo = 1;
});
