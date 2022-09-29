import { HomeHeader_me$key } from "__generated__/HomeHeader_me.graphql"
import { ArtsyLogoIcon, Box, Flex, Spacer } from "palette"
import { graphql, useFragment } from "react-relay"
import { ActivityIndicator } from "./ActivityIndicator"

interface HomeHeaderProps {
  me: HomeHeader_me$key | null
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ me }) => {
  const data = useFragment(homeHeaderFragment, me)
  const hasNotifications = (data?.unreadNotificationsCount ?? 0) > 0

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

const homeHeaderFragment = graphql`
  fragment HomeHeader_me on Me {
    unreadNotificationsCount
  }
`
