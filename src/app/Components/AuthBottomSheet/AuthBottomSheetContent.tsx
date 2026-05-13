import { Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AuthIntent } from "app/Components/AuthBottomSheet/AuthBottomSheetTypes"
import { AuthContext } from "app/Scenes/Onboarding/Screens/Auth/AuthContext"
import { AuthScenes } from "app/Scenes/Onboarding/Screens/Auth/AuthScenes"

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

interface AuthBottomSheetContentProps {
  intent: AuthIntent
}

export const AuthBottomSheetContent: React.FC<AuthBottomSheetContentProps> = ({ intent }) => {
  return (
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
  )
}
