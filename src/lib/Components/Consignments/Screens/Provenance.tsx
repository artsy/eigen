import * as React from "react"

import ConsignmentBG from "../Components/ConsignmentBG"
import DoneButton from "../Components/DoneButton"

import { NavigatorIOS, Route, View, ViewProperties } from "react-native"
import TextArea, { TextAreaProps } from "../Components/TextArea"
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
  constructor(props) {
    super(props)
    this.state = {
      provenance: null,
    }
  }

  doneTapped = () => {
    this.props.updateWithProvenance(this.state.provenance)
    this.props.navigator.pop()
  }

  textChanged = text => {
    this.setState({ provenance: text })
  }

  render() {
    return (
      <ConsignmentBG>
        <DoneButton onPress={this.doneTapped}>
          <View
            style={{
              alignContent: "center",
              justifyContent: "flex-end",
              flexGrow: 1,
              marginLeft: 20,
              marginRight: 20,
              marginTop: 20,
            }}
          >
            <TextArea
              text={{
                onChangeText: this.textChanged,
                value: this.props.provenance,
                placeholder:
                  "Add notes about how you aquired the work. If you’re not sure add any details about how long you’ve had the work.",
                autoFocus: typeof jest === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */,
              }}
            />
          </View>
        </DoneButton>
      </ConsignmentBG>
    )
  }
}
