import { Box, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { CityGuideMap_viewer$data } from "__generated__/CityGuideMap_viewer.graphql"
import ChevronIcon from "app/Components/Icons/ChevronIcon"
import Spinner from "app/Components/Spinner"
import { BOX_SHADOW } from "app/Components/constants"

interface Props {
  onPress?: () => void
  city: CityGuideMap_viewer$data["city"]
  isLoading: boolean
}

export const CityGuideCitySwitcherButton: React.FC<Props> = ({ city, isLoading, onPress }) => {
  if (!city && !isLoading) {
    return null
  }

  return (
    <Touchable
      accessibilityRole="button"
      onPress={() => {
        onPress?.()
      }}
    >
      <Flex
        flexDirection="row"
        alignItems="center"
        backgroundColor="mono0"
        height={40}
        borderRadius={20}
        style={BOX_SHADOW}
      >
        {city ? (
          <>
            <Text variant="sm" weight="medium" ml={4} selectable={false}>
              {city.name}
            </Text>
            <Box ml={2} mr={4}>
              <ChevronIcon initialDirection="down" color="mono100" width={20} height={20} />
            </Box>
          </>
        ) : (
          <Flex alignItems="center" justifyContent="center" flexGrow={1}>
            <Spinner
              spinnerColor="mono60"
              style={{ backgroundColor: "transparent" }}
              size="medium"
            />
          </Flex>
        )}
      </Flex>
    </Touchable>
  )
}
