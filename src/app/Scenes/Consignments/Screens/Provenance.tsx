import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { KeyboardAvoidingView, View, ViewProps } from "react-native"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"
import { TextArea } from "../Components/TextArea"
import { ConsignmentSetup } from "../index"

interface Props extends ConsignmentSetup, ViewProps {
  navigator: NavigatorIOS
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
      <BottomAlignedButton onPress={this.doneTapped} buttonText="Done">
        <FancyModalHeader onLeftButtonPress={this.doneTapped}>Provenance</FancyModalHeader>
        <KeyboardAvoidingView style={{ flex: 1 }}>
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
                  "Add notes about how you acquired the work. If you’re not sure add any details about how long you’ve owned the work.",
                autoFocus:
                  typeof jest ===
                  "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */,
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </BottomAlignedButton>
    )
  }
}
