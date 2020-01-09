import { Serif } from "@artsy/palette"
import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileQuery } from "__generated__/MyProfileQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

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

export const UserProfileQueryRenderer: React.FC = () => (
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
