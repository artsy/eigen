import { useCallback, useState } from "react"
import useAppState from "./useAppState"

export const useIsForeground = (): boolean => {
  const [isForeground, setIsForeground] = useState(true)

  const onForeground = useCallback(() => {
    setIsForeground(true)
  }, [])

  const onBackground = useCallback(() => {
    setIsForeground(false)
  }, [])

  useAppState({
    onForeground,
    onBackground,
  })

  return isForeground
}
