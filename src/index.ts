import { Observable, from, of } from "rxjs";
import callApi from "./helpers/callApi";

// observables, observers & subscriptions
const exercise_1 = (): void => {
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
};

// Cold observables
const exercise_2 = () => {
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
};

// hot observables
const exercise_3 = () => {
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
};

// of
const exercise_4 = () => {
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
};
// from
const exercise_5 = () => {
    
};
const exerciseList = [
  //exercise_1,
  //exercise_2,
  //exercise_3,
  //exercise_4,
  exercise_5,
];

exerciseList.forEach((exercise) => exercise());
