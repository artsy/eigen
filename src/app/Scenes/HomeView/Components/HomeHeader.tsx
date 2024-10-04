import { ArtsyLogoBlackIcon, Flex, Box, useSpace } from "@artsy/palette-mobile"
import { AlphaVersionIndicator } from "app/Scenes/HomeView/Components/AlphaVersionIndicator"
import { GlobalStore } from "app/store/GlobalStore"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = () => {
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.hasUnseenNotifications
  )

  const space = useSpace()

  return (
    <Box style={{ paddingTop: space(2), paddingBottom: space(2) }}>
      <Flex flexDirection="row" px={2} justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          <AlphaVersionIndicator />
        </Box>
        <Box>
          <ArtsyLogoBlackIcon scale={0.75} />
        </Box>
        <Box flex={1} alignItems="flex-end">
          <ActivityIndicator hasUnseenNotifications={hasUnseenNotifications} />
        </Box>
      </Flex>
    </Box>
  )
}
