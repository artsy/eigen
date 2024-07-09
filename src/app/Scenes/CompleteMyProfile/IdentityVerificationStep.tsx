import { Text, Screen, Button, Spacer, Flex, useSpace, CheckIcon } from "@artsy/palette-mobile"
import { useCompleteMyProfileContext } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/useCompleteProfile"
import { useHandleIDVerification } from "app/Scenes/MyProfile/useHandleVerification"
import { navigate } from "app/system/navigation/navigate"

export const IdentityVerificationStep = () => {
  const space = useSpace()
  const { goNext, isCurrentRouteDirty, field, setField } = useCompleteProfile()
  const { user } = useCompleteMyProfileContext()
  const { handleVerification } = useHandleIDVerification(user?.internalID ?? "")

  const handleSendVerification = () => {
    handleVerification()
    setField(true)
  }

  return (
    <Screen>
      <Screen.Body>
        <Flex flexGrow={100}>
          <Text variant="lg-display">Verify your ID</Text>

          <Spacer y={1} />

          <Flex gap={space(2)}>
            <Text color="black60">
              Send an ID verification email and follow the link and instructions to verify your
              account.
            </Text>

            {!field ? (
              <Button onPress={handleSendVerification}>Send verification Email</Button>
            ) : (
              <Button icon={<CheckIcon fill="white100" />} variant="fillSuccess">
                Email sent
              </Button>
            )}

            <Text color="black60">
              Identify Verification is required for some transactions. For more details, see our
              <Text
                style={{ textDecorationLine: "underline" }}
                onPress={() => navigate(`https://www.artsy.net/identity-verification-faq`)}
                suppressHighlighting
              >
                {` FAQs`}
              </Text>
              .
            </Text>
          </Flex>

          {!!field && (
            <Flex flex={1} justifyContent="flex-end">
              <Text color="white100" backgroundColor="green100" py={1} px={2}>
                ID verification email sent to {user?.email}.
              </Text>
            </Flex>
          )}
        </Flex>

        <Footer isFormDirty={isCurrentRouteDirty} onGoNext={goNext} />
      </Screen.Body>
    </Screen>
  )
}
