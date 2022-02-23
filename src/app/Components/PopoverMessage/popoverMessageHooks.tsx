import { useContext, useMemo } from "react"
import { PopoverMessageContext } from "./PopoverMessageProvider"

const usePopoverMessageContext = () => useContext(PopoverMessageContext)

export const usePopoverMessage = () => {
  const contextValue = usePopoverMessageContext()

  return useMemo(
    () => ({
      show: contextValue.show,
      hide: contextValue.hide,
    }),
    [contextValue]
  )
}
