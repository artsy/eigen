import React from "react"
import { ScrollView } from "react-native"

import { Serif16 } from "../Elements/Typography"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
import { Container } from "../Components/Containers"
import { Input } from "../Components/Input"
import { Title } from "../Components/Title"

export class BillingAddress extends React.Component {
  render() {
    return (
      <BiddingThemeProvider>
        <ScrollView>
          <Container>
            <Title mt={0} mb={6}>
              Your billing address
            </Title>

            <Serif16 mb={2}>Full name</Serif16>
            <Input placeholder="Enter your full name" mb={4} />

            <Serif16 mb={2}>Address line 1</Serif16>
            <Input placeholder="Enter your street address" mb={4} />

            <Serif16 mb={2}>Address line 2 (optional)</Serif16>
            <Input placeholder="Enter your apt, floor, suite, etc." mb={4} />

            <Serif16 mb={2}>City</Serif16>
            <Input placeholder="Enter city" mb={4} />

            <Serif16 mb={2}>State, Province, or Region</Serif16>
            <Input placeholder="Enter state, province, or region" mb={4} />

            <Serif16 mb={2}>Postal code</Serif16>
            <Input placeholder="Enter your postal code" mb={4} />

            <Button text="Add billing address" onPress={() => null} />
          </Container>
        </ScrollView>
      </BiddingThemeProvider>
    )
  }
}
