import * as React from "react"

import BottomAlignedButton from "./BottomAlignedButton"

export interface DoneButtonProps {
  onPress: () => void
}

const render = (props: DoneButtonProps) => {
  const doneButtonStyles = {
    backgroundColor: "black",
    marginBottom: 20,
    paddingTop: 18,
    height: 56,
  }
  return <BottomAlignedButton onPress={props.onPress} bodyStyle={doneButtonStyles} buttonText="DONE" />
}

export default class DoneButton extends React.Component<DoneButtonProps, null> {
  render() {
    return render(this.props)
  }
}
