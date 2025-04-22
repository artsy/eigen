import { ArrowRightIcon, Flex, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Schema } from "app/utils/track"
import React from "react"
import { useTracking } from "react-tracking"

interface ContextGridCTAProps {
  href?: string
  contextModule?: string
  label: string
}

export const ContextGridCTA: React.FC<ContextGridCTAProps> = ({ href, label, contextModule }) => {
  const { trackEvent } = useTracking()

  if (!href || !label) {
    return null
  }

  return (
    <RouterLink
      to={href}
      accessibilityLabel="Context Grid CTA"
      onPress={() =>
        trackEvent({
          action_name: Schema.ActionNames.ViewAll,
          action_type: Schema.ActionTypes.Tap,
          flow: Schema.Flow.RecommendedArtworks,
          context_module: contextModule,
        })
      }
    >
      <Flex flexDirection="row" alignContent="center">
        <Text variant="sm" textAlign="left" weight="medium">
          {label}
        </Text>
        <Flex alignSelf="center">
          <ArrowRightIcon fill="mono30" ml={1} />
        </Flex>
      </Flex>
    </RouterLink>
  )
}
