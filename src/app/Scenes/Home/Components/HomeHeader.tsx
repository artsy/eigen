import { HomeHeader_me$data } from "__generated__/HomeHeader_me.graphql"
import { ArtsyLogoIcon, Box, Flex, Spacer } from "palette"
import { createFragmentContainer, graphql } from "react-relay"
import { ActivityIndicator } from "../ActivityIndicator"

interface HomeHeaderProps {
  me: HomeHeader_me$data | null
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ me }) => {
  const hasNotifications = (me?.unreadNotificationsCount ?? 0) > 0

  return (
    <Box mb={1} mt={2}>
      <Flex alignItems="center">
        <ArtsyLogoIcon scale={0.75} />
        <ActivityIndicator hasNotifications={hasNotifications} />
      </Flex>
      <Spacer mb="15px" />
      <Spacer mb="2" />
    </Box>
  )
}

export const HomeHeaderFragmentContainer = createFragmentContainer(HomeHeader, {
  me: graphql`
    fragment HomeHeader_me on Me {
      unreadNotificationsCount
    }
  `,
})
