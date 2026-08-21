import { Box, Text, useSpace } from "@artsy/palette-mobile"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { CaretButton } from "app/Components/Buttons/CaretButton"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { Fair } from "app/utils/cityGuide/types"
import { memo, useCallback, useMemo } from "react"
import { FairEventSectionCard } from "./Components/FairEventSectionCard"

interface Props {
  citySlug: string
  data: Fair[]
}

export const FairEventSection: React.FC<Props> = memo(({ citySlug, data }) => {
  const space = useSpace()

  const viewAllPressed = useCallback(() => {
    navigate(`/city-fair/${citySlug}`)
  }, [citySlug])

  const fairsWithImages = useMemo(() => data.filter((fair) => Boolean(fair.image)), [data])

  const renderItem: ListRenderItem<Fair> = useCallback(
    ({ item }) => (
      <Box pr={1}>
        <FairEventSectionCard fair={item} />
      </Box>
    ),
    []
  )

  const keyExtractor = useCallback((item: Fair) => item.id, [])

  return (
    <Box backgroundColor="mono100" mb={1}>
      <Box mt={4}>
        <Text variant="lg-display" color="mono0">
          Fairs
        </Text>
      </Box>
      <FlashList
        data={fairsWithImages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingVertical: space(2) }}
        horizontal
      />
      {data.length > 2 && (
        <Box mb={4}>
          <CaretButton
            onPress={viewAllPressed}
            text={`View all ${data.length} fairs`}
            textColor="mono0"
          />
        </Box>
      )}
    </Box>
  )
})
