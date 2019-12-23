# ngx-propserve
**ngx-propserve** let's you subscribe to changes of Angular's [`@Input`](https://angular.io/api/core/Input) properties.

## Usage
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

This example defines an `@ObservableInput` called `foo$` that subscribes to the changes of an `@Input` named `foo`. The property `foo` is created automatically in the `@ObserableInput` decorator. Thus, no additional work is needed and the `TestComponent` can be used as follows:

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
    map(([price, name]) => `${name} costs {price}`)
  )
}
```
