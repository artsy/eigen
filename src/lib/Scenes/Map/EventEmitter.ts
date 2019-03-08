type Callback = (data: any) => void

type Event = "map:change" | "filters:change"

// tslint:disable-next-line:class-name
class _EventEmitter {
  private _events = new Map<Event, Callback[]>()

  dispatch(event: Event, data: any) {
    if (!this._events.has(event)) {
      console.warn(`There are currently no subscribers for the event: ${event}`)
      return
    }
    this._events.get(event).forEach(callback => callback(data))
  }

  subscribe(event: Event, callback: Callback) {
    if (!this._events.has(event)) {
      this._events.set(event, [])
    }
    this._events.get(event).push(callback)
  }

  /**
   * The callback is expected to be exact same instance used to subscribe. I.e. do not lazily bind the callback to a
   * component instance.
   */
  unsubscribe(event: Event, callback: Callback) {
    const subscriptions = this._events.get(event)
    const index = subscriptions && subscriptions.indexOf(callback)
    if (!subscriptions || index === -1) {
      throw new Error(
        "A subscription with the given callback does not exist, be sure to pass the exact same callback instance " +
          "that was used to subscribe."
      )
    }
    subscriptions.splice(index, 1)
  }
}

export const EventEmitter = new _EventEmitter()
