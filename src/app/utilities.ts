import { Agent, Task } from './fake-api';

// == Helper utilities ==
let currentId = 1;
/** Returns a new unique ID at every invocation. */
export function nextId() {
    return currentId++;
}
/** Returns a random number between min and max. */
export function randomBetween(min: number, max: number): number {
    const rand = Math.random();
    const span = max - min;
    return rand * span + min;
}
/** Returns true a random percentage of invocations. */
export function randomCondition(percentageTrue: number): boolean {
    const rand = Math.random();
    return rand < percentageTrue;
}
const MIN_LATENCY_MS = 100;
const MAX_LATENCY_MS = 3000;
const FAILURE_RATE = 0.05; /* 5% API calls fail */
/**
* Returns the data as a Promise, delayed by a random latency and
* occasionally failing with an error.
* */
export function asFallibleAsyncResponse<T>(data: T): Promise<T> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
      if (randomCondition(FAILURE_RATE)) {
        reject(new Error('API Error - database unavailable.'));
      } else {
        resolve(data);
      }
      }, randomBetween(MIN_LATENCY_MS, MAX_LATENCY_MS));
    });
    
    return Promise.resolve(data);
}


// Result by type function (ex. category, name etc.)
// ----------------------------------------------------------------------------

export function resultByType(tasks: Task[], type: string = 'category') {
    return tasks.reduce((r, o) => {
      if (r[o[type]] || (r[o[type]]=[])) r[o[type]].push(o);
      return r;
    }, {});
}

// Average function
// ----------------------------------------------------------------------------

export function averageScores(args: {avg, n}, item: Task) {
    return {
        avg: (item.score + args.n * args.avg) / (args.n + 1),
        n:   args.n + 1,
    };
}

