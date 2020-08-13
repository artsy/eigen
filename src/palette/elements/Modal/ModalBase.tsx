import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { RemoveScroll } from "react-remove-scroll"
import styled from "styled-components"
import { zIndex as systemZIndex, ZIndexProps } from "styled-system"
import { useCursor } from "use-cursor"
import { Flex, FlexProps } from "../Flex"

// TODO: Update TypeScript definitions for this library
// https://github.com/theKashey/react-remove-scroll
const ScrollIsolation = styled(RemoveScroll as any)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled(Flex)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  ${systemZIndex}
`

const Dialog = styled(Flex).attrs({ role: "dialog" })`
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  > * {
    max-height: 100%;
  }
`

/**
 * BaseModal
 */
export type ModalBaseProps = FlexProps &
  ZIndexProps & {
    children?: React.ReactNode
    dialogProps?: FlexProps
    onClose?(): void
  }

/**
 * It seems we've landed on this value as the 'top'
 */
export const DEFAULT_MODAL_Z_INDEX = 9999

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  '[tabindex="0"]',
].join(", ")

/**
 * BaseModal
 * Low-level modal that has no opinions about layout/overlay
 * Modals content using a portal, locks scroll.
 */
export const ModalBase: React.FC<ModalBaseProps> = ({
  children,
  zIndex = DEFAULT_MODAL_Z_INDEX,
  dialogProps = {},
  onClose = () => null,
  ...rest
}) => {
  const appendEl = useRef(document.createElement("div"))
  const containerEl = useRef<HTMLDivElement | null>(null)
  const scrollIsolationEl = useRef<HTMLDivElement | null>(null)

  const [focusableEls, setFocusableEls] = useState<HTMLElement[]>([])
  const { index: focusableIndex, handlePrev, handleNext } = useCursor({
    max: focusableEls.length,
  })

  useEffect(() => {
    if (!focusableEls.length) return
    focusableEls[focusableIndex].focus()
  }, [focusableEls, focusableIndex])

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === scrollIsolationEl.current) {
      onClose()
    }
  }

  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        // Prevent <esc> from interfering with the returned focus
        event.preventDefault()
        event.stopPropagation()

        // Handle close
        return onClose()

      case "Tab":
        // Lock focus within modal
        event.preventDefault()
        event.stopPropagation()

        // Move focus up or down
        event.shiftKey ? handlePrev() : handleNext()
        break
      default:
        break
    }
  }

  useEffect(() => {
    const { current } = appendEl

    const focusedElBeforeOpen = document.activeElement as HTMLElement

    // Append the dialog
    document.body.appendChild(current)

    // Gets the focusable elements
    const _focusableEls = Array.from(
      containerEl.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    )
    setFocusableEls(_focusableEls)

    // Switches focus to the first focusable element
    _focusableEls.length && _focusableEls[0].focus()

    document.addEventListener("keydown", handleKeydown)

    return () => {
      // Remove the dialog
      document.body.removeChild(current)

      // Return the focus
      focusedElBeforeOpen.focus()

      document.removeEventListener("keydown", handleKeydown)
    }
  }, [])

  return createPortal(
    <Container ref={containerEl as any} zIndex={zIndex} {...rest}>
      <ScrollIsolation ref={scrollIsolationEl as any} onClick={handleClick}>
        <Dialog
          maxHeight={
            // Sets to `innerHeight` so as to simulate `100vh` on iOS
            window.innerHeight
          }
          {...dialogProps}
        >
          {children}
        </Dialog>
      </ScrollIsolation>
    </Container>,
    appendEl.current
  )
}

ModalBase.displayName = "ModalBase"
