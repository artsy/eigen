import { ChevronDownIcon, ChevronUpIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { TouchableOpacity } from "react-native"

interface Props {
  title: string
  isExpanded: boolean
  onToggle: () => void
}

/**
 * Stateless on purpose. This renders as a recycled cell in `CityEventListScreen`'s
 * `Screen.FlatList` (recycled the same way a FlashList cell would be), so the screen owns
 * expansion state — a recycled cell tracking its own expanded/collapsed state would show the
 * wrong state as it gets reused for a different section. `ItinerarySectionRow` is the stateful
 * ScrollView equivalent and stays where it is.
 */
export const CityEventSectionHeader: React.FC<Props> = ({ title, isExpanded, onToggle }) => {
  return (
    <TouchableOpacity
      testID="city-event-section-header"
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      onPress={onToggle}
    >
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={1}>
        <Text variant="sm-display" color="blue100">
          {title}
        </Text>
        {isExpanded ? <ChevronUpIcon fill="blue100" /> : <ChevronDownIcon fill="blue100" />}
      </Flex>
    </TouchableOpacity>
  )
}
