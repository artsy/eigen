/**
 * A lightweight observable implementation.
 * Supports multiple subscribers and basic pub-sub pattern.
 */
export class SimpleObservable<T> {
  private subscribers: Array<{ next: (value: T) => void }> = []

  /**
   * Subscribe to the observable with an observer
   */
  subscribe(observer: { next: (value: T) => void }) {
    this.subscribers.push(observer)

    // Return unsubscribe function
    return {
      unsubscribe: () => {
        const index = this.subscribers.indexOf(observer)
        if (index > -1) {
          this.subscribers.splice(index, 1)
        }
      },
    }
  }

  /**
   * Emit a value to all subscribers
   */
  next(value: T) {
    this.subscribers.forEach((observer) => observer.next(value))
  }
}
