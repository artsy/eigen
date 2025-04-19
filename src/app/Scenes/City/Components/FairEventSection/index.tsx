import { Box, Text } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { navigate } from "app/system/navigation/navigate"
import { Component } from "react"
import { FlatList } from "react-native"
import styled from "styled-components/native"
import { FairEventSectionCard } from "./Components/FairEventSectionCard"

const FairSectionBackground = styled(Box)`
  background: ${themeGet("colors.mono100")};
  margin-bottom: ${themeGet("space.1")};
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
      <ThemeAwareClassTheme>
        {({ space }) => (
          <FairSectionBackground>
            <Box mt={4}>
              <Text variant="lg-display" color="mono0">
                Fairs
              </Text>
            </Box>
            <FlatList
              data={data.filter((fair) => Boolean(fair.image))}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingVertical: space(2) }}
              horizontal
            />
            {data.length > 2 && (
              <Box mb={4}>
                <CaretButton
                  onPress={() => this.viewAllPressed()}
                  text={`View all ${data.length} fairs`}
                  textColor="mono0"
                />
              </Box>
            )}
          </FairSectionBackground>
        )}
      </ThemeAwareClassTheme>
    )
  }
}
