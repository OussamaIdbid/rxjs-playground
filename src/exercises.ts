import {
  Observable,
  from,
  of,
  fromEvent,
  timer,
  interval,
  forkJoin,
  combineLatest,
  filter,
  map,
} from "rxjs";
import callApi from "./helpers/callApi";

/**
 * * Observables
 */

// observables, observers & subscriptions
const exercise_1 = () => {
  const observable$ = new Observable<number>((subscriber) => {
    let count: number = 0;
    const interv = setInterval(() => {
      console.log("emitted val", count);

      subscriber.next(count++);
    }, 2000);

    return () => {
      clearInterval(interv);
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
/**
 * * Creation functions
 */

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
// from array
const exercise_5 = () => {
  from([1, 2, 3, 4, 5]).subscribe({
    next: (val) => console.log(val),
    complete: () => console.log("complete"),
  });
};
// from promise
const exercise_6 = () => {
  const somePromise = new Promise((resolve, reject) => reject("rejected"));

  const observableFromPromise$ = from(somePromise);

  observableFromPromise$.subscribe({
    next: (val) => console.log(val),
    error: (err) => console.log(err),

    complete: () => console.log("completed"),
  });
};

// fromEvent
const exercise_7 = () => {
  const button = document.querySelector("button#hello");

  fromEvent(button, "click").subscribe({
    next: (val: MouseEvent) => console.log(val.type, val.x, val.y),
  });
};

// recreate fromEvent with custom logic
const exercise_8 = () => {
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
};

// timer
const exercise_9 = () => {
  const subscription = timer(2000).subscribe({
    next: (val) => console.log(val),
    complete: () => console.log("completed"),
  });

  setTimeout(() => {
    subscription.unsubscribe();
  }, 1000);
};

// recrerate timer with custom logic
const exercise_10 = () => {
  const timer$ = new Observable<number>((subscriber) => {
    const timeout = setTimeout(() => {
      console.log("Timeout");

      subscriber.next(0);
      subscriber.complete();
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  });

  const subscription = timer$.subscribe({
    next: (val) => console.log(val),
    complete: () => console.log("complete"),
  });

  setTimeout(() => {
    subscription.unsubscribe();
    console.log("unsubscribing");
  }, 1000);
};

// interval
const exercise_11 = () => {
  const intervalSubscription = interval(1000).subscribe({
    next: (val) => console.log(val),
    complete: () => console.log("completed"),
  });

  timer(3000).subscribe({
    next: () => intervalSubscription.unsubscribe(),
  });
};

// forkJoin
const exercise_12 = () => {
  const randomName$ = callApi("/name/random_name", "GET");

  const randomNation$ = callApi("/nation/random_nation", "GET");

  const randomFood$ = callApi("/food/random_food", "GET");

  forkJoin([randomName$, randomNation$, randomFood$]).subscribe(
    ([
      {
        response: { first_name },
      },
      {
        response: { capital },
      },
      {
        response: { dish },
      },
    ]) =>
      console.log(`${first_name} is from ${capital} and likes to eat ${dish}`)
  );
};
// forkJoin error
const exercise_13 = () => {
  const a$ = new Observable((subscriber) => {
    setTimeout(() => {
      subscriber.next("A");
      subscriber.complete();
    }, 5000);

    return () => {
      console.log("A teardown");
    };
  });

  const b$ = new Observable((subscriber) => {
    setTimeout(() => {
      subscriber.error("failed");
    }, 3000);

    return () => {
      console.log("B teardown");
    };
  });

  forkJoin([a$, b$]).subscribe({
    next: (o) => console.log(o),
    error: (err) => console.log(err),
  });
};
//combineLatest
const exercise_14 = () => {
  const convertTemperature = (temperature: string, conversionType: string) => {
    switch (conversionType) {
      case "f-to-c": {
        return (parseInt(temperature) - 32) * 0.5556;
      }
      case "c-to-f": {
        return parseInt(temperature) * 1.8 + 32;
      }
    }
  };
  const temperatureInput = document.getElementById("temperature-input");
  const conversionDropdown = document.getElementById("conversion-dropdown");
  const resultText = document.getElementById("result-text");

  const temp$ = fromEvent(temperatureInput, "input");
  const conversion$ = fromEvent(conversionDropdown, "change");

  combineLatest<any>([temp$, conversion$]).subscribe({
    next: ([input, dropdown]) => {
      const convertedTemp = convertTemperature(
        input.target.value,
        dropdown.target.value
      );

      resultText.innerHTML = String(convertedTemp);
    },
  });
};

/**
 * * Pipeable operators
 */
// filter
const exercise_15 = () => {
  type Article = {
    name: number;
    type: string;
  };

  const newsArticles = [
    {
      name: 1,
      type: "sports",
    },
    {
      name: 2,
      type: "clothing",
    },
    {
      name: 3,
      type: "clothing",
    },
    {
      name: 4,
      type: "sports",
    },
    {
      name: 5,
      type: "sports",
    },
    {
      name: 6,
      type: "sports",
    },
  ];

  const newsArticles$ = from(newsArticles);

  const sportsArticles = newsArticles$.pipe(
    filter((article: Article) => article.type === "sports")
  );

  sportsArticles.subscribe((article) => console.log(article));
};

// map
const exercise_16 = () => {
  const randomName$ = callApi("/name/random_name", "GET");

  const randomNation$ = callApi("/nation/random_nation", "GET");

  const randomFood$ = callApi("/food/random_food", "GET");

  forkJoin([randomName$, randomNation$, randomFood$])
    .pipe(
      map(
        ([nameResponse, nationResponse, foodResponse]) =>
          `${nameResponse.response.first_name} is from ${nationResponse.response.capital} and likes to eat ${foodResponse.response.dish}`
      )
    )
    .subscribe((result) => console.log(result));
};

// tap
const exercise_17 = () => {};

export default [
  exercise_1,
  exercise_2,
  exercise_3,
  exercise_4,
  exercise_5,
  exercise_6,
  exercise_7,
  exercise_8,
  exercise_9,
  exercise_10,
  exercise_11,
  exercise_12,
  exercise_13,
  exercise_14,
  exercise_15,
  exercise_16,
  exercise_17,
];
