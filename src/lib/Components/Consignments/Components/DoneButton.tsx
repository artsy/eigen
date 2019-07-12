import React from "react"
import { View } from "react-native"
import { BottomAlignedButton } from "./BottomAlignedButton"

export interface DoneButtonProps extends React.Props<JSX.Element> {
  onPress: () => void
  verticalOffset?: number
}

const DoneButton: React.SFC<DoneButtonProps> = props => {
  const doneButtonStyles = {
    backgroundColor: "black",
    marginBottom: 0,
    paddingTop: 18,
    height: 56,
  }
  // This uses an outdated version of the BottomAlignedButton
  return (
    <BottomAlignedButton
      onPress={props.onPress}
      bodyStyle={doneButtonStyles}
      verticalOffset={props.verticalOffset}
      buttonText="DONE"
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 540,
          alignSelf: "center",
        }}
      >
        {props.children}
      </View>
    </BottomAlignedButton>
  )
}

export default DoneButton
