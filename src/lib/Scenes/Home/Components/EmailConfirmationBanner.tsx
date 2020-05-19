import { color, Flex, Sans, SansProps, Spinner } from "@artsy/palette"
import React, { FC, useState } from "react"
import { Image, TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { Environment } from "relay-runtime"

import { EmailConfirmationBanner_me } from "__generated__/EmailConfirmationBanner_me.graphql"
import {
  EmailConfirmationBannerMutation,
  EmailConfirmationBannerMutationResponse,
} from "__generated__/EmailConfirmationBannerMutation.graphql"

type UnconfirmedEmail = string | null | undefined

const Text: FC<Partial<SansProps>> = props => <Sans color="white100" size="3t" {...props} />

export interface Props {
  me: EmailConfirmationBanner_me
  relay: RelayProp
}

const submitMutation = async (relayEnvironment: Environment) => {
  return new Promise<EmailConfirmationBannerMutationResponse>((done, reject) => {
    commitMutation<EmailConfirmationBannerMutation>(relayEnvironment, {
      onCompleted: (data, errors) => (errors && errors.length ? reject(errors) : done(data)),
      onError: error => reject(error),
      mutation: graphql`
        mutation EmailConfirmationBannerMutation {
          sendConfirmationEmail(input: {}) {
            confirmationOrError {
              ... on SendConfirmationEmailMutationSuccess {
                unconfirmedEmail
              }
              ... on SendConfirmationEmailMutationFailure {
                mutationError {
                  error
                  message
                }
              }
            }
          }
        }
      `,
      variables: {},
    })
  })
}

export const EmailConfirmationBanner: React.FC<Props> = ({ me, relay }) => {
  const [shouldDisplayBanner, toggleVisible] = useState<boolean>(me.canRequestEmailConfirmation)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<UnconfirmedEmail>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const didTapResend = async () => {
    try {
      setLoading(true)

      const { sendConfirmationEmail } = await submitMutation(relay.environment)
      const confirmationOrError = sendConfirmationEmail?.confirmationOrError
      const emailToConfirm = confirmationOrError?.unconfirmedEmail

      if (emailToConfirm) {
        setUnconfirmedEmail(emailToConfirm)
      } else {
        const mutationError = confirmationOrError?.mutationError
        const message = mutationError?.message || mutationError?.error

        switch (message) {
          case "email is already confirmed":
            setErrorMessage("Your email is already confirmed")
            break
          default:
            setErrorMessage("Something went wrong. Try again?")
            break
        }
      }
    } catch (error) {
      console.error(error)
      setErrorMessage("Something went wrong. Try again?")
    } finally {
      setLoading(false)
    }
  }

  if (shouldDisplayBanner) {
    return (
      <Flex
        px="2"
        py="1"
        background={color("black100")}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {isLoading ? (
          <>
            <Text>Sending an confirmation email...</Text>

            <Flex pr="1">
              <Spinner size="small" color="white100" />
            </Flex>
          </>
        ) : (
          <TouchableWithoutFeedback onPress={unconfirmedEmail ? undefined : didTapResend}>
            <Flex flexDirection="row" width="100%" justifyContent="space-between" alignItems="center">
              <Text>
                {unconfirmedEmail
                  ? `Email sent to ${unconfirmedEmail}`
                  : errorMessage || "Tap here to verify your email address"}
              </Text>

              <TouchableWithoutFeedback onPress={() => toggleVisible(false)}>
                <Image source={require("../../../../../images/close-x.png")} />
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

export const EmailConfirmationBannerFragmentContainer = createFragmentContainer(EmailConfirmationBanner, {
  me: graphql`
    fragment EmailConfirmationBanner_me on Me {
      canRequestEmailConfirmation
    }
  `,
})
