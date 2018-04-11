import React from "react"
import styled from "styled-components/native"

import { Button } from "../Components/Button"
import { MaxBidPicker } from "../Components/MaxBidPicker"
import { Title } from "../Components/Title"

interface SelectMaxBidProps {
  saleArtworkID: string
}

// we are using hard-coded values for now.
const Bids = [
  {
    label: "$35,000 USD",
    value: 3500000,
  },
  {
    label: "$40,000 USD",
    value: 4000000,
  },
  {
    label: "$45,000 USD",
    value: 4500000,
  },
  {
    label: "$50,000 USD",
    value: 5000000,
  },
  {
    label: "$55,000 USD",
    value: 5500000,
  },
]

export class SelectMaxBid extends React.Component<SelectMaxBidProps> {
  render() {
    return (
      <Container>
        <Title>Your max bid</Title>

        <MaxBidPicker selectedValue={4500000} bids={Bids} />

        <Button text="NEXT" onPress={() => null} />
      </Container>
    )
  }
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px;
`
