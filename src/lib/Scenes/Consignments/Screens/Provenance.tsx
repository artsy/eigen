import { Theme } from "palette"
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
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      provenance: props.provenance,
    }
  }

  doneTapped = () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    this.props.updateWithProvenance(this.state.provenance)
    this.props.navigator.pop()
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  textChanged = (text) => this.setState({ provenance: text })

  render() {
    return (
      <Theme>
        <BottomAlignedButton onPress={this.doneTapped} buttonText="Done">
          <View
            style={{
              marginLeft: 20,
              marginRight: 20,
              marginTop: 40,
              maxHeight: 600,
              flexDirection: "row-reverse",
            }}
          >
            <TextArea
              text={{
                onChangeText: this.textChanged,
                value: this.state.provenance,
                placeholder:
                  "Add notes about how you acquired the work. If you’re not sure add any details about how long you’ve owned the work.",
                autoFocus: typeof jest === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */,
              }}
            />
          </View>
        </BottomAlignedButton>
      </Theme>
    )
  }
}
