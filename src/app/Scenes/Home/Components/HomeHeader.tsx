import { GlobalStore } from "app/store/GlobalStore"
import { ArtsyLogoIcon, Box, Flex, Spacer } from "palette"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = () => {
  const shouldDisplayActivityPanelIndicator = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.displayUnreadActivityPanelIndicator
  )

  return (
    <Box mb={1} mt={2}>
      <Flex alignItems="center">
        <ArtsyLogoIcon scale={0.75} />
        <ActivityIndicator hasNotifications={shouldDisplayActivityPanelIndicator} />
      </Flex>
      <Spacer mb="1" />
    </Box>
  )
}
