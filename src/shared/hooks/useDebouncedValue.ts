import { debounce } from "lodash"
import { useCallback, useEffect, useState } from "react"

interface UseDebounce {
  delay?: number
  callback: (...args: any[]) => void
}

export const useDebounce = ({ callback, delay = 200 }: UseDebounce) => {
  return useCallback(debounce(callback, delay), [callback, delay])
}

interface UseDebouncedValue<T> {
  value: T
  delay?: number
}

export const useDebouncedValue = <T>({ value, delay = 200 }: UseDebouncedValue<T>) => {
  const [debouncedValue, setValue] = useState(value)
  const debouncedSetValue = useDebounce({ callback: setValue, delay })

  useEffect(() => {
    debouncedSetValue(value)
  }, [debouncedSetValue, value])

  return { debouncedValue }
}
