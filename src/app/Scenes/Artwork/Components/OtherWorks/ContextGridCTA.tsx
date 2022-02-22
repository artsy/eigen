import { navigate } from "app/navigation/navigate"
import { Schema, track } from "app/utils/track"
import { ArrowRightIcon, Flex, Sans } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"

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
  openLink() {
    const { href } = this.props
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    navigate(href)
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
            <Flex alignSelf="center">
              <ArrowRightIcon fill="black30" ml={1} />
            </Flex>
          </Flex>
        </TouchableWithoutFeedback>
      )
    } else {
      return null
    }
  }
}
