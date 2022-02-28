import { CheckCircleIcon, ChevronIcon, Collapse, Flex, Text, Touchable } from "palette"
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { LayoutAnimation, View } from "react-native"

interface CollapsableMenuItemProps {
  overtitle?: string
  title: string
  isExpanded?: boolean
  disabled?: boolean
  onExpand?: () => void
  onCollapse?: () => void
}

export interface CollapsibleMenuItem {
  isExpanded: () => boolean
  collapse: (onAnimationEnd?: () => void) => void
  expand: (onAnimationEnd?: () => void) => void
  completed: () => void
  offsetTop: () => Promise<number>
}

export const CollapsibleMenuItem = forwardRef<
  CollapsibleMenuItem,
  React.PropsWithChildren<CollapsableMenuItemProps>
>(
  (
    { children, overtitle, title, isExpanded = false, disabled = false, onExpand, onCollapse },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const componentRef = useRef<View>(null)

    useEffect(() => {
      setIsOpen(isExpanded)
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        collapse(onAnimationEnd) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, onAnimationEnd)
          setIsOpen(false)
        },
        expand(onAnimationEnd) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, onAnimationEnd)
          setIsOpen(true)
        },
        completed() {
          setIsCompleted(true)
        },
        isExpanded() {
          return isOpen
        },
        offsetTop: () => {
          return new Promise<number>((resolve) => {
            componentRef.current?.measureInWindow((_, h) => {
              resolve(h)
            })
          })
        },
      }),
      [isOpen]
    )

    return (
      <Flex ref={componentRef} collapsable={false}>
        <Touchable
          onPress={() => {
            setIsOpen(!isOpen)
            isOpen ? onCollapse?.() : onExpand?.()
          }}
          disabled={disabled}
        >
          {!!overtitle && (
            <Text variant="sm" color={disabled ? "black30" : "black100"}>
              {overtitle}
            </Text>
          )}
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text
              variant="lg"
              color={disabled ? "black30" : "black100"}
              style={{ maxWidth: "90%" }}
            >
              {title}
            </Text>
            <Flex flexDirection="row" alignItems="center">
              {!!isCompleted && (
                <CheckCircleIcon
                  fill="green100"
                  height={24}
                  width={24}
                  style={{ marginRight: 5 }}
                />
              )}
              <ChevronIcon
                direction={isOpen ? "up" : "down"}
                fill={disabled ? "black30" : "black60"}
              />
            </Flex>
          </Flex>
        </Touchable>
        <Collapse isOpen={isOpen}>{children}</Collapse>
      </Flex>
    )
  }
)
