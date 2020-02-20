import { useEffect, useMemo, useRef, useState } from "react"

function useForceUpdate() {
  const setEpoch = useState(0)[1]
  const isMounted = useRef(false)
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  })
  return useMemo(() => () => isMounted.current && setEpoch(x => x + 1), [])
}

/**
 * For rationale on why this exists
 * https://github.com/artsy/emission/pull/1900
 */
export class GlobalState<T> {
  private listeners: Array<() => void> = []
  constructor(private _current: T) {}

  get current() {
    return this._current
  }

  useUpdates() {
    const forceUpdate = useForceUpdate()
    useEffect(() => {
      this.listeners.push(forceUpdate)
      return () => {
        this.listeners = this.listeners.filter(l => l !== forceUpdate)
      }
    }, [])
  }

  private set(next: T) {
    if (next !== this._current) {
      this._current = next
      for (const l of this.listeners) {
        l()
      }
    }
  }
}

export function useGlobalState<T>(init: T): [GlobalState<T>, (t: T) => void] {
  const state = useMemo(() => new GlobalState(init), [])

  return [
    state,
    useMemo(
      () => val => {
        // @ts-ignore
        state.set(val)
      },
      []
    ),
  ]
}
