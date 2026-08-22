import { Box, Text, useSpace } from "@artsy/palette-mobile"
import { CaretButton } from "app/Components/Buttons/CaretButton"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { FlatList } from "react-native"
import { FairEventSectionCard } from "./Components/FairEventSectionCard"

interface Props {
  citySlug: string
  // Likely Fair[]
  data: any[]
}

export const FairEventSection: React.FC<Props> = ({ citySlug, data }) => {
  const space = useSpace()

  const viewAllPressed = () => {
    navigate(`/city-fair/${citySlug}`)
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const renderItem = ({ item }) => {
    const fair = item
    return (
      <Box pr={1}>
        <FairEventSectionCard fair={fair} />
      </Box>
    )
  }

  return (
    <Box backgroundColor="mono100" mb={1}>
      <Box mt={4}>
        <Text variant="lg-display" color="mono0">
          Fairs
        </Text>
      </Box>
      <FlatList
        data={data.filter((fair) => Boolean(fair.image))}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: space(2) }}
        horizontal
      />
      {data.length > 2 && (
        <Box mb={4}>
          <CaretButton
            onPress={() => viewAllPressed()}
            text={`View all ${data.length} fairs`}
            textColor="mono0"
          />
        </Box>
      )}
    </Box>
  )
}
