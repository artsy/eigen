import { Box, Serif, space } from "@artsy/palette"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Component } from "react"
import React from "react"
import { FlatList } from "react-native"
import styled from "styled-components/native"
import { FairEventSectionCard } from "./Components/FairEventSectionCard"

const FairSectionBackground = styled(Box)`
  background: black;
  margin-bottom: ${space(1)};
`

interface Props {
  citySlug: string
  // Likely Fair[]
  data: any[]
}

export class FairEventSection extends Component<Props> {
  viewAllPressed = () => {
    const { citySlug } = this.props
    SwitchBoard.presentNavigationViewController(this, `/city-fair/${citySlug}`)
  }

  renderItem = ({ item }) => {
    const fair = item
    return (
      <Box pr={1}>
        <FairEventSectionCard fair={fair} />
      </Box>
    )
  }

  render() {
    const { data } = this.props
    return (
      <FairSectionBackground>
        <Box mx={2} mt={3}>
          <Serif size="8" color="white">
            Fairs
          </Serif>
        </Box>
        <FlatList
          data={data.filter(fair => Boolean(fair.image))}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: space(2) }}
          horizontal
        />
        {data.length > 2 && (
          <Box mx={2} mb={3}>
            <CaretButton
              onPress={() => this.viewAllPressed()}
              text={`View all ${data.length} fairs`}
              textColor="white"
            />
          </Box>
        )}
      </FairSectionBackground>
    )
  }
}
