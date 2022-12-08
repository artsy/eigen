import { GlobalStore } from "app/store/GlobalStore"
import { ArtsyLogoIcon, Box, Flex, Spacer } from "palette"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = () => {
  const hasNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.unreadCounts.unreadActivityPanelNotifications > 0
  )

  return (
    <Box mb={1} mt={2}>
      <Flex alignItems="center">
        <ArtsyLogoIcon scale={0.75} />
        <ActivityIndicator hasNotifications={hasNotifications} />
      </Flex>
      <Spacer mb="1" />
    </Box>
  )
}
