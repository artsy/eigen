import { Sans } from "@artsy/palette"
import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileQuery } from "__generated__/MyProfileQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React from "react"
import { NativeModules, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { SettingsOld } from "./SettingsOld"

const MyProfile: React.FC<{ me: MyProfile_me }> = ({ me }) => {
  return (
    <View>
      <Sans size="8">{me.name}</Sans>
    </View>
  )
}

const MyProfileContainer = createFragmentContainer(MyProfile, {
  me: graphql`
    fragment MyProfile_me on Me {
      name
    }
  `,
})

export const MyProfileQueryRenderer: React.FC<{}> = ({}) => {
  return NativeModules.Emission.options.AROptionsEnableNewProfileTab ? (
    <QueryRenderer<MyProfileQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyProfileQuery {
          me {
            ...MyProfile_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyProfileContainer,
        renderPlaceholder: () => <Sans size="3">placeholder</Sans>,
      })}
      variables={{}}
    />
  ) : (
    <SettingsOld />
  )
}
