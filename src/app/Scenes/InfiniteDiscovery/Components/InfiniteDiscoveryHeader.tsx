import { ChevronDownIcon } from "@artsy/icons/native"
import { Screen, Touchable } from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { goBack } from "app/system/navigation/navigate"

export const InfiniteDiscoveryHeader: React.FC = () => {
  return (
    <Screen.Header
      title="Discover Daily"
      leftElements={
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => {
            goBack()
          }}
          testID="close-icon"
          hitSlop={ICON_HIT_SLOP}
          haptic
        >
          <ChevronDownIcon />
        </Touchable>
      }
      hideRightElements
    />
  )
}
