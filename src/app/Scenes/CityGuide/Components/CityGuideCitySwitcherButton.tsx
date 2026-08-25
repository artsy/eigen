import { ChevronDownIcon, DownloadIcon } from "@artsy/icons/native"
import { Box, Button, Flex, Text, Touchable } from "@artsy/palette-mobile"
import ChevronIcon from "app/Components/Icons/ChevronIcon"
import Spinner from "app/Components/Spinner"

interface Props {
  onPress?: () => void
  cityName: string
  isLoading: boolean
}

const ICON_SIZE = 18

export const CityGuideCitySwitcherButton: React.FC<Props> = ({ cityName, isLoading, onPress }) => {
  if (!cityName && !isLoading) {
    return null
  }

  return (
    <Button
      variant="outline"
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
  )
}
