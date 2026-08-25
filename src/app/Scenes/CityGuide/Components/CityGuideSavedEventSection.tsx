import { Flex, Box, Text } from "@artsy/palette-mobile"
import ChevronIcon from "app/Components/Icons/ChevronIcon"
import PinSavedOff from "app/Components/Icons/PinSavedOff"
import PinSavedOn from "app/Components/Icons/PinSavedOn"
import { Show } from "app/Scenes/CityGuide/utils/types"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { TouchableWithoutFeedback } from "react-native"

export interface Props {
  data: Show[]
  citySlug: string
}

// @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
export const CityGuideSavedEventSection: React.FC<Props> = ({ data, citySlug }) => {
  const handleTap = () => {
    navigate(`/city-save/${citySlug}`)
  }

  const hasSaves = data.length > 0
  const hasSavesComponent = (
    <TouchableWithoutFeedback accessibilityRole="button" onPress={handleTap}>
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
        <Flex flexDirection="row" alignItems="center">
          <PinSavedOn pinWidth={30} pinHeight={30} />
          <Text variant="sm" weight="medium" ml={24}>
            {data.length > 1 ? data.length + " saved events" : data.length + " saved event"}
          </Text>
        </Flex>
        <ChevronIcon color="mono100" />
      </Flex>
    </TouchableWithoutFeedback>
  )

  const hasNoSavesComponent = (
    <>
      <Flex flexDirection="row" alignItems="center">
        <PinSavedOff width={30} height={30} />
        <Flex ml="24px">
          <Text variant="sm" color="mono60" weight="medium">
            No saved events
          </Text>
          <Text variant="sm" color="mono60">
            Save a show to find it later
          </Text>
        </Flex>
      </Flex>
    </>
  )

  return (
    <>
      <Box my={2}>
        <Box p={1} borderRadius={2} borderWidth={1} borderColor="mono30">
          {hasSaves ? hasSavesComponent : hasNoSavesComponent}
        </Box>
      </Box>
    </>
  )
}
