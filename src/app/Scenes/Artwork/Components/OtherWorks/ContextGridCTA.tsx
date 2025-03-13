import { ArrowRightIcon, Flex, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Schema, track } from "app/utils/track"
import React from "react"

interface ContextGridCTAProps {
  href?: string
  contextModule?: string
  label: string
}

@track()
export class ContextGridCTA extends React.Component<ContextGridCTAProps> {
  @track((props) => ({
    action_name: Schema.ActionNames.ViewAll,
    action_type: Schema.ActionTypes.Tap,
    flow: Schema.Flow.RecommendedArtworks,
    context_module: props.contextModule,
  }))
  render() {
    const { href, label } = this.props

    if (href && label) {
      return (
        <RouterLink to={href} accessibilityLabel="Context Grid CTA">
          <Flex flexDirection="row" alignContent="center">
            <Text variant="sm" textAlign="left" weight="medium">
              {label}
            </Text>
            <Flex alignSelf="center">
              <ArrowRightIcon fill="black30" ml={1} />
            </Flex>
          </Flex>
        </RouterLink>
      )
    } else {
      return null
    }
  }
}
