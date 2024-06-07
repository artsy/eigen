import { Text, Screen, Spacer, Input } from "@artsy/palette-mobile"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { Header } from "app/Scenes/CompleteMyProfile/Header"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/useCompleteProfile"

export const ProfessionStep = () => {
  const { goNext, isCurrentRouteDirty, field, setField } = useCompleteProfile<string>()

  const handleOnChange = (text: string) => {
    setField(text)
  }

  return (
    <Screen>
      <Screen.Body>
        <Header />

        <Spacer y={2} />

        <Text variant="lg-display">Add your profession</Text>

        <Spacer y={1} />

        <Text color="black60">
          Accelerate conversations with galleries by providing quick insights into your background.
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

        <Footer isFormDirty={isCurrentRouteDirty} onGoNext={goNext} />
      </Screen.Body>
    </Screen>
  )
}
