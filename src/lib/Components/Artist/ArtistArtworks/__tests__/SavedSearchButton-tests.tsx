import { SavedSearchButtonTestsQuery } from "__generated__/SavedSearchButtonTestsQuery.graphql"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { SavedSearchButtonFragmentContainer as SavedSearchButton } from "../SavedSearchButton"

jest.unmock("react-relay")

const mockedAttributes: SearchCriteriaAttributes = {
  acquireable: true,
}

describe("SavedSearchButton", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = ({ attributes = mockedAttributes, onCreateAlertPress = jest.fn() }) => {
    return (
      <QueryRenderer<SavedSearchButtonTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query SavedSearchButtonTestsQuery($criteria: SearchCriteriaAttributes!) @relay_test_operation {
            me {
              ...SavedSearchButton_me @arguments(criteria: $criteria)
            }
          }
        `}
        render={({ props, error }) => (
          <SavedSearchButton
            {...props}
            loading={props === null && error === null}
            isEmptyCriteria={Object.keys(attributes).length === 0}
            onCreateAlertPress={onCreateAlertPress}
          />
        )}
        variables={{
          criteria: attributes,
        }}
      />
    )
  }

  it("renders loading state if request didn't return data and an error", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    expect(tree.root.findByType(Button).props.loading).toBe(true)
  })

  it("renders enabled button if criteria are not saved", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    expect(tree.root.findByType(Button).props.disabled).toBe(false)
  })

  it("renders disabled button if criteria are saved", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: {
          internalID: "internalID",
        },
      }),
    })

    expect(tree.root.findByType(Button).props.disabled).toBe(true)
  })

  it("should call `onPress` handler when button is pressed", () => {
    const onPress = jest.fn()
    const tree = renderWithWrappers(<TestRenderer onCreateAlertPress={onPress} />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    act(() => tree.root.findByType(Button).props.onPress())

    expect(onPress).toHaveBeenCalled()
  })
})
