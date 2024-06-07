import { Text, Screen, Button } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { CompleteMyProfileNavigationStack } from "app/Scenes/MyProfile/CompleteMyProfile"
import { useCompleteMyProfileContext } from "app/Scenes/MyProfile/CompleteMyProfileProvider"
import { getNextRoute } from "app/Scenes/MyProfile/hooks/useProfileCompletion"

const CURRENT_STEP = "AVATAR"

export const MyProfileCompleteAvatar = () => {
  const { navigate } = useNavigation<CompleteMyProfileNavigationStack>()
  const { steps } = useCompleteMyProfileContext()

  const nextRoute = getNextRoute(CURRENT_STEP, steps)

  console.log("steps from Avatar", steps)

  return (
    <Screen>
      <Screen.Body>
        <Text my={4}>Avatar</Text>

        {/* TODO: maybe abstract the navigation and the Save & Exit into a hook */}
        <Button
          onPress={() => {
            if (nextRoute !== "none") {
              navigate(nextRoute, {})
            }
          }}
        >
          Next
        </Button>
      </Screen.Body>
    </Screen>
  )
}
