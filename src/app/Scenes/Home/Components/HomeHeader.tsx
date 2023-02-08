import { Spacer, ArtsyLogoBlackIcon } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { Box, Flex } from "palette"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = () => {
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.displayUnseenNotificationsIndicator
  )

  return (
    <Box mb={1} mt={2}>
      <Flex alignItems="center">
        <ArtsyLogoBlackIcon scale={0.75} />
        <ActivityIndicator hasUnseenNotifications={hasUnseenNotifications} />
      </Flex>
      <Spacer y={1} />
    </Box>
  )
}
