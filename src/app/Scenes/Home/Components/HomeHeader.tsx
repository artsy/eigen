import { Spacer } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { ArtsyLogoIcon, Box, Flex } from "palette"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = () => {
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.displayUnseenNotificationsIndicator
  )

  return (
    <Box mb={1} mt={2}>
      <Flex alignItems="center">
        <ArtsyLogoIcon scale={0.75} />
        <ActivityIndicator hasUnseenNotifications={hasUnseenNotifications} />
      </Flex>
      <Spacer mb="1" />
    </Box>
  )
}
