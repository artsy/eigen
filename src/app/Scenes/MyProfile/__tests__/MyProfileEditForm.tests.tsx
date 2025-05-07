import * as Sentry from "@sentry/react-native"
import { fireEvent, screen } from "@testing-library/react-native"
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
    renderWithRelay()
    expect(screen.getByTestId("profile-verifications")).toBeDefined()
  })

  describe("Email Verification", () => {
    describe("when the email is verified in Gravity", () => {
      it("is shown as verified", async () => {
        renderWithRelay({
          Me: () => ({
            canRequestEmailConfirmation: false,
            isEmailConfirmed: true,
          }),
        })
        expect(screen.getByText("Email verified")).toBeTruthy()
      })
    })

    describe("when the email is not verified in Gravity", () => {
      it("is shown as non verified", () => {
        renderWithRelay({
          Me: () => ({
            canRequestEmailConfirmation: true,
            isEmailConfirmed: false,
          }),
        })
        expect(screen.getByText("Verify your email")).toBeTruthy()
      })

      describe("when canRequestEmailConfirmation is set to true", () => {
        it("triggers the email verification when the user presses on Verify your email", async () => {
          const { env } = renderWithRelay({
            Me: () => ({
              canRequestEmailConfirmation: true,
              isEmailConfirmed: false,
            }),
          })
          const VerifyYouEmailButton = screen.getByTestId("verify-your-email")
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

          expect(screen.getByTestId("verification-confirmation-banner")).toBeTruthy()
        })
      })

      describe("when canRequestEmailConfirmation is set to false", () => {
        it("does not allow the user to request email verification", async () => {
          renderWithRelay({
            Me: () => ({
              canRequestEmailConfirmation: false,
              isEmailConfirmed: false,
            }),
          })
          const VerifyYouEmailButton = screen.getByTestId("verify-your-email")
          expect(VerifyYouEmailButton).toBeTruthy()

          fireEvent(VerifyYouEmailButton, "onPress")

          await flushPromiseQueue()

          expect(() => screen.getByTestId("verification-confirmation-banner")).toThrow()
        })
      })
    })
  })

  describe("ID Verification", () => {
    it("is shown as verified when it's verified in gravity", () => {
      renderWithRelay({
        Me: () => ({
          isIdentityVerified: true,
        }),
      })
      expect(screen.getByText("ID Verified")).toBeTruthy()
    })
    it("is shown as non verified when it's not verified in gravity", () => {
      renderWithRelay({
        Me: () => ({
          isIdentityVerified: false,
        }),
      })
      expect(screen.getByText("Verify your ID")).toBeTruthy()
    })

    describe("requesting IDV", () => {
      describe("with successful IDV request", () => {
        it("displays confirmation banner ", async () => {
          const { env } = renderWithRelay({
            Me: () => ({
              isIdentityVerified: false,
            }),
          })
          const VerifyIdentityButton = screen.getByText("Verify your ID")
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

          expect(screen.getByText("ID verification link sent to", { exact: false })).toBeTruthy()
        })
      })

      describe("with IDV request that returns structured error", () => {
        // This isn't _good_ behavior, but it is what is currently happening
        it("fails silently", async () => {
          const { env } = renderWithRelay({
            Me: () => ({
              isIdentityVerified: false,
            }),
          })
          const VerifyIdentityButton = screen.getByText("Verify your ID")
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

          expect(() => screen.getByText("ID verification link sent to", { exact: false })).toThrow()
          expect(Sentry.captureMessage).not.toHaveBeenCalled()
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
          const { env } = renderWithRelay({
            Me: () => ({
              isIdentityVerified: false,
            }),
          })
          const VerifyIdentityButton = screen.getByText("Verify your ID")
          expect(VerifyIdentityButton).toBeTruthy()

          fireEvent(VerifyIdentityButton, "onPress")

          env.mock.resolveMostRecentOperation(relayResponse)

          await flushPromiseQueue()

          expect(() => screen.getByText("ID verification link sent to", { exact: false })).toThrow()
          expect(Sentry.captureMessage).toHaveBeenCalledWith(
            `useHandleIDVerification ${JSON.stringify(relayResponse.errors)}`
          )
        })
      })
    })
  })

  describe("Complete your profile banner", () => {
    it("shows when the user has empty fields in their profile", () => {
      renderWithRelay({
        Me: () => ({ collectorProfile: { isProfileComplete: false } }),
      })

      expect(screen.getByText("Complete your profile and make a great impression")).toBeTruthy()
    })

    it("does not show when the user has completed their profile", () => {
      renderWithRelay({
        Me: () => ({ collectorProfile: { isProfileComplete: true } }),
      })

      expect(screen.queryByText("Complete your profile and make a great impression")).toBeFalsy()
    })
  })
})
