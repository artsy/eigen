import { fireEvent, waitForElementToBeRemoved } from "@testing-library/react-native"
import { MyProfileEditFormTestsQuery } from "__generated__/MyProfileEditFormTestsQuery.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
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

  describe("when AREnableCollectorProfile feature flag is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCollectorProfile: true })
    })

    it("shows the profile verification section", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      mockEnvironmentPayload(mockEnvironment)
      expect(getByTestId("profile-verifications")).toBeDefined()
    })

    describe("Email Verification", () => {
      describe("When the email is confirmed in Gravity", () => {
        it("is shown as verified when it's verified in gravity", async () => {
          const { getByText } = renderWithWrappersTL(<TestRenderer />)
          mockEnvironmentPayload(mockEnvironment, {
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
          const { getByText } = renderWithWrappersTL(<TestRenderer />)
          mockEnvironmentPayload(mockEnvironment, {
            Me: () => ({
              canRequestEmailConfirmation: true,
              emailConfirmed: false,
            }),
          })
          expect(getByText("Verify Your Email")).toBeTruthy()
        })

        it("Triggers the email verification when they user presses on Verify Your Email when canRequestEmailConfirmation is set to true", async () => {
          const { getByTestId, getByText } = renderWithWrappersTL(<TestRenderer />)
          mockEnvironmentPayload(mockEnvironment, {
            Me: () => ({
              canRequestEmailConfirmation: true,
              emailConfirmed: false,
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

          expect(getByTestId("email-verification-confirmation-banner")).toBeTruthy()
        })

        it("Triggers the email verification when they user presses on Verify Your Email when canRequestEmailConfirmation is set to false", async () => {
          const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
          mockEnvironmentPayload(mockEnvironment, {
            Me: () => ({
              canRequestEmailConfirmation: false,
              emailConfirmed: false,
            }),
          })
          const VerifyYouEmailButton = getByTestId("verify-your-email")
          expect(VerifyYouEmailButton).toBeTruthy()

          fireEvent(VerifyYouEmailButton, "onPress")

          expect(() => getByTestId("email-verification-confirmation-banner")).toThrow()
        })
      })
    })

    describe("ID Verification", () => {
      it("is shown as verified when it's verified in gravity", () => {
        const { getByText } = renderWithWrappersTL(<TestRenderer />)
        mockEnvironmentPayload(mockEnvironment, {
          Me: () => ({
            identityVerified: true,
          }),
        })
        expect(getByText("ID Verified")).toBeTruthy()
      })
      it("is shown as non verified when it's not verified in gravity", () => {
        const { getByText } = renderWithWrappersTL(<TestRenderer />)
        mockEnvironmentPayload(mockEnvironment, {
          Me: () => ({
            identityVerified: false,
          }),
        })
        expect(getByText("Verify Your ID")).toBeTruthy()
      })
    })
  })

  describe("when AREnableCollectorProfile feature flag is disabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCollectorProfile: false })
    })

    it("shows the profile verification section", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      mockEnvironmentPayload(mockEnvironment)
      expect(() => getByTestId("profile-verifications")).toThrow(
        "Unable to find an element with testID: profile-verifications"
      )
    })
  })
})
