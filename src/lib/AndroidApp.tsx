import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { Button, Flex, Theme } from "palette"
import React, { useEffect } from "react"
import { Linking, View } from "react-native"
import { authorize } from "react-native-app-auth"
import Config from "react-native-config"
import track from "react-tracking"
import { RelayEnvironmentProvider } from "relay-hooks"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { ModalStack } from "./navigation/ModalStack"
import { navigate } from "./navigation/navigate"
import { defaultEnvironment } from "./relay/createEnvironment"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { AdminMenuWrapper } from "./utils/AdminMenuWrapper"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"

const Main: React.FC<{}> = track()(({}) => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)

  const config = {
    issuer: "https://stagingapi.artsy.net",
    serviceConfiguration: {
      authorizationEndpoint: "https://stagingapi.artsy.net/oauth2/authorize",
      tokenEndpoint: "https://stagingapi.artsy.net/oauth2/access_token",
    },
    clientId: Config.ARTSY_API_CLIENT_KEY,
    redirectUrl: "artsy://oauth/callback",
    scopes: ["offline_access"],
    usePKCE: false,
    skipCodeExchange: false,
    useNonce: false,
  }

  useEffect(() => {
    // TODO: handle opening the app from deep link (Linking.getInitialURL)
    Linking.addEventListener("url", ({ url }) => navigate(url))
    return () => {
      Linking.removeAllListeners("url")
    }
  }, [])

  if (!isHydrated) {
    return <View></View>
  }
  if (!isLoggedIn) {
    return (
      <View>
        <Flex p="2" pt="1">
          <Button
            block
            onPress={async () => {
              try {
                const result = await authorize(config)
                console.log(result)
                // result includes accessToken, accessTokenExpirationDate and refreshToken
              } catch (error) {
                console.log(error)
              }
            }}
          >
            Login to Artsy
          </Button>
        </Flex>
      </View>
    )
  }

  return (
    <ModalStack>
      <BottomTabsNavigator></BottomTabsNavigator>
    </ModalStack>
  )
})

export const App = () => (
  <RelayEnvironmentProvider environment={defaultEnvironment}>
    <ProvideScreenDimensions>
      <Theme>
        <_FancyModalPageWrapper>
          <GlobalStoreProvider>
            <AdminMenuWrapper>
              <Main />
            </AdminMenuWrapper>
          </GlobalStoreProvider>
        </_FancyModalPageWrapper>
      </Theme>
    </ProvideScreenDimensions>
  </RelayEnvironmentProvider>
)
