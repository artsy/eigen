import { ChevronDownIcon, ChevronUpIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"

interface Props {
  title: string
  isExpanded: boolean
  onToggle: () => void
}

/**
 * Stateless on purpose: this renders as a recycled FlatList cell, so the screen owns
 * expansion state — a cell tracking its own state would show the wrong state when reused.
 */
export const CityEventSectionHeader: React.FC<Props> = ({ title, isExpanded, onToggle }) => {
  return (
    <Touchable
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
    </Touchable>
  )
}
