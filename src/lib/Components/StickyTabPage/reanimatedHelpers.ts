import { useMemo, useRef, useState } from "react"
import Animated from "react-native-reanimated"

/**
 * returns a stable Animated.Value instance which starts off with the
 * given number. Note that the initialization parameter will be ignored
 * on subsequent renders
 * @param init
 */
export function useAnimatedValue(init: number) {
  return useMemo(() => {
    return new Animated.Value(init)
  }, [])
}

/**
 * returns a function which can asynchronously read the value of some native animated nodes
 * This is useful for values that change frequently on the native side but which you only
 * want to read occasionally on the JS side. It helps you avoid the perf hit of sending change
 * events over the bridge.
 * @param vals the animated vals to make the reader function for
 * @example
 * const scrollOffset = useMemo(() => new Animated.Value(0), [])
 * const readVals = useValueReader({scrollOffset})
 * // later, e.g. in a callback
 * const {scrollOffset} = await readVals()
 * console.log(scrollOffset) // => 632
 */
export function useValueReader<T extends { [k: string]: Animated.Adaptable<number> }>(
  props: T
): () => Promise<{ [k in keyof T]: number }> {
  // this works by running some reanimated code every time an 'epoch' value
  // is incremented. That code calls a callback with the current values
  // to resolve a promise set up for the consumer
  const epochRef = useRef(0)
  const epoch = useAnimatedValue(0)
  const lastEpoch = useAnimatedValue(0)

  const readCallback = useRef<(vals: ReadonlyArray<number>) => void>()

  const keys = useMemo(
    () => {
      return Object.keys(props)
    },
    [props]
  )

  const vals = useMemo(
    () => {
      return keys.map(k => props[k])
    },
    [keys]
  )

  Animated.useCode(
    () =>
      Animated.cond(Animated.neq(epoch, lastEpoch), [
        Animated.set(lastEpoch, epoch),
        Animated.call([...vals], vs => {
          const cb = readCallback.current
          readCallback.current = null
          result.current = null
          cb(
            keys.reduce(
              (acc, k, i) => {
                acc[k] = vs[i]
                return acc
              },
              {} as any
            )
          )
        }),
      ]),
    [vals, keys]
  )

  const result = useRef<Promise<any>>()

  return () => {
    if (!result.current) {
      result.current = new Promise(resolve => {
        readCallback.current = resolve
        epochRef.current += 1
        epoch.setValue(epochRef.current)
      })
    }
    return result.current
  }
}

export function useNativeValue(node: Animated.Node<number>, init: number): number {
  const [state, setState] = useState(init)
  Animated.useCode(() => Animated.call([node], ([val]) => setState(val)), [])
  return state
}
