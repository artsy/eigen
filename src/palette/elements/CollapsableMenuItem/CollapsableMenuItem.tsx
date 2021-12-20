import { ChevronIcon, Collapse, Flex, Touchable } from "palette"
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"

interface CollapsableMenuItemProps {
  Header: JSX.Element
  isExpanded?: boolean
  disabled?: boolean
  onExpand?: () => void
}

export interface CollapsableMenuItem {
  collapse: () => void
  expand: () => void
}
export const CollapsableMenuItem = forwardRef<CollapsableMenuItem, React.PropsWithChildren<CollapsableMenuItemProps>>(
  ({ children, Header, isExpanded = false, disabled = false, onExpand }, ref) => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
      setIsOpen(isExpanded)
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        collapse() {
          setIsOpen(false)
        },
        expand() {
          setIsOpen(true)
        },
      }),
      []
    )

    return (
      <Flex>
        <Touchable
          onPress={() => {
            setIsOpen(!isOpen)
            if (!isOpen) {
              onExpand?.()
            }
          }}
          disabled={disabled}
        >
          <Flex flexDirection="row" justifyContent="space-between" alignItems="flex-start">
            <Flex maxWidth="90%">{Header}</Flex>
            <Flex justifyContent="center" pt="25">
              <ChevronIcon direction={isOpen ? "up" : "down"} fill={disabled ? "black30" : "black60"} />
            </Flex>
          </Flex>
        </Touchable>
        <Collapse open={isOpen}>{children}</Collapse>
      </Flex>
    )
  }
)
