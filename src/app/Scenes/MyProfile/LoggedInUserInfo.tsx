import { Box, Text } from "@artsy/palette-mobile"
import { LoggedInUserInfoQuery } from "__generated__/LoggedInUserInfoQuery.graphql"
import { LoggedInUserInfo_me$data } from "__generated__/LoggedInUserInfo_me.graphql"
import Spinner from "app/Components/Spinner"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface UserProfileProps {
  me: LoggedInUserInfo_me$data
}

class UserProfile extends React.Component<UserProfileProps> {
  render() {
    const { me } = this.props
    const loginInfo = !!me.name ? `${me.name} (${me.email})` : me.email
    return <Text variant="sm">Logged in as: {loginInfo}</Text>
  }
}

const UserProfileFragmentContainer = createFragmentContainer(UserProfile, {
  me: graphql`
    fragment LoggedInUserInfo_me on Me {
      name
      email
    }
  `,
})

export const UserProfileQueryRenderer: React.FC = () => (
  <QueryRenderer<LoggedInUserInfoQuery>
    environment={getRelayEnvironment()}
    query={graphql`
      query LoggedInUserInfoQuery {
        me {
          ...LoggedInUserInfo_me
        }
      }
    `}
    variables={{}}
    render={({ error, props }) => {
      if (error) {
        return null
      } else if (props) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return <UserProfileFragmentContainer me={props.me!} />
      } else {
        return (
          <Box mb={1}>
            <Spinner />
          </Box>
        )
      }
    }}
  />
)
