import { useCallback, useEffect, useState } from "react"

type Callback<T> = (data: T) => void
type CallbackEvent<T> = Partial<Array<[string, Callback<T>]>>
interface CallbackData {
  ["key"]?: string
  [key: string]: unknown
}
let eventCallbacks: CallbackEvent<any> = []

/**
 * This hook is responsible for storing tuple of [key, value] where value is a callback
 * stored to run when we receive messages from the WebView
 *
 * For setting the [key, value] use the useSetWebViewCallback hook
 * For calling callback use the useWebViewCallback hook
 * Do not use useWebViewEvent directly
 */
export const useWebViewEvent = () => {
  const [webViewEvent, setWebViewEvent] = useState(eventCallbacks)

  return { webViewEvent, setWebViewEvent }
}

export const useSetWebViewCallback = <T extends object = {}>(
  key: string,
  callbackEvent: Callback<Partial<T>>
) => {
  const { setWebViewEvent } = useWebViewEvent()

  useEffect(() => {
    if (!checkIfKeyExists(key)) {
      eventCallbacks.push([key, callbackEvent])
      setWebViewEvent(eventCallbacks)
    }

    return () => {
      if (checkIfKeyExists(key)) {
        const newEvents = eventCallbacks.filter((evt) => evt?.[0] !== key)
        eventCallbacks = newEvents
        setWebViewEvent(newEvents)
      }
    }
  }, [key])
}

export const useWebViewCallback = () => {
  const { setWebViewEvent, webViewEvent } = useWebViewEvent()

  const callWebViewEventCallback = useCallback(
    (data: CallbackData) => {
      if (!data.key || !eventCallbacks || eventCallbacks.length === 0) {
        return
      }

      const { key, ...rest } = data

      const event = eventCallbacks.filter((evt) => evt?.[0] === data.key)?.[0] ?? null
      if (event && event[1]) {
        event[1](rest)
        const newEvents = eventCallbacks.filter((evt) => evt?.[0] !== data.key)
        eventCallbacks = newEvents
        setWebViewEvent(newEvents)
        console.log("setWebViewEvent", setWebViewEvent)
      }
    },
    [setWebViewEvent]
  )

  return { callWebViewEventCallback, webViewEvent }
}

const checkIfKeyExists = (key: string) => {
  for (const e of eventCallbacks) {
    if (e?.[0] === key) {
      return true
    }
  }

  return false
}
