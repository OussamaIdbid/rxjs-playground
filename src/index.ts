import { Observable, Subscriber } from "rxjs";

const observable$ = new Observable<string>((subscriber) => {
  subscriber.next("bruhmoment");
  subscriber.next("maainn you done f'ed up");
  subscriber.next("me oh my what do we have here");
});

const observer = {
  next: (val: string) => console.log(val),
  err: (err: string) => console.log(err),
};

const observer1 = {
  next: (val: string) => console.log("look at these values bruh", val),
};

const subscription = observable$.subscribe(observer);
const subscription1 = observable$.subscribe(observer1);

setTimeout(() => subscription.unsubscribe(), 3000);
