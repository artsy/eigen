import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { usePopoverCoordinator } from "app/Components/ProgressiveOnboarding/usePopoverCoordinator"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { ProgressiveOnboardingKey } from "app/store/ProgressiveOnboardingModel"
import React from "react"
import { StyleProp, ViewProps, ViewStyle } from "react-native"

interface OnboardingPopoverProps {
  /** Doubles as the popover lock's owner id, so the lock is readable in Sentry. */
  id: ProgressiveOnboardingKey
  /** Everything the surface knows about whether this should show. */
  when: boolean
  /** A string gets the standard popover typography; pass a node for anything richer. */
  title: string | React.ReactElement
  content?: string | React.ReactElement
  variant?: "light" | "dark"
  placement?: "top" | "bottom" | "left" | "right"
  /** Delay before showing, to let layout settle. Hiding is never delayed. */
  delay?: number
  /** Tracked name, when it differs from `id` (e.g. the alert reminder chain). */
  trackingName?: ProgressiveOnboardingKey
  /** Matches the tracking hook: optional, and the wider `OwnerType`. */
  contextScreenOwnerType?: OwnerType
  /**
   * Omit to skip the `tooltipViewed` event. Surfaces that never tracked before stay
   * untracked, so migrating them doesn't silently add analytics.
   */
  contextModule?: ContextModule
  /** Runs instead of the default `dismiss(id)` when the popover is dismissed. */
  onDismiss?: () => void
  /** Escape hatch for surfaces that need a transparent backdrop (e.g. the tab bar). */
  backgroundStyle?: StyleProp<ViewStyle>
  /** Applied to the anchor wrapper; some anchors must not swallow touches. */
  pointerEvents?: ViewProps["pointerEvents"]
}

/**
 * The one way to show a progressive onboarding popover.
 *
 * It owns the lock, the show delay, the route and overlay checks, and the watchdogs that
 * recover a popover the underlying library has left stuck. Surfaces supply only the
 * condition and the copy.
 *
 * This is the only file in `src/` that may import `Popover` from `@artsy/palette-mobile`
 * — enforced by ESLint. Every popover rendered outside the coordinator is a full-screen
 * native `<Modal>` that can race the others and block all touches.
 */
export const OnboardingPopover: React.FC<React.PropsWithChildren<OnboardingPopoverProps>> = ({
  id,
  when,
  title,
  content,
  variant = "dark",
  placement = "top",
  delay = 0,
  trackingName,
  contextScreenOwnerType,
  contextModule,
  onDismiss,
  backgroundStyle,
  pointerEvents,
  children,
}) => {
  const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss } = GlobalStore.actions.progressiveOnboarding

  const isDisplayable = when && !isDismissed(id).status

  const { isVisible, remountKey, onOpenComplete, onCloseComplete } = usePopoverCoordinator({
    id,
    isDisplayable,
    delay,
  })

  const { trackEvent } = useProgressiveOnboardingTracking({
    name: trackingName ?? id,
    contextScreenOwnerType,
    contextModule: contextModule ?? ContextModule.header,
  })

  const handleOpenComplete = () => {
    // The coordinator needs this to call off its watchdog, whether or not we track.
    onOpenComplete()

    if (contextModule) {
      trackEvent()
    }
  }

  // The dark popover paints on a dark surface, the light one on a light surface.
  const titleColor = variant === "light" ? "mono100" : "mono0"

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss()
      return
    }
    // Dismissal no longer frees the lock; the coordinator gives it back once the popover
    // has actually finished closing.
    dismiss(id)
  }

  return (
    <Popover
      key={remountKey}
      visible={isVisible}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onOpenComplete={handleOpenComplete}
      onCloseComplete={onCloseComplete}
      variant={variant}
      placement={placement}
      backgroundStyle={backgroundStyle}
      title={
        typeof title === "string" ? (
          <Text variant="xs" color={titleColor} weight="medium">
            {title}
          </Text>
        ) : (
          title
        )
      }
      content={
        typeof content === "string" ? (
          <Flex maxWidth={250}>
            <Text variant="xs" color={titleColor}>
              {content}
            </Text>
          </Flex>
        ) : (
          content
        )
      }
    >
      <Flex pointerEvents={pointerEvents}>{children}</Flex>
    </Popover>
  )
}
