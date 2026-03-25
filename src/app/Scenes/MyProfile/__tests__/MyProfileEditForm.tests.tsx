import * as Sentry from "@sentry/react-native"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { MyProfileEditFormTestsQuery } from "__generated__/MyProfileEditFormTestsQuery.graphql"
import { MyProfileEditForm } from "app/Scenes/MyProfile/MyProfileEditForm"
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

          expect(await screen.findByTestId("verification-confirmation-banner")).toBeTruthy()
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

          expect(
            await screen.findByText("ID verification link sent to", { exact: false })
          ).toBeTruthy()
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

          await waitFor(() => {
            expect(Sentry.captureMessage).toHaveBeenCalledWith(
              `useHandleIDVerification ${JSON.stringify(relayResponse.errors)}`
            )
          })
          expect(() => screen.getByText("ID verification link sent to", { exact: false })).toThrow()
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

  describe("UserProfileFields", () => {
    it("renders all profile fields", () => {
      renderWithRelay()

      expect(screen.getByText("Full name")).toBeTruthy()
      expect(screen.getByText("Primary location")).toBeTruthy()
      expect(screen.getByText("Profession")).toBeTruthy()
      expect(screen.getByText("Other relevant positions")).toBeTruthy()
      expect(screen.getByText("Instagram")).toBeTruthy()
      expect(screen.getByText("LinkedIn")).toBeTruthy()
    })

    it("displays initial values in the fields", () => {
      renderWithRelay({
        Me: () => ({
          name: "John Doe",
          location: { city: "New York", state: "NY", country: "US", display: "New York, NY" },
          profession: "Art Collector",
          otherRelevantPositions: "Museum Board Member",
          collectorProfile: {
            instagram: "johndoe",
            linkedIn: "john-doe",
          },
        }),
      })

      expect(screen.getByDisplayValue("John Doe")).toBeTruthy()
      expect(screen.getByDisplayValue("Art Collector")).toBeTruthy()
      expect(screen.getByDisplayValue("Museum Board Member")).toBeTruthy()
      expect(screen.getByDisplayValue("johndoe")).toBeTruthy()
      expect(screen.getByDisplayValue("john-doe")).toBeTruthy()
    })

    describe("validation errors", () => {
      it("shows error for invalid Instagram handle format", async () => {
        renderWithRelay()

        const instagramInput = screen.getByLabelText("Instagram handle")
        fireEvent.changeText(instagramInput, "invalid handle!")
        fireEvent(instagramInput, "blur")

        await waitFor(() => {
          expect(
            screen.getByText(
              "Instagram handle can only contain letters, numbers, underscores, and periods"
            )
          ).toBeTruthy()
        })
      })

      it("accepts Instagram handle with @ prefix", async () => {
        renderWithRelay()

        const instagramInput = screen.getByLabelText("Instagram handle")
        fireEvent.changeText(instagramInput, "@user.name123")
        fireEvent(instagramInput, "blur")

        expect(
          screen.queryByText(
            "Instagram handle can only contain letters, numbers, underscores, and periods"
          )
        ).toBeFalsy()
      })

      it("accepts valid Instagram handle", async () => {
        renderWithRelay()

        const instagramInput = screen.getByLabelText("Instagram handle")
        fireEvent.changeText(instagramInput, "valid_user.name123")
        fireEvent(instagramInput, "blur")

        expect(
          screen.queryByText(
            "Instagram handle can only contain letters, numbers, underscores, and periods"
          )
        ).toBeFalsy()
      })

      it("shows error for invalid LinkedIn handle format", async () => {
        renderWithRelay()

        const linkedInInput = screen.getByLabelText("LinkedIn handle")
        fireEvent.changeText(linkedInInput, "invalid_handle")
        fireEvent(linkedInInput, "blur")

        await waitFor(() => {
          expect(
            screen.getByText("LinkedIn handle can only contain letters, numbers, and hyphens")
          ).toBeTruthy()
        })
      })

      it("accepts valid LinkedIn handle", async () => {
        renderWithRelay()

        const linkedInInput = screen.getByLabelText("LinkedIn handle")
        fireEvent.changeText(linkedInInput, "valid-user-name123")
        fireEvent(linkedInInput, "blur")

        expect(
          screen.queryByText("LinkedIn handle can only contain letters, numbers, and hyphens")
        ).toBeFalsy()
      })
    })
  })
})
