import { Spacer, ArtsyLogoBlackIcon, Flex, Box, Text } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = () => {
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.hasUnseenNotifications
  )

  return (
    <Box mb={1} mt={2}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Text ml={2} color="blue100" weight="medium">
          New
        </Text>
        <ArtsyLogoBlackIcon scale={0.75} />
        <ActivityIndicator hasUnseenNotifications={hasUnseenNotifications} />
      </Flex>
      <Spacer y={1} />
    </Box>
  )
}
