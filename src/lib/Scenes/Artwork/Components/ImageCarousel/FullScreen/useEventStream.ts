import { EventEmitter } from "events"
import { useCallback, useEffect, useMemo } from "react"

export interface EventStream<T> {
  dispatch: (event: T) => void
  __internal_emitter: EventEmitter
}

export function useEventStream<T>(): EventStream<T> {
  const emitter = useMemo(() => new EventEmitter(), [])
  const dispatch = useCallback((t: T) => emitter.emit("event", t), [])
  return { dispatch, __internal_emitter: emitter } as any
}

export function useEvents<T>(stream: EventStream<T>, listener: (event: T) => any) {
  useEffect(() => {
    ;(stream.__internal_emitter as EventEmitter).addListener("event", listener)
    return () => {
      ;(stream.__internal_emitter as EventEmitter).removeListener("event", listener)
    }
  })
}
