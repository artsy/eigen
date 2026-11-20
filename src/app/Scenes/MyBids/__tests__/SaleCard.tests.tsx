import { act, fireEvent, screen } from "@testing-library/react-native"
import { SaleCardTestsQuery } from "__generated__/SaleCardTestsQuery.graphql"
import { SaleCardFragmentContainer } from "app/Scenes/MyBids/Components/SaleCard"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("SaleCard", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<SaleCardTestsQuery>
      environment={env}
      query={graphql`
        query SaleCardTestsQuery($saleID: String!) @relay_test_operation {
          me {
            ...SaleCard_me
          }
          sale(id: $saleID) {
            ...SaleCard_sale
          }
        }
      `}
      variables={{ saleID: "test-sale" }}
      render={({ error, props }) => {
        if (props?.sale && props?.me) {
          return <SaleCardFragmentContainer smallScreen me={props.me} sale={props.sale} />
        } else if (error) {
          console.error(error)
        }
      }}
    />
  )

  const getWrapper = async (mockResolvers = {}) => {
    await renderWithWrappers(<TestRenderer />)
    await act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
  }

  it("renders without throwing an error", async () => {
    await getWrapper({ Sale: () => ({ name: "Test Sale" }) })
    expect(screen.getByText("Test Sale")).toBeOnTheScreen()
  })

  it("doesn't render a registration CTA when a user is qualified for bidding", async () => {
    await getWrapper({
      Sale: () => ({
        registrationStatus: { qualifiedForBidding: true },
      }),
    })

    expect(screen.queryByText("Complete registration")).not.toBeOnTheScreen()
    expect(screen.queryByText("Registration pending")).not.toBeOnTheScreen()
  })

  it("renders a link to user's pending identity verification", async () => {
    await getWrapper({
      Sale: () => ({
        internalID: "sale-id",
        registrationStatus: { qualifiedForBidding: false },
        requireIdentityVerification: true,
      }),
      Me: () => ({
        isIdentityVerified: false,
        pendingIdentityVerification: { internalID: "idv-id" },
      }),
    })

    expect(screen.getAllByText("Complete registration")).toHaveLength(1)

    await fireEvent.press(screen.getByText("Complete registration"))

    expect(navigate).toHaveBeenCalledWith("/identity-verification/idv-id")
    // Only CompleteRegistrationCTAWrapper tracks the identity verification tap
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: "tappedVerifyIdentity", sale_id: "sale-id" })
    )
  })

  it("renders a notice that registration is pending when identity verification is not required, but the user is not yet qualified for bidding", async () => {
    await getWrapper({
      Sale: () => ({
        registrationStatus: { qualifiedForBidding: false },
        requireIdentityVerification: false,
      }),
    })

    expect(screen.getAllByText("Registration pending")).toHaveLength(1)
    expect(screen.queryByText("Complete registration")).not.toBeOnTheScreen()
  })

  it("renders a link to register for the auction when there's no registration status present", async () => {
    await getWrapper({
      Sale: () => ({
        registrationStatus: null,
        slug: "test-sale",
      }),
    })

    expect(screen.getAllByText("Complete registration")).toHaveLength(1)

    await fireEvent.press(screen.getByText("Complete registration"))

    expect(navigate).toHaveBeenCalledWith("/auction-registration/test-sale")
    expect(mockTrackEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({ action: "tappedVerifyIdentity" })
    )
  })
})
