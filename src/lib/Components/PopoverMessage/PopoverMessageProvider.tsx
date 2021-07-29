import React, { useCallback, useMemo, useState } from "react"
import { PopoverMessage, PopoverMessageOptions, PopoverMessagePlacement, PopoverMessageProps } from "./PopoverMessage"

interface PopoverMessageContextContextValue {
  show: (options: PopoverMessageOptions) => void
  hide: (id: string) => void
}

// tslint:disable-next-line:no-empty
export const PopoverMessageContext = React.createContext<PopoverMessageContextContextValue>({ show: () => {}, hide: () => {} })

const filterPopoverMessagesByPosition = (
  popoverMessages: Array<Omit<PopoverMessageProps, "positionIndex">>,
  placement: PopoverMessagePlacement
): PopoverMessageProps[] => {
  const filteredByPlacement = popoverMessages.filter((t) => t.placement === placement)
  const formatted = filteredByPlacement.map((popoverMessage, positionIndex) => ({
    ...popoverMessage,
    positionIndex,
  }))

  return formatted
}

export const PopoverMessageProvider: React.FC = ({ children }) => {
  const [popoverMessages, setPopoverMessages] = useState<Array<Omit<PopoverMessageProps, "positionIndex">>>([])

  const show: PopoverMessageContextContextValue["show"] = useCallback(
    (options) => {
      setPopoverMessages((prevPopoverMessage) => [...prevPopoverMessage, { id: `${Date.now()}`, ...options }])
    },
    [setPopoverMessages]
  )

  const hide: PopoverMessageContextContextValue["hide"] = useCallback(
    (id) => {
      setPopoverMessages((prevPopoverMessage) => prevPopoverMessage.filter((t) => t.id !== id))
    },
    [setPopoverMessages]
  )

  const topPopoverMessages = useMemo(() => filterPopoverMessagesByPosition(popoverMessages, "top"), [popoverMessages])
  const bottomPopoverMessages = useMemo(() => filterPopoverMessagesByPosition(popoverMessages, "bottom"), [
    popoverMessages,
  ])

  return (
    <PopoverMessageContext.Provider value={{ show, hide }}>
      {children}
      {[...topPopoverMessages, ...bottomPopoverMessages].map((popoverMessageProps) => (
        <PopoverMessage key={popoverMessageProps.id} {...popoverMessageProps} />
      ))}
    </PopoverMessageContext.Provider>
  )
}
