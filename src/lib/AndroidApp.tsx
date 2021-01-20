import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { Button, Flex, Text, Theme } from "palette"
import React from "react"
import { View } from "react-native"
import track from "react-tracking"
import { LogIn } from "./LogIn/LogIn"

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
      <Text variant="largeTitle">Hello</Text>
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

export const App = () => (
  <Theme>
    <GlobalStoreProvider>
      <Main />
    </GlobalStoreProvider>
  </Theme>
)
