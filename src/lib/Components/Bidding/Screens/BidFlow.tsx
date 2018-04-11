import React from "react"
import SerifText from "../../../Components/Text/Serif"

interface BidFlowProps {
  saleArtworkID: string
}

export default class BidFlow extends React.Component<BidFlowProps> {
  render() {
    return <SerifText>This will be the home of the new bidding flow.</SerifText>
  }
}
