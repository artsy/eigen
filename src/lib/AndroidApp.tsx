import { AndroidAppQuery } from "__generated__/AndroidAppQuery.graphql"
import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { Button, Flex, Text, Theme } from "palette"
import React from "react"
import { ActivityIndicator, View } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import track from "react-tracking"
import { LogIn } from "./LogIn/LogIn"
import { defaultEnvironment } from "./relay/createEnvironment"

const Main: React.FC<{}> = track()(({}) => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const authState = GlobalStore.useAppState((state) => state.auth)

  if (!isHydrated) {
    return <View></View>
  }
  if (!isLoggedIn) {
    return <LogIn></LogIn>
  }
  return (
    <Flex py="6" px="2">
      <Text variant="largeTitle">
        Hello <MyName />
      </Text>
      <Text my="2">
        Your user id is <Text variant="mediumText">{authState.userID}</Text>
      </Text>
      <Button
        block
        onPress={() => {
          GlobalStore.actions.auth.signOut()
        }}
      >
        Log out
      </Button>
    </Flex>
  )
})

const MyName: React.FC = () => {
  return (
    <QueryRenderer<AndroidAppQuery>
      environment={defaultEnvironment}
      query={graphql`
        query AndroidAppQuery {
          me {
            name
          }
        }
      `}
      render={(props) => {
        if (props.props?.me) {
          return <Text>{props.props.me.name}</Text>
        }
        if (props.error) {
          console.error(props.error)
          return <Text>{JSON.stringify(props.error)}</Text>
        }
        return <ActivityIndicator />
      }}
      variables={{}}
    />
  )
}

export const App = () => (
  <Theme>
    <GlobalStoreProvider>
      <Main />
    </GlobalStoreProvider>
  </Theme>
)
