import { FilterIcon } from "@artsy/icons/native"
import { bullet, Flex, Text, Separator, TouchableHighlightColor } from "@artsy/palette-mobile"
import { ProgressiveOnboardingAlertFilters } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingAlertFilters"

interface FilterHeaderProps {
  children?: React.ReactNode
  onFilterPress: () => void
  selectedFiltersCount: number
  title?: string
  childrenPosition?: "left" | "right"
  showSeparator?: boolean
}

const HEADER_HEIGHT = 50

export const ArtworksFilterHeader: React.FC<FilterHeaderProps> = ({
  children,
  onFilterPress,
  selectedFiltersCount,
  title,
  childrenPosition = "right",
  showSeparator = true,
}) => {
  return (
    <Flex backgroundColor="background">
      <Flex
        flexDirection="row"
        height={HEADER_HEIGHT}
        px={2}
        justifyContent="space-between"
        alignItems="center"
      >
        {childrenPosition === "left" && children}
        <ProgressiveOnboardingAlertFilters>
          <TouchableHighlightColor
            haptic
            onPress={onFilterPress}
            testID="sort-and-filter-button"
            render={({ color }) => (
              <Flex flexDirection="row" alignItems="center">
                <FilterIcon fill={color} width="20px" height="20px" />
                <Text variant="xs" numberOfLines={1} color={color} ml={0.5}>
                  {title ?? "Sort & Filter"}
                </Text>
                {selectedFiltersCount > 0 && (
                  <Text variant="xs" color="blue100">
                    {` ${bullet} ${selectedFiltersCount}`}
                  </Text>
                )}
              </Flex>
            )}
          />
        </ProgressiveOnboardingAlertFilters>
        {childrenPosition === "right" && children}
      </Flex>
      {!!showSeparator && <Separator />}
    </Flex>
  )
}
