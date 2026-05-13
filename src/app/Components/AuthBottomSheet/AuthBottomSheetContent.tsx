import { Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { ArtsyWebViewPage } from "app/Components/ArtsyWebView"
import { AuthIntent } from "app/Components/AuthBottomSheet/AuthBottomSheetTypes"
import { useNavigationTheme } from "app/Navigation/useNavigationTheme"
import { AuthContext } from "app/Scenes/Onboarding/Screens/Auth/AuthContext"
import { AuthScenes } from "app/Scenes/Onboarding/Screens/Auth/AuthScenes"
import type { OnboardingWebViewRoute } from "app/Scenes/Onboarding/Screens/OnboardingWebView"

const INTENT_COPY: Record<AuthIntent, string> = {
  save_artwork: "Sign up or log in to save artworks",
  follow_artist: "Sign up or log in to follow artists",
  contact_gallery: "Sign up or log in to contact the gallery",
  make_offer: "Sign up or log in to make an offer",
  bid: "Sign up or log in to place a bid",
  purchase: "Sign up or log in to purchase",
  create_alert: "Sign up or log in to create an alert",
  generic: "Sign up or log in",
}

type AuthSheetStack = {
  AuthMain: undefined
  OnboardingWebView: { url: OnboardingWebViewRoute }
}

const Stack = createStackNavigator<AuthSheetStack>()

interface AuthBottomSheetContentProps {
  intent: AuthIntent
}

export const AuthBottomSheetContent: React.FC<AuthBottomSheetContentProps> = ({ intent }) => {
  const theme = useNavigationTheme()

  return (
    <NavigationIndependentTree>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AuthMain">
            {() => (
              <BottomSheetView>
                <AuthContext.Provider>
                  <Flex px={2} pt={2}>
                    <Text variant="sm-display" textAlign="center">
                      {INTENT_COPY[intent]}
                    </Text>
                  </Flex>
                  <AuthScenes />
                </AuthContext.Provider>
              </BottomSheetView>
            )}
          </Stack.Screen>
          <Stack.Screen name="OnboardingWebView">
            {({ route, navigation }) => (
              <ArtsyWebViewPage url={route.params.url} backAction={() => navigation.goBack()} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}
