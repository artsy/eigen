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

  describe("collector profile edit form", () => {
    it("shows the profile verification section", () => {
      const { getByTestId } = renderWithRelay()
      expect(getByTestId("profile-verifications")).toBeDefined()
    })

    describe("Email Verification", () => {
      describe("When the email is confirmed in Gravity", () => {
        it("is shown as verified when it's verified in gravity", async () => {
          const { getByText } = renderWithRelay({
            Me: () => ({
              canRequestEmailConfirmation: false,
              isEmailConfirmed: true,
            }),
          })
          expect(getByText("Email Address Verified")).toBeTruthy()
        })
      })

      describe("When the email is not verified in Gravity", () => {
        it("is shown as non verified when it's not verified in gravity", () => {
          const { getByText } = renderWithRelay({
            Me: () => ({
              canRequestEmailConfirmation: true,
              isEmailConfirmed: false,
            }),
          })
          expect(getByText("Verify Your Email")).toBeTruthy()
        })

        it("Triggers the email verification when they user presses on Verify Your Email when canRequestEmailConfirmation is set to true", async () => {
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

        it("Triggers the email verification when they user presses on Verify Your Email when canRequestEmailConfirmation is set to false", async () => {
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
})
