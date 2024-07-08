import { Text, Screen, Spacer, Input, Flex } from "@artsy/palette-mobile"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/useCompleteProfile"
import { KeyboardAvoidingView } from "react-native"

export const ProfessionStep = () => {
  const { goNext, isCurrentRouteDirty, field, setField } = useCompleteProfile<string>()

  const handleOnChange = (text: string) => {
    setField(text)
  }

  return (
    <Screen safeArea={false}>
      <Screen.Body pt={2}>
        <KeyboardAvoidingView behavior="padding">
          <Flex justifyContent="space-between" height="100%">
            <Flex>
              <Text variant="lg-display">Add your profession</Text>

              <Spacer y={1} />

              <Text color="black60">
                Accelerate conversations with galleries by providing quick insights into your
                background.
              </Text>

              <Spacer y={2} />

              <Input
                aria-label="Profession"
                placeholder="Profession"
                title="Profession"
                autoFocus
                value={field}
                onChangeText={handleOnChange}
              />
            </Flex>

            <Footer isFormDirty={isCurrentRouteDirty} onGoNext={goNext} />
          </Flex>
        </KeyboardAvoidingView>
      </Screen.Body>
    </Screen>
  )
}
