import { ChevronDownIcon } from "@artsy/icons/native"
import { Button, Theme } from "@artsy/palette-mobile"
import Spinner from "app/Components/Spinner"
import { GlobalStore } from "app/store/GlobalStore"

interface Props {
  onPress?: () => void
  cityName?: string
  isListView?: boolean
}

const ICON_SIZE = 18

export const CityGuideCitySwitcherButton: React.FC<Props> = ({ cityName, onPress, isListView }) => {
  const colorScheme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)
  const theme = isListView ? (colorScheme !== "dark" ? "v3dark" : "v3light") : "v3dark"
  return (
    // Always use dark mode for the city switcher button
    <Theme theme={theme}>
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
