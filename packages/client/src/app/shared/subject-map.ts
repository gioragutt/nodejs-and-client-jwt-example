import { Subject } from "rxjs/Subject";

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