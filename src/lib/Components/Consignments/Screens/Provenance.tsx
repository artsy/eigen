import * as React from "react"

import DoneButton from "../Components/BottomAlignedButton"
import ConsignmentBG from "../Components/ConsignmentBG"

import { NavigatorIOS, Route, View } from "react-native"
import TextArea, { TextAreaProps } from "../Components/TextArea"
import { ConsignmentSetup } from "../index"

interface Props extends ConsignmentSetup {
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
    this.props.navigator.pop()
  }

  render() {
    // TODO: Move this and occurence in Artist.tsx to its own file.
    // This might become a higher order component for reuse, if used more elsewhere
    const doneButtonStyles = {
      backgroundColor: "black",
      marginBottom: 20,
      paddingTop: 18,
      height: 56,
    }

    return (
      <ConsignmentBG>
        <DoneButton onPress={this.doneTapped} bodyStyle={doneButtonStyles} buttonText="DONE">
          <View
            style={{ alignContent: "center", justifyContent: "flex-end", flexGrow: 1, marginLeft: 20, marginRight: 20 }}
          >
            <TextArea
              text={{
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
