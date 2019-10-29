import { Sans, Serif, Spacer } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Text, TouchableWithoutFeedback } from "react-native"

interface Props {
  website: string
}

export class PartnerOverviewWebsite extends React.Component<Props> {
  render() {
    const { website } = this.props

    return (
      <>
        <Sans size="3t" weight="medium">
          Website
        </Sans>
        <Spacer mb={2} />
        <TouchableWithoutFeedback onPress={() => SwitchBoard.presentNavigationViewController(this, website)}>
          <Serif size="3t">
            <Text style={{ textDecorationLine: "underline" }}>{website}</Text>
          </Serif>
        </TouchableWithoutFeedback>
        <Spacer mb={3} />
      </>
    )
  }
}
