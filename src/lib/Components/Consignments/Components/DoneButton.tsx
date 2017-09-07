import * as React from "react"

import BottomAlignedButton from "./BottomAlignedButton"

export interface DoneButtonProps extends React.Props<JSX.Element> {
  onPress: () => void
}

const DoneButton: React.SFC<DoneButtonProps> = props => {
  const doneButtonStyles = {
    backgroundColor: "black",
    marginBottom: 0,
    paddingTop: 18,
    height: 56,
  }
  return (
    <BottomAlignedButton onPress={props.onPress} bodyStyle={doneButtonStyles} buttonText="DONE">
      {props.children}
    </BottomAlignedButton>
  )
}

export default DoneButton
