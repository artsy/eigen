import { themeGet } from "@styled-system/theme-get"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { navigate } from "app/navigation/navigate"
import { Box, ClassTheme, Serif } from "palette"
import { Component } from "react"
import React from "react"
import { FlatList } from "react-native"
import styled from "styled-components/native"
import { FairEventSectionCard } from "./Components/FairEventSectionCard"

const FairSectionBackground = styled(Box)`
  background: black;
  margin-bottom: ${themeGet("space.1")}px;
`

interface Props {
  citySlug: string
  // Likely Fair[]
  data: any[]
}

export class FairEventSection extends Component<Props> {
  viewAllPressed = () => {
    const { citySlug } = this.props
    navigate(`/city-fair/${citySlug}`)
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
      <ClassTheme>
        {({ space }) => (
          <FairSectionBackground>
            <Box mx={2} mt={3}>
              <Serif size="8" color="white">
                Fairs
              </Serif>
            </Box>
            <FlatList
              data={data.filter((fair) => Boolean(fair.image))}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.id}
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
        )}
      </ClassTheme>
    )
  }
}
