import { CheckmarkIcon } from "@artsy/icons/native"
import { Button, Flex, LinkText, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { IdentityVerificationStep_me$key } from "__generated__/IdentityVerificationStep_me.graphql"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { useCompleteMyProfileSteps } from "app/Scenes/CompleteMyProfile/hooks/useCompleteMyProfileSteps"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { useHandleIDVerification } from "app/Scenes/MyProfile/useHandleVerification"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

export const IdentityVerificationStep: FC = () => {
  const { goNext } = useCompleteProfile()
  const { me } = useCompleteMyProfileSteps()
  const data = useFragment<IdentityVerificationStep_me$key>(fragment, me)
  const { handleVerification } = useHandleIDVerification(data?.internalID ?? "")

  const isIdentityVerified = CompleteMyProfileStore.useStoreState(
    (state) => state.progressState.isIdentityVerified
  )
  const setProgressState = CompleteMyProfileStore.useStoreActions(
    (actions) => actions.setProgressState
  )

  const handleSendVerification = () => {
    handleVerification()
    setProgressState({ type: "isIdentityVerified", value: true })
  }

  return (
    <Screen safeArea={false}>
      <Screen.Body pt={2} fullwidth disableKeyboardAvoidance>
        <Flex flex={1} justifyContent="space-between">
          <Flex flex={1} justifyContent="space-between" px={2}>
            <Flex flexDirection="row" flexWrap="wrap">
              <Text variant="lg-display">Verify your ID</Text>

              <Spacer y={1} />

              <Flex gap={2}>
                <Text color="mono60">
                  Send an ID verification email and follow the link and instructions to verify your
                  account.
                </Text>

                {!isIdentityVerified ? (
                  <Button onPress={handleSendVerification}>Send verification Email</Button>
                ) : (
                  <Button icon={<CheckmarkIcon fill="mono0" />} variant="fillSuccess">
                    Email sent
                  </Button>
                )}

                <Flex flexDirection="row" flexWrap="wrap">
                  <Text color="mono60">
                    Identify Verification is required for some transactions. For more details, see
                    our{" "}
                    <LinkText
                      color="mono60"
                      onPress={() => {
                        navigate("https://www.artsy.net/identity-verification-faq")
                      }}
                    >
                      FAQs
                    </LinkText>
                    .
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            {!!isIdentityVerified && (
              <Text color="mono0" backgroundColor="green100" py={1} px={2}>
                ID verification email sent to {data?.email}.
              </Text>
            )}
          </Flex>

          <Footer isFormDirty={!!isIdentityVerified} onGoNext={goNext} />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

const fragment = graphql`
  fragment IdentityVerificationStep_me on Me {
    internalID @required(action: NONE)
    email @required(action: NONE)
  }
`
