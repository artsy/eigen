import { fireEvent } from "@testing-library/react-native"
import { MyProfileEditFormTestsQuery } from "__generated__/MyProfileEditFormTestsQuery.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { MyProfileEditForm } from "../MyProfileEditForm"

jest.unmock("react-relay")

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
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<MyProfileEditFormTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyProfileEditFormTestsQuery @relay_test_operation {
          me {
            ...MyProfileEditForm_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.me) {
          return <MyProfileEditForm />
        }
        return null
      }}
    />
  )

  describe("collector profile edit form", () => {
    it("shows the profile verification section", () => {
      const { getByTestId } = renderWithWrappers(<TestRenderer />)
      resolveMostRecentRelayOperation(mockEnvironment)
      expect(getByTestId("profile-verifications")).toBeDefined()
    })

    describe("Email Verification", () => {
      describe("When the email is confirmed in Gravity", () => {
        it("is shown as verified when it's verified in gravity", async () => {
          const { getByText } = renderWithWrappers(<TestRenderer />)
          resolveMostRecentRelayOperation(mockEnvironment, {
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
          const { getByText } = renderWithWrappers(<TestRenderer />)
          resolveMostRecentRelayOperation(mockEnvironment, {
            Me: () => ({
              canRequestEmailConfirmation: true,
              isEmailConfirmed: false,
            }),
          })
          expect(getByText("Verify Your Email")).toBeTruthy()
        })

        it("Triggers the email verification when they user presses on Verify Your Email when canRequestEmailConfirmation is set to true", async () => {
          const { getByTestId } = renderWithWrappers(<TestRenderer />)
          resolveMostRecentRelayOperation(mockEnvironment, {
            Me: () => ({
              canRequestEmailConfirmation: true,
              isEmailConfirmed: false,
            }),
          })
          const VerifyYouEmailButton = getByTestId("verify-your-email")
          expect(VerifyYouEmailButton).toBeTruthy()

          fireEvent(VerifyYouEmailButton, "onPress")

          mockEnvironment.mock.resolveMostRecentOperation({
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
          const { getByTestId } = renderWithWrappers(<TestRenderer />)
          resolveMostRecentRelayOperation(mockEnvironment, {
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
        const { getByText } = renderWithWrappers(<TestRenderer />)
        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            isIdentityVerified: true,
          }),
        })
        expect(getByText("ID Verified")).toBeTruthy()
      })
      it("is shown as non verified when it's not verified in gravity", () => {
        const { getByText } = renderWithWrappers(<TestRenderer />)
        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            isIdentityVerified: false,
          }),
        })
        expect(getByText("Verify Your ID")).toBeTruthy()
      })
    })

    describe("Complete your profile banner", () => {
      it("shows when the user has empty fields in their profile", () => {
        const { getByText } = renderWithWrappers(<TestRenderer />)
        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({ collectorProfile: { isProfileComplete: false } }),
        })

        expect(getByText("Complete your profile and make a great impression")).toBeTruthy()
      })

      it("does not show when the user has completed their profile", () => {
        const { queryByText } = renderWithWrappers(<TestRenderer />)
        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({ collectorProfile: { isProfileComplete: true } }),
        })

        expect(queryByText("Complete your profile and make a great impression")).toBeFalsy()
      })
    })
  })
})
