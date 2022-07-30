import { Observable, from, of, fromEvent, timer } from "rxjs";
import callApi from "./helpers/callApi";

// observables, observers & subscriptions
export function exercise_1(): void {
  const observable$ = new Observable<number>((subscriber) => {
    let count: number = 0;
    const interval = setInterval(() => {
      console.log("emitted val", count);

      subscriber.next(count++);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  });

  const observer = observable$.subscribe({
    next: (val) => console.log(val),
  });

  setTimeout(() => observer.unsubscribe(), 7000);
}

// Cold observables
export function exercise_2() {
  const randName$ = callApi("/name/random_name", "GET");

  randName$.subscribe((next) =>
    console.log("Sub 2:", next.response.first_name)
  );

  randName$.subscribe((next) =>
    console.log("Sub 3:", next.response.first_name)
  );

  randName$.subscribe((next) =>
    console.log("Sub 4:", next.response.first_name)
  );
}

// hot observables
export function exercise_3() {
  const button = document.querySelector("button#hello");

  const click$ = new Observable<MouseEvent>((subscriber) => {
    button.addEventListener("click", (e: MouseEvent) => subscriber.next(e));
  });

  click$.subscribe((event) => console.log("Sub 1: ", event));

  setTimeout(
    () =>
      click$.subscribe((event) =>
        console.log("Sub 2: ", event.type, event.x, event.y)
      ),
    5000
  );
}

// of
export function exercise_4() {
  const ourOwnOf = (...args: any) => {
    return new Observable((subscriber) => {
      args.forEach((arg: any) => subscriber.next(arg));
      subscriber.complete();
    });
  };

  ourOwnOf(1, 2, 3).subscribe({
    next: (next) => console.log(next),
    complete: () => console.log("complete"),
  });
}
// from array
export function exercise_5() {
  from([1, 2, 3, 4, 5]).subscribe({
    next: (val) => console.log(val),
    complete: () => console.log("complete"),
  });
}
// from promise
export function exercise_6() {
  const somePromise = new Promise((resolve, reject) => reject("rejected"));

  const observableFromPromise$ = from(somePromise);

  observableFromPromise$.subscribe({
    next: (val) => console.log(val),
    error: (err) => console.log(err),

    complete: () => console.log("completed"),
  });
}

// fromEvent
export function exercise_7() {
  const button = document.querySelector("button#hello");

  fromEvent(button, "click").subscribe({
    next: (val: MouseEvent) => console.log(val.type, val.x, val.y),
  });
}

// fromEvent using new Observable
export function exercise_8() {
  const button = document.querySelector("button#hello");

  const trigger$ = new Observable((subscriber) => {
    const handleButtonClick = (event: MouseEvent) => subscriber.next(event);

    button.addEventListener("click", handleButtonClick);

    return () => {
      button.removeEventListener("click", handleButtonClick);
    };
  });

  const subscription = trigger$.subscribe((event) => console.log(event));

  setTimeout(() => subscription.unsubscribe(), 5000);
}

// timer
export function exercise_9() {
  timer(2000).subscribe({
    next: (val) => console.log(val),
    complete: () => console.log("completed"),
  });
}
