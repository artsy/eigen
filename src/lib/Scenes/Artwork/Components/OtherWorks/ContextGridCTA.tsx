import { ArrowRightIcon, Flex, Sans } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { Text, TouchableWithoutFeedback } from "react-native"

interface ContextGridCTAProps {
  href?: string
  contextModule?: string
  label: string
}

@track()
export class ContextGridCTA extends React.Component<ContextGridCTAProps> {
  @track(props => ({
    action_name: Schema.ActionNames.ViewAll,
    action_type: Schema.ActionTypes.Tap,
    flow: Schema.Flow.RecommendedArtworks,
    context_module: props.contextModule,
  }))
  openLink() {
    const { href } = this.props
    SwitchBoard.presentNavigationViewController(this, href)
  }

  render() {
    const { href, label } = this.props

    if (href && label) {
      return (
        <TouchableWithoutFeedback onPress={() => this.openLink()}>
          <Flex flexDirection="row" alignContent="center">
            <Sans size="3" textAlign="left" weight="medium">
              {label}
            </Sans>
            <ArrowRightIcon fill="black30" ml={1} mt={0.3} />
          </Flex>
        </TouchableWithoutFeedback>
      )
    } else {
      return null
    }
  }
}
