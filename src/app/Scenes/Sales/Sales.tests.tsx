import { act, waitFor } from "@testing-library/react-native"
import { SalesTestQuery } from "__generated__/SalesTestQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { CurrentlyRunningAuctions } from "./CurrentlyRunningAuctions"
import { Sales } from "./Sales"
import { UpcomingAuctions } from "./UpcomingAuctions"

describe("Sales", () => {
  const TestRenderer = () => (
    <QueryRenderer<SalesTestQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query SalesTestQuery @relay_test_operation {
          currentlyRunningAuctions: viewer {
            ...CurrentlyRunningAuctions_viewer
          }
          upcomingAuctions: viewer {
            ...UpcomingAuctions_viewer
          }
          me {
            ...LotsByFollowedArtistsRail_me
          }
        }
      `}
      variables={{}}
      // tslint:disable-next-line:no-shadowed-variable
      render={({ props }) => {
        if (props) {
          return <Sales data={props} />
        }
        return null
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockResolvers)
    return tree
  }

  const upcomingAuctionsRefreshMock = jest.fn()
  const currentAuctionsRefreshMock = jest.fn()

  it("renders without Errors", () => {
    const wrapper = getWrapper()
    expect(wrapper.getByTestId("Sales-Screen-ScrollView")).toBeDefined()
  })

  it("renders the ZeroState when there are no sales", async () => {
    const wrapper = getWrapper()
    const CurrentAuction = wrapper.UNSAFE_getAllByType(CurrentlyRunningAuctions)[0]
    const UpcomingAuction = wrapper.UNSAFE_getAllByType(UpcomingAuctions)[0]

    act(() => {
      CurrentAuction.props.setSalesCountOnParent(0)
      UpcomingAuction.props.setSalesCountOnParent(0)
    })

    await waitFor(() => expect(wrapper.getByTestId("Sales-Zero-State-Container")).toBeDefined())
  })

  it("Can refresh current and upcoming auctions", async () => {
    const wrapper = getWrapper()
    const CurrentAuction = wrapper.UNSAFE_getAllByType(CurrentlyRunningAuctions)[0]
    const UpcomingAuction = wrapper.UNSAFE_getAllByType(UpcomingAuctions)[0]

    const ScrollView = wrapper.getByTestId("Sales-Screen-ScrollView")

    await act(() => {
      CurrentAuction.props.setRefetchPropOnParent(currentAuctionsRefreshMock)
      UpcomingAuction.props.setRefetchPropOnParent(upcomingAuctionsRefreshMock)
      // pull to refresh
      ScrollView.props.refreshControl.props.onRefresh()
    })

    expect(upcomingAuctionsRefreshMock).toHaveBeenCalledTimes(1)
    expect(currentAuctionsRefreshMock).toHaveBeenCalledTimes(1)
  })
})
