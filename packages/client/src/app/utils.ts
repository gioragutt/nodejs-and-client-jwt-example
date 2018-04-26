import { Subject } from "rxjs/Subject";

export const setStorage = (key: string, value: any) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getStorage = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return null;
  }
};

export class SubjectMap {
  private subjects = new Map<string, Subject<any>>();
  get<T>(key: string): Subject<T> {
    if (!this.has(key)) {
      this.subjects.set(key, new Subject<T>());
    }
    return this.subjects.get(key) as Subject<T>;
  }
  has(key: string): boolean {
    return this.subjects.has(key);
  }
}

// const callCompose = (f, g) => (...args) => f(g(...args))
// export const compose = (...fns) => fns.reduce(callCompose)
// export const pipe = (...fns) => fns.reduceRight(callCompose)

export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
export const pipe = (...fns) => compose.apply(compose, fns.reverse());