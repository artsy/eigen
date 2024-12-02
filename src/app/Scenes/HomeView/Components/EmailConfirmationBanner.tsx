import { Flex, Text, Spinner } from "@artsy/palette-mobile"
import { EmailConfirmationBanner_me$data } from "__generated__/EmailConfirmationBanner_me.graphql"
import { verifyEmail } from "app/utils/verifyEmail"
import { useState } from "react"
import { Image, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

export interface Props {
  me: EmailConfirmationBanner_me$data
  relay: RelayProp
}

export const EmailConfirmationBanner: React.FC<Props> = ({ me, relay }) => {
  const [shouldDisplayBanner, toggleVisible] = useState<boolean>(me?.canRequestEmailConfirmation)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [confirmed, setConfirmed] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("Tap here to verify your email address")

  const didTapSendConfirmationEmail = async () => {
    try {
      setLoading(true)

      const { sendConfirmationEmail } = await verifyEmail(relay.environment)
      const confirmationOrError = sendConfirmationEmail?.confirmationOrError
      const emailToConfirm = confirmationOrError?.unconfirmedEmail

      if (emailToConfirm) {
        setConfirmed(true)
        setMessage(`Email sent to ${emailToConfirm}`)
      } else {
        const mutationError = confirmationOrError?.mutationError

        switch (mutationError?.message || mutationError?.error) {
          case "email is already confirmed":
            setConfirmed(true)
            setMessage("Your email is already confirmed")
            break
          default:
            setMessage("Something went wrong. Try again?")
            break
        }
      }
    } catch (error) {
      console.error(error)
      setMessage("Something went wrong. Try again?")
    } finally {
      setLoading(false)
    }
  }

  if (shouldDisplayBanner) {
    return (
      <Flex
        px={2}
        py={1}
        backgroundColor="black100"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {isLoading ? (
          <>
            <Text variant="sm" color="white100">
              Sending a confirmation email...
            </Text>

            <Flex pr={1}>
              <Spinner size="small" color="white100" />
            </Flex>
          </>
        ) : (
          <TouchableWithoutFeedback onPress={confirmed ? undefined : didTapSendConfirmationEmail}>
            <Flex
              flexDirection="row"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text variant="sm" color="white100">
                {message}
              </Text>

              <TouchableWithoutFeedback onPress={() => toggleVisible(false)}>
                <Image source={require("images/close-x.webp")} />
              </TouchableWithoutFeedback>
            </Flex>
          </TouchableWithoutFeedback>
        )}
      </Flex>
    )
  } else {
    return null
  }
}

export const EmailConfirmationBannerFragmentContainer = createFragmentContainer(
  EmailConfirmationBanner,
  {
    me: graphql`
      fragment EmailConfirmationBanner_me on Me {
        canRequestEmailConfirmation
      }
    `,
  }
)
