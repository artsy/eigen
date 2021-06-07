import { SavedSearchBannerQuery, SearchCriteriaAttributes } from '__generated__/SavedSearchBannerQuery.graphql'
import { SavedSearchBannerTestsQuery } from "__generated__/SavedSearchBannerTestsQuery.graphql"
import { mockEnvironmentPayload } from 'lib/tests/mockEnvironmentPayload'
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { SavedSearchBannerFragmentContainer } from "../SavedSearchBanner"

jest.unmock("react-relay")

describe("SavedSearchBanner", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const attributes: SearchCriteriaAttributes = {
    priceMin: 300,
    priceMax: 500,
  }

  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => {
    return (
      <QueryRenderer<SavedSearchBannerTestsQuery>
          environment={mockEnvironment}
          query={graphql`
            query SavedSearchBannerTestsQuery($criteria: SearchCriteriaAttributes!) @relay_test_operation {
              me {
                ...SavedSearchBanner_me @arguments(criteria: $criteria)
              }
            }
          `}
          render={({ props }) => <SavedSearchBannerFragmentContainer {...props} loading={props === null} attributes={attributes} artistId="banksy" />}
          variables={{
            criteria: attributes
          }}
        />
    )
  }

  it("renders correctly disabled state", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: null
      })
    })

    const buttonComponent = tree.root.findByType(Button)

    expect(buttonComponent.props.children).toEqual("Enable")
    expect(buttonComponent.props.variant).toBe("primaryBlack")
    expect(buttonComponent.props.loading).toBe(false)
  })

  it("renders correctly enabled state", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment)

    const buttonComponent = tree.root.findByType(Button)

    expect(buttonComponent.props.children).toEqual("Disable")
    expect(buttonComponent.props.variant).toBe("secondaryOutline")
    expect(buttonComponent.props.loading).toBe(false)
  })

  it("renders correctly loading state", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    const buttonComponent = tree.root.findByType(Button)

    expect(buttonComponent.props.loading).toBe(true)
  })
})
