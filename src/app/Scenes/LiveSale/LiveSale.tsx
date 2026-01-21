import { CloseIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Screen, Text, Touchable } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"

export const LiveSale: React.FC<{ slug: string }> = ({ slug }) => {
  return (
    <Screen>
      <Screen.Header
        leftElements={
          // TODO: Is this the preferred way to have close icon? should we use NavigationHeader?
          // update Screen.Header to more easily support close icon?
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Exit Sale"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => goBack()}
          >
            <CloseIcon />
          </Touchable>
        }
      />
      <Text>This is where I would put my Live Sale Screen for {slug}</Text>
    </Screen>
  )
}
