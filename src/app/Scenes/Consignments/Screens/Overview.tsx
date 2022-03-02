import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack } from "app/navigation/navigate"
import { track as _track } from "app/utils/track"
import React from "react"
export class Overview extends React.Component {
  render() {
    return (
      <>
        <FancyModalHeader
          useXButton
          onLeftButtonPress={() => {
            goBack()
          }}
        >
          Submit a work
        </FancyModalHeader>
      </>
    )
  }
}
