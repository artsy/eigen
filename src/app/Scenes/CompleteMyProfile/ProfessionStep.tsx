import { Text, Screen, Spacer, Input, Flex } from "@artsy/palette-mobile"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { FC, useRef } from "react"
import { KeyboardAvoidingView } from "react-native"

export const ProfessionStep: FC = () => {
  const ref = useRef<Input>(null)
  const { goNext } = useCompleteProfile()

  const profession = CompleteMyProfileStore.useStoreState((state) => state.progressState.profession)
  const setProgressState = CompleteMyProfileStore.useStoreActions(
    (actions) => actions.setProgressState
  )

  const handleOnChange = (text: string) => {
    setProgressState({ type: "profession", value: text })
  }

  return (
    <Screen safeArea={false}>
      <Screen.Body pt={2} fullwidth>
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, justifyContent: "space-between" }}
        >
          <Flex px={2} onLayout={() => ref.current?.focus()}>
            <Text variant="lg-display">Add your profession</Text>

            <Spacer y={1} />

            <Text color="mono60">
              Accelerate conversations with galleries by providing quick insights into your
              background.
            </Text>

            <Spacer y={2} />

            <Input
              aria-label="Profession"
              placeholder="Profession"
              title="Profession"
              value={profession as string}
              onChangeText={handleOnChange}
              // Android keyboard doesn't work so great with autofocus prop, slower devices don't measure 100% right the layout
              ref={ref}
            />
          </Flex>

          <Footer isFormDirty={!!profession} onGoNext={goNext} />
        </KeyboardAvoidingView>
      </Screen.Body>
    </Screen>
  )
}
