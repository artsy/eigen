import { Flex } from "@artsy/palette-mobile"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import DeviceInfo from "react-native-device-info"

export const DynamicIslandStagingIndicator = () => {
  const isStaging = useIsStaging()

  if (!isStaging || !DeviceInfo.hasDynamicIsland()) {
    return null
  }

  let rect: { top: number; left: number } | undefined

  switch (DeviceInfo.getDeviceId()) {
    case "iPhone15,2":
      rect = { top: 9.5, left: 132 }
      break
    case "iPhone15,3":
      rect = { top: 9.5, left: 150.5 }
      break
    default:
      console.warn("No rect for this device: ", DeviceInfo.getDeviceId())
  }

  if (rect === undefined) {
    return null
  }

  return (
    <Flex
      backgroundColor="devpurple"
      position="absolute"
      width={129}
      height={40}
      top={rect.top}
      left={rect.left}
      borderRadius={40}
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
    >
      <Flex backgroundColor="mono0" width={127} height={37.5} borderRadius={40} overflow="hidden" />
    </Flex>
  )
}
