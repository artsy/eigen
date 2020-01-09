import { Box, Button, Flex, Join, Separator, Serif, Spacer, Theme } from "@artsy/palette"
import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileQuery } from "__generated__/MyProfileQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { Alert, Image, NativeModules, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

export default class MyProfile extends React.Component {
  confirmLogout() {
    Alert.alert("Log out?", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => NativeModules.ARNotificationsManager.postNotificationName("ARUserRequestedLogout", {}),
      },
    ])
  }

  render() {
    return (
      <Theme>
        <Box mb={1} mt={2}>
          <Flex alignItems="center">
            <Serif size="5">Settings</Serif>
          </Flex>
        </Box>
        <Separator />
        <Box py={1} mx={2} mt={1}>
          <Join separator={<Spacer mb={2} />}>
            <Row title="Send Feedback" />
            <Row
              title="Personal Data Request"
              onPress={() => SwitchBoard.presentNavigationViewController(this, "privacy-request")}
            />
            <Box mt={2}>
              <UserProfileQueryRenderer />
              <Button variant="primaryBlack" block size="large" onPress={this.confirmLogout} mt={1}>
                Log out
              </Button>
            </Box>
          </Join>
        </Box>
      </Theme>
    )
  }
}

const Row: React.FC<{ title: string; onPress?: () => void }> = ({ title, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
      <Serif size="3t">{title}</Serif>
      <Image source={require("../../../../images/horizontal_chevron.png")} />
    </Flex>
  </TouchableWithoutFeedback>
)

interface UserProfileProps {
  me: MyProfile_me
}

class UserProfile extends React.Component<UserProfileProps> {
  render() {
    const { me } = this.props
    const loginInfo = !!me.name ? `${me.name} (${me.email})` : me.email
    return (
      <Serif size="3t" color="black60">
        Logged in as: {loginInfo}
      </Serif>
    )
  }
}

const UserProfileFragmentContainer = createFragmentContainer(UserProfile, {
  me: graphql`
    fragment MyProfile_me on Me {
      name
      email
    }
  `,
})

const UserProfileQueryRenderer: React.FC = () => (
  <QueryRenderer<MyProfileQuery>
    environment={defaultEnvironment}
    query={graphql`
      query MyProfileQuery {
        me {
          ...MyProfile_me
        }
      }
    `}
    variables={{}}
    render={renderWithLoadProgress(UserProfileFragmentContainer)}
  />
)
