import { OwnerType } from "@artsy/cohesion"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileQuery } from "__generated__/MyProfileQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { MyCollectionPlaceholder } from "../MyCollection/MyCollection"
import { MyCollectionArtworkForm } from "../MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { MyProfileEditFormQueryRenderer } from "./MyProfileEditForm"
import { MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer } from "./MyProfileHeaderMyCollectionAndSavedWorks"
import { MyProfileProvider } from "./MyProfileProvider"

// This needs to be a `type` rather than an `interface` because there's
// a long-standing thing where a typescript `interface` will be treated a bit more strictly
// than the equivalent `type` in some situations.
// https://github.com/microsoft/TypeScript/issues/15300
// The react-navigation folks have written code that relies on the more permissive `type` behaviour.
// tslint:disable-next-line:interface-over-type-literal
export type MyProfileScreen = {
  MyProfileHeaderMyCollectionAndSavedWorks: {
    userProfileImagePath?: string
  }
  MyCollectionArtworkForm: undefined
}

export const LOCAL_PROFILE_ICON_PATH_KEY = "LOCAL_PROFILE_ICON_PATH_KEY"

export const MyProfile: React.FC<{ me?: MyProfile_me }> = ({ me }) => {
  return (
    <NavigationContainer independent>
      <Stack.Navigator
        // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
          cardStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen
          name="MyProfileHeaderMyCollectionAndSavedWorks"
          component={MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer}
          initialParams={{ userProfileImagePath: me?.icon?.url }}
        />
        <Stack.Screen name="MyCollectionArtworkForm" component={MyCollectionArtworkForm} />
        <Stack.Screen name="MyProfileEditForm" component={MyProfileEditFormQueryRenderer} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const Stack = createStackNavigator()

export const MyProfileFragmentContainer = createFragmentContainer(MyProfile, {
  me: graphql`
    fragment MyProfile_me on Me {
      name
      bio
      icon {
        url(version: "thumbnail")
      }
      ...MyProfileHeaderMyCollectionAndSavedWorks_me
      ...MyProfileEditForm_me
    }
  `,
})

export const MyProfileScreenQuery = graphql`
  query MyProfileQuery {
    me @optionalField {
      ...MyProfileHeaderMyCollectionAndSavedWorks_me
      ...MyProfile_me
    }
  }
`

export const MyProfileQueryRenderer: React.FC<{}> = ({}) => (
  <ProvideScreenTrackingWithCohesionSchema
    info={screen({ context_screen_owner_type: OwnerType.profile })}
  >
    <MyProfileProvider>
      <QueryRenderer<MyProfileQuery>
        environment={defaultEnvironment}
        query={MyProfileScreenQuery}
        render={renderWithPlaceholder({
          Container: MyProfileFragmentContainer,
          renderPlaceholder: () => <MyCollectionPlaceholder />,
        })}
        variables={{}}
      />
    </MyProfileProvider>
  </ProvideScreenTrackingWithCohesionSchema>
)
