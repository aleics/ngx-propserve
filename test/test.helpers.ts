import { Observable } from "rxjs";

export function expectValues<T>(observable: Observable<T>, values: T[], done?: () => void): void {
  let i = 0;
  observable.subscribe({
    next: (value) => {
      expect(value).toEqual(values[i]);
      i++;

      if (done && i === values.length) {
        done();
      }
    }
  });
}