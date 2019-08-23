import { EventEmitter } from "events"
import { useCallback, useEffect, useMemo } from "react"

/**
 * Simple hooks wrapper for EventEmitter
 */
export interface EventStream<T> {
  dispatch: (event: T) => void
  __internal_emitter: EventEmitter
}

/**
 * Creates a new  event stream with a stable reference
 */
export function useNewEventStream<T>(): EventStream<T> {
  const emitter = useMemo(() => new EventEmitter(), [])
  const dispatch = useCallback((t: T) => emitter.emit("event", t), [])
  return { dispatch, __internal_emitter: emitter } as any
}

/**
 * Calls `listener` on events from `stream` while the component is mounted.
 * @param stream
 * @param listener
 */
export function useEvents<T>(stream: EventStream<T>, listener: (event: T) => any) {
  useEffect(
    () => {
      stream.__internal_emitter.addListener("event", listener)
      return () => {
        stream.__internal_emitter.removeListener("event", listener)
      }
    },
    [listener]
  )
}
