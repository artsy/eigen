import { ChevronDownIcon } from "@artsy/icons/native"
import { Button, Theme } from "@artsy/palette-mobile"
import Spinner from "app/Components/Spinner"

interface Props {
  onPress?: () => void
  cityName?: string
}

const ICON_SIZE = 18

export const CityGuideCitySwitcherButton: React.FC<Props> = ({ cityName, onPress }) => {
  return (
    // Always use dark mode for the city switcher button
    <Theme theme="v3dark">
      <Button
        testID="city-guide-city-switcher"
        variant="outlineLight"
        onPress={onPress}
        size="small"
        iconPosition="right"
        icon={<ChevronDownIcon color="mono100" width={ICON_SIZE} height={ICON_SIZE} />}
      >
        {cityName ? (
          cityName
        ) : (
          <Spinner spinnerColor="mono60" style={{ backgroundColor: "transparent" }} size="medium" />
        )}
      </Button>
    </Theme>
  )
}
