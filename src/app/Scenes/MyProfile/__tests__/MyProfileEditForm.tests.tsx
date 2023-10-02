import * as Sentry from "@sentry/react-native"
import { fireEvent } from "@testing-library/react-native"
import { MyProfileEditFormTestsQuery } from "__generated__/MyProfileEditFormTestsQuery.graphql"
import { MyProfileEditForm } from "app/Scenes/MyProfile/MyProfileEditForm"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  }
})

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
}))

describe("MyProfileEditForm", () => {
  const { renderWithRelay } = setupTestWrapper<MyProfileEditFormTestsQuery>({
    Component: (props) => {
      if (props?.me) {
        return <MyProfileEditForm />
      }
      return null
    },
    query: graphql`
      query MyProfileEditFormTestsQuery @relay_test_operation {
        me {
          ...MyProfileEditForm_me
        }
      }
    `,
  })

  it("shows the profile verification section", () => {
    const { getByTestId } = renderWithRelay()
    expect(getByTestId("profile-verifications")).toBeDefined()
  })

  describe("Email Verification", () => {
    describe("when the email is verified in Gravity", () => {
      it("is shown as verified", async () => {
        const { getByText } = renderWithRelay({
          Me: () => ({
            canRequestEmailConfirmation: false,
            isEmailConfirmed: true,
          }),
        })
        expect(getByText("Email Address Verified")).toBeTruthy()
      })
    })

    describe("when the email is not verified in Gravity", () => {
      it("is shown as non verified", () => {
        const { getByText } = renderWithRelay({
          Me: () => ({
            canRequestEmailConfirmation: true,
            isEmailConfirmed: false,
          }),
        })
        expect(getByText("Verify Your Email")).toBeTruthy()
      })

      describe("when canRequestEmailConfirmation is set to true", () => {
        it("triggers the email verification when the user presses on Verify Your Email", async () => {
          const { getByTestId, env } = renderWithRelay({
            Me: () => ({
              canRequestEmailConfirmation: true,
              isEmailConfirmed: false,
            }),
          })
          const VerifyYouEmailButton = getByTestId("verify-your-email")
          expect(VerifyYouEmailButton).toBeTruthy()

          fireEvent(VerifyYouEmailButton, "onPress")

          env.mock.resolveMostRecentOperation({
            data: {
              sendConfirmationEmail: {
                confirmationOrError: {
                  __typename: "SendConfirmationEmailMutationSuccess",
                  unconfirmedEmail: "i.am.unconfirmed@gmail.com",
                },
              },
            },
            errors: [],
          })

          await flushPromiseQueue()

          expect(getByTestId("verification-confirmation-banner")).toBeTruthy()
        })
      })

      describe("when canRequestEmailConfirmation is set to false", () => {
        it("does not allow the user to request email verification", async () => {
          const { getByTestId } = renderWithRelay({
            Me: () => ({
              canRequestEmailConfirmation: false,
              isEmailConfirmed: false,
            }),
          })
          const VerifyYouEmailButton = getByTestId("verify-your-email")
          expect(VerifyYouEmailButton).toBeTruthy()

          fireEvent(VerifyYouEmailButton, "onPress")

          await flushPromiseQueue()

          expect(() => getByTestId("verification-confirmation-banner")).toThrow()
        })
      })
    })
  })

  describe("ID Verification", () => {
    it("is shown as verified when it's verified in gravity", () => {
      const { getByText } = renderWithRelay({
        Me: () => ({
          isIdentityVerified: true,
        }),
      })
      expect(getByText("ID Verified")).toBeTruthy()
    })
    it("is shown as non verified when it's not verified in gravity", () => {
      const { getByText } = renderWithRelay({
        Me: () => ({
          isIdentityVerified: false,
        }),
      })
      expect(getByText("Verify Your ID")).toBeTruthy()
    })

    describe("requesting IDV", () => {
      describe("with successful IDV request", () => {
        it("displays confirmation banner ", async () => {
          const { getByText, env } = renderWithRelay({
            Me: () => ({
              isIdentityVerified: false,
            }),
          })
          const VerifyIdentityButton = getByText("Verify Your ID")
          expect(VerifyIdentityButton).toBeTruthy()

          fireEvent(VerifyIdentityButton, "onPress")

          env.mock.resolveMostRecentOperation({
            data: {
              sendIdentityVerificationEmail: {
                confirmationOrError: {
                  __typename: "IdentityVerificationEmailMutationSuccessType",
                  identityVerification: {
                    state: "pending",
                  },
                },
              },
            },
            errors: [],
          })

          await flushPromiseQueue()

          expect(getByText("ID verification link sent to", { exact: false })).toBeTruthy()
        })
      })

      describe("with IDV request that returns structured error", () => {
        // This isn't _good_ behavior, but it is what is currently happening
        it("fails silently", async () => {
          const { getByText, env } = renderWithRelay({
            Me: () => ({
              isIdentityVerified: false,
            }),
          })
          const VerifyIdentityButton = getByText("Verify Your ID")
          expect(VerifyIdentityButton).toBeTruthy()

          fireEvent(VerifyIdentityButton, "onPress")

          env.mock.resolveMostRecentOperation({
            data: {
              sendIdentityVerificationEmail: {
                confirmationOrError: {
                  __typename: "IdentityVerificationEmailMutationFailureType",
                  mutationError: {
                    error: null,
                    message: "name required to create verification for a non-artsy user",
                  },
                },
              },
            },
            errors: [],
          })

          await flushPromiseQueue()

          expect(() => getByText("ID verification link sent to", { exact: false })).toThrow()
          expect(Sentry.captureException).not.toHaveBeenCalled()
        })
      })

      describe("with IDV request that errors", () => {
        it("logs exception", async () => {
          const relayResponse = {
            errors: [
              {
                message:
                  'String cannot represent value: { detail: { base: [Array] }, message: "Only one source type (sale, order, user/admin id) is allowed.", type: "param_error" }',
                locations: [
                  {
                    line: 16,
                    column: 19,
                  },
                ],
                // @ts-ignore
                path: [
                  "sendIdentityVerificationEmail",
                  "confirmationOrError",
                  "mutationError",
                  "message",
                ],
              },
            ],
            data: {
              sendIdentityVerificationEmail: {
                confirmationOrError: {
                  __typename: "IdentityVerificationEmailMutationFailureType",
                  mutationError: null,
                },
              },
            },
          }
          const { getByText, env } = renderWithRelay({
            Me: () => ({
              isIdentityVerified: false,
            }),
          })
          const VerifyIdentityButton = getByText("Verify Your ID")
          expect(VerifyIdentityButton).toBeTruthy()

          fireEvent(VerifyIdentityButton, "onPress")

          env.mock.resolveMostRecentOperation(relayResponse)

          await flushPromiseQueue()

          expect(() => getByText("ID verification link sent to", { exact: false })).toThrow()
          expect(Sentry.captureException).toHaveBeenCalledWith(relayResponse.errors)
        })
      })
    })
  })

  describe("Complete your profile banner", () => {
    it("shows when the user has empty fields in their profile", () => {
      const { getByText } = renderWithRelay({
        Me: () => ({ collectorProfile: { isProfileComplete: false } }),
      })

      expect(getByText("Complete your profile and make a great impression")).toBeTruthy()
    })

    it("does not show when the user has completed their profile", () => {
      const { queryByText } = renderWithRelay({
        Me: () => ({ collectorProfile: { isProfileComplete: true } }),
      })

      expect(queryByText("Complete your profile and make a great impression")).toBeFalsy()
    })
  })
})
