import { Serif } from "@artsy/palette"
import { LoggedInUserInfo_me } from "__generated__/LoggedInUserInfo_me.graphql"
import { LoggedInUserInfoQuery } from "__generated__/LoggedInUserInfoQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface UserProfileProps {
  me: LoggedInUserInfo_me
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
    fragment LoggedInUserInfo_me on Me {
      name
      email
    }
  `,
})

export const UserProfileQueryRenderer: React.FC = () => (
  <QueryRenderer<LoggedInUserInfoQuery>
    environment={defaultEnvironment}
    query={graphql`
      query LoggedInUserInfoQuery {
        me {
          ...LoggedInUserInfo_me
        }
      }
    `}
    variables={{}}
    render={renderWithLoadProgress(UserProfileFragmentContainer)}
  />
)
