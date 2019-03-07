export const EventEmitter = {
  _events: {},
  dispatch(event, data) {
    if (!this._events[event]) {
      return
    } // no one is listening to this event
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this._events[event].length; i++) {
      setTimeout(() => {
        console.log("Dispatch ")
        this._events[event][i](data)
      }, 100)
    }
  },
  subscribe(event, callback) {
    if (!this._events[event]) {
      this._events[event] = []
    } // new event
    this._events[event].push(callback)
  },
  // note that we do not handle unsubscribe here
}
