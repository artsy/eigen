import { ChevronDownIcon } from "@artsy/icons/native"
import { Button } from "@artsy/palette-mobile"
import Spinner from "app/Components/Spinner"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

interface Props {
  onPress?: () => void
  cityName?: string
}

const ICON_SIZE = 18

export const CityGuideCitySwitcherButton: React.FC<Props> = ({ cityName, onPress }) => {
  const enableCityGuideList = useFeatureFlag("AREnableGlobalMapList")

  return (
    <Button
      variant="outline"
      onPress={onPress}
      size="small"
      iconPosition="right"
      icon={<ChevronDownIcon color="mono100" width={ICON_SIZE} height={ICON_SIZE} />}
      transparent={enableCityGuideList}
    >
      {cityName ? (
        cityName
      ) : (
        <Spinner spinnerColor="mono60" style={{ backgroundColor: "transparent" }} size="medium" />
      )}
    </Button>
  )
}
