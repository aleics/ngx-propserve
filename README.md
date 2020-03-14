[![npm version](https://badge.fury.io/js/ngx-propserve.svg)](https://badge.fury.io/js/ngx-propserve)

# ngx-propserve
**ngx-propserve** let's you subscribe to changes of Angular's [`@Input`](https://angular.io/api/core/Input) properties.

## Usage
### ObservableInput
Using the `@ObservableInput` decorator, you can define a `@Input` property that works as an [`Observable`](https://rxjs.dev/guide/observable) and informs you automatically about its changes.

```ts
@Component({
  selector: 'app-test',
  template: `
    <ng-container *ngIf="foo$ | async as result">
      {{ result * 2 }}
    </ng-container>
  `
})
class TestComponent {
  @ObservableInput<number>('foo') foo$!: Observable<number>;
}
```

This example defines an `@ObservableInput` called `foo$` that subscribes to the changes of an `@Input` named `foo`. The property `foo` is created automatically in the `@ObservableInput` decorator. Thus, no additional work is needed and the `TestComponent` can be used as follows:

```html
<app-test [foo]="2"></app-test>
```

**ngx-propserve** enables the developer to follow the so called [*SIP Principle*](https://blog.strongbrew.io/the-sip-principle/), without having to re-define additional logic for the input source streams of the component. Using `@ObservableInput` for source streams, the intermediate and presentation streams can be easily mapped. For instance:

```ts
@Component({
  selector: 'app-test',
  template: `
    <span *ngIf="name$ | async as name">{{ name }}: </span>
    <span *ngIf="message$ | async as message">{{ message }}</span>
  `
})
class TestComponent {
  @ObservableInput<number>('price') price$!: Observable<number>;
  @ObservableInput<string>('name') name$!: Observable<string>;

  message$ = combineLatest(this.price$, this.name$).pipe(
    map(([price, name]) => `${name} costs ${price}`)
  )
}
```

`@ObservableInput` doesn't compile out-of-the-box when using the AOT compiler, since the creation of the `@Input` decorator is done implicitly. You could define your module schema as [`NO_ERRORS_SCHEMA`](https://angular.io/api/core/NO_ERRORS_SCHEMA) and it will ignore the
input binding errors.

### AsObservable
**ngx-propserve** includes the `@AsObservable` decorator that can transform existing properties of a class into an `Observable` listener. For instance:

```ts
@Component({
  selector: 'app-test',
  template: `
    <span *ngIf="name$ | async as name">{{ name }}: </span>
    <span *ngIf="message$ | async as message">{{ message }}</span>
  `
})
class TestComponent {
  @Input('price') @AsObservable() price$!: Observable<number>;
  @Input('name') @AsObservable() name$!: Observable<string>;

  message$ = combineLatest(this.price$, this.name$).pipe(
    map(([price, name]) => `${name} costs ${price}`)
  )
}
```

The `@AsObservable` decorator works together with `@Input` to provide an input property behaving as an `Observable`.

Using `@AsObservable` compiles when using the AOT compiler and has been inspired by [ngx-observable-input](https://github.com/Futhark/ngx-observable-input).

### Observe
**ngx-propserve** includes also the `@Observe` decorator that allows to subscribe to the stream of changes of another property. It can be used for `@Input` properties, but not necessarily. For instance:

```ts
@Component({
  selector: 'app-test',
  template: `
    <span *ngIf="message$ | async as message">{{ message }}</span>
  `
})
class TestComponent {
  @Input('price') price: number;
  @Observe('price') price$!: Observable<number>;

  message$ = this.price$.pipe(
    map((price]) => `This costs ${price}`)
  )
}
```

The `@Observe` decorator separates explicitly the input and the observing mechanisms, and so, it has a more transparent functionality.