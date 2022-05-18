import { act } from "@testing-library/react-native"
import { SalesTestQuery } from "__generated__/SalesTestQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator, RelayMockEnvironment } from "relay-test-utils"
import { Sales } from "./index"

jest.unmock("react-relay")

describe("Sales", () => {
  let environment: RelayMockEnvironment = defaultEnvironment as RelayMockEnvironment

  const TestRenderer = () => (
    <QueryRenderer<SalesTestQuery>
      environment={environment}
      query={graphql`
        query SalesTestQuery @relay_test_operation {
          currentLiveAuctions: viewer {
            ...CurrentLiveAuctions_viewer
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
    const tree = renderWithWrappersTL(<TestRenderer />)
    act(() => {
      environment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  beforeEach(() => {
    environment = createMockEnvironment()
  })

  it("renders without Errors", () => {
    const wrapper = getWrapper()
    expect(wrapper.UNSAFE_getAllByType(StickyTabPage).length).toBe(1)
  })
})
