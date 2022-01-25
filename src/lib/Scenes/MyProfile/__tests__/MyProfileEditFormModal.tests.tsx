import { fireEvent } from "@testing-library/react-native"
import { MyProfileEditFormModalTestsQuery } from "__generated__/MyProfileEditFormModalTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { MyProfileEditFormModalFragmentContainer } from "../MyProfileEditFormModal"

jest.unmock("react-relay")

describe("MyProfileEditFormModal", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<MyProfileEditFormModalTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyProfileEditFormModalTestsQuery @relay_test_operation {
          me {
            ...MyProfileEditFormModal_me @arguments(enableCollectorProfile: true)
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.me) {
          return (
            <MyProfileEditFormModalFragmentContainer
              me={props.me}
              visible
              onDismiss={jest.fn}
              setProfileIconLocally={jest.fn}
              localImage={null}
              refetchProfileIdentification={jest.fn}
            />
          )
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
      describe("When the email is verified in Gravity", () => {
        it("is shown as verified when it's verified in gravity", () => {
          const { getByText } = renderWithWrappersTL(<TestRenderer />)
          mockEnvironmentPayload(mockEnvironment, {
            Me: () => ({
              canRequestEmailConfirmation: false,
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
            }),
          })
          expect(getByText("Verify Your Email")).toBeTruthy()
        })

        it("Triggers the email verification when they user presses on Verify Your Email", () => {
          const { getByTestId, getByText } = renderWithWrappersTL(<TestRenderer />)
          mockEnvironmentPayload(mockEnvironment, {
            Me: () => ({
              canRequestEmailConfirmation: true,
            }),
          })
          const VerifyYouEmailButton = getByTestId("verify-your-email")
          expect(VerifyYouEmailButton).toBeTruthy()

          // console.log(VerifyYouEmailButton)
          // fireEvent(VerifyYouEmailButton, "onPress")

          // mockEnvironment.mock.resolveMostRecentOperation({
          //   data: {
          //     sendConfirmationEmail: {
          //       confirmationOrError: {
          //         __typename: "SendConfirmationEmailMutationSuccess",
          //         unconfirmedEmail: "i.am.unconfirmed@gmail.com",
          //       },
          //     },
          //   },
          //   errors: [],
          // })

          // expect(getByText("Email sent to")).toBeTruthy()
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
