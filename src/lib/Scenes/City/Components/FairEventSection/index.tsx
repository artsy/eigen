import { Box, Sans, Serif, space } from "@artsy/palette"
import { Component } from "react"
import React from "react"
import { FlatList } from "react-native"
import styled from "styled-components/native"
import { FairEventSectionCard } from "./Components/FairEventSectionCard"

const FairSectionBackground = styled(Box)`
  background: black;
`

export class FairEventSection extends Component<any> {
  renderItem = ({ item }) => {
    return (
      <Box pr={1}>
        <FairEventSectionCard fair={item} />
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
          data={data}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: space(2) }}
          horizontal
        />
        <Box mx={2} mb={3}>
          <Sans weight="medium" size="3" color="white" px={1}>
            View all {data.length} fairs
          </Sans>
        </Box>
      </FairSectionBackground>
    )
  }
}
