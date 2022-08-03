import { fireEvent } from "@testing-library/react-native"
import { MyProfileEditFormTestsQuery } from "__generated__/MyProfileEditFormTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { MyProfileEditForm } from "../MyProfileEditForm"

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
  const TestRenderer = () => (
    <QueryRenderer<MyProfileEditFormTestsQuery>
      environment={getRelayEnvironment()}
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
      resolveMostRecentRelayOperation()
      expect(getByTestId("profile-verifications")).toBeDefined()
    })

    describe("Email Verification", () => {
      describe("When the email is confirmed in Gravity", () => {
        it("is shown as verified when it's verified in gravity", async () => {
          const { getByText } = renderWithWrappers(<TestRenderer />)
          resolveMostRecentRelayOperation({
            Me: () => ({
              canRequestEmailConfirmation: false,
              emailConfirmed: true,
            }),
          })
          expect(getByText("Email Address Verified")).toBeTruthy()
        })
      })

      describe("When the email is not verified in Gravity", () => {
        it("is shown as non verified when it's not verified in gravity", () => {
          const { getByText } = renderWithWrappers(<TestRenderer />)
          resolveMostRecentRelayOperation({
            Me: () => ({
              canRequestEmailConfirmation: true,
              emailConfirmed: false,
            }),
          })
          expect(getByText("Verify Your Email")).toBeTruthy()
        })

        it("Triggers the email verification when they user presses on Verify Your Email when canRequestEmailConfirmation is set to true", async () => {
          const { getByTestId } = renderWithWrappers(<TestRenderer />)
          resolveMostRecentRelayOperation({
            Me: () => ({
              canRequestEmailConfirmation: true,
              emailConfirmed: false,
            }),
          })

          const VerifyYouEmailButton = getByTestId("verify-your-email")
          expect(VerifyYouEmailButton).toBeTruthy()

          fireEvent.press(VerifyYouEmailButton)

          resolveMostRecentRelayOperation({
            sendConfirmationEmail: () => ({
              confirmationOrError: {
                __typename: "SendConfirmationEmailMutationSuccess",
                unconfirmedEmail: "i.am.unconfirmed@gmail.com",
              },
            }),
          })

          await flushPromiseQueue()

          expect(getByTestId("verification-confirmation-banner")).toBeTruthy()
        })

        it("Triggers the email verification when they user presses on Verify Your Email when canRequestEmailConfirmation is set to false", async () => {
          const { getByTestId } = renderWithWrappers(<TestRenderer />)
          resolveMostRecentRelayOperation({
            Me: () => ({
              canRequestEmailConfirmation: false,
              emailConfirmed: false,
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
        resolveMostRecentRelayOperation({
          Me: () => ({
            identityVerified: true,
          }),
        })
        expect(getByText("ID Verified")).toBeTruthy()
      })
      it("is shown as non verified when it's not verified in gravity", () => {
        const { getByText } = renderWithWrappers(<TestRenderer />)
        resolveMostRecentRelayOperation({
          Me: () => ({
            identityVerified: false,
          }),
        })
        expect(getByText("Verify Your ID")).toBeTruthy()
      })
    })
  })
})
