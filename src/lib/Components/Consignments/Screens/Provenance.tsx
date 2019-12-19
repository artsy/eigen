import { Theme } from "@artsy/palette"
import React from "react"
import { Route, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"
import TextArea from "../Components/TextArea"
import { ConsignmentSetup } from "../index"

interface Props extends ConsignmentSetup, ViewProperties {
  navigator: NavigatorIOS
  route: Route
  updateWithProvenance?: (provenance: string) => void
}

interface State {
  provenance: string
}

export default class Provenance extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      provenance: props.provenance,
    }
  }

  doneTapped = () => {
    this.props.updateWithProvenance(this.state.provenance)
    this.props.navigator.pop()
  }

  textChanged = text => this.setState({ provenance: text })

  render() {
    return (
      <Theme>
        <BottomAlignedButton onPress={this.doneTapped} buttonText="Done">
          <View
            style={{
              marginLeft: 20,
              marginRight: 20,
              marginTop: 20,
              maxHeight: 600,
              flexDirection: "row-reverse",
            }}
          >
            <TextArea
              text={{
                onChangeText: this.textChanged,
                value: this.state.provenance,
                placeholder:
                  "Add notes about how you aquired the work. If you’re not sure add any details about how long you’ve had the work.",
                autoFocus: typeof jest === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */,
              }}
            />
          </View>
        </BottomAlignedButton>
      </Theme>
    )
  }
}
