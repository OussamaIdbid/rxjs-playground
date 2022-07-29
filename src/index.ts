import { Observable } from "rxjs";

const observable$ = new Observable((subscriber) => {
  let count = 0;
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
