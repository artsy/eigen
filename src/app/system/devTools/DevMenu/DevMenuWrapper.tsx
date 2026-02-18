import { Flex } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { useCaptureTaps } from "app/system/devTools/DevMenu/hooks/useCaptureTaps"
import { Platform } from "react-native"

export const DevMenuWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const userIsDev = GlobalStore.useAppState((store) => store.artsyPrefs.userIsDev.value)

  const { handleStartShouldSetResponderCapture } = useCaptureTaps()

  if (!userIsDev || Platform.OS === "ios") {
    return <Flex flex={1}>{children}</Flex>
  }

  return (
    <Flex flex={1} onStartShouldSetResponderCapture={handleStartShouldSetResponderCapture}>
      {children}
    </Flex>
  )
}
