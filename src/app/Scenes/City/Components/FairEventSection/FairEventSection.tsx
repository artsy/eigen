import { Box, Text } from "@artsy/palette-mobile"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { Component } from "react"
import { FlatList } from "react-native"
import { FairEventSectionCard } from "./Components/FairEventSectionCard"

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
          <Box backgroundColor="mono100" mb={1}>
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
          </Box>
        )}
      </ThemeAwareClassTheme>
    )
  }
}
