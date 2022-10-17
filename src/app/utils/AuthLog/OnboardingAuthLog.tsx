import Clipboard from "@react-native-community/clipboard"
import { useNavigation } from "@react-navigation/native"
import { ReadMore } from "app/Components/ReadMore"
import { Button, Flex, Screen, ShareIcon, Text } from "palette"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { truncatedTextLimit } from "../hardware"
import { readAuthActions } from "./logAuthActions"

export const OnboardingAuthLog: React.FC = () => {
  const navigation = useNavigation()

  const [authLogJSON, setAuthLogJSON] = useState("")
  const textLimit = truncatedTextLimit()

  useEffect(() => {
    async function readJSON() {
      const authJSON = await readAuthActions()
      if (authJSON) {
        setAuthLogJSON(authJSON)
      }
    }
    if (!authLogJSON) {
      readJSON()
    }
  }, [])

  return (
    <Screen>
      <Screen.Header onBack={() => navigation.goBack()} />
      <Screen.Body>
        <ScrollView>
          <Flex justifyContent="center" flex={1}>
            {!!authLogJSON && (
              <ReadMore content={authLogJSON} maxChars={textLimit} textStyle="sans" />
            )}
            <Button
              onPress={() => {
                if (authLogJSON) {
                  Clipboard.setString(authLogJSON)
                }
              }}
              block
              haptic="impactMedium"
              mb={1}
              variant="outline"
              iconPosition="left-start"
              icon={<ShareIcon mr={1} />}
            >
              Copy to clipboard
            </Button>
          </Flex>
        </ScrollView>
        <Screen.SafeBottomPadding />
      </Screen.Body>
    </Screen>
  )
}
