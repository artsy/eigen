import { OnboardingPersonalizationModalTestsQuery } from "__generated__/OnboardingPersonalizationModalTestsQuery.graphql"
import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { OnboardingPersonalizationModalPaginationContainer } from "./OnboardingPersonalizationModal"

const goBackMock = jest.fn()

describe("OnboardingPersonalizationModal", () => {
  const TestRenderer = () => (
    <QueryRenderer<OnboardingPersonalizationModalTestsQuery>
      environment={getMockRelayEnvironment()}
      query={graphql`
        query OnboardingPersonalizationModalTestsQuery($query: String!, $count: Int!)
        @relay_test_operation {
          ...OnboardingPersonalizationModal_artists @arguments(query: $query, count: $count)
        }
      `}
      variables={{ query: "", count: 20 }}
      render={({ props }) => {
        if (props) {
          return (
            <OnboardingPersonalizationModalPaginationContainer
              artists={props}
              navigation={{ goBack: goBackMock } as any}
              route={null as any}
            />
          )
        }
        return null
      }}
    />
  )

  it("looks for results with the right query", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    const mockProps = {
      SearchableConnection: () => ({
        edges: [],
      }),
    }

    resolveMostRecentRelayOperation(mockProps)

    const searchInput = tree.root.findByProps({ testID: "searchInput" })

    act(() => {
      searchInput.props.onChangeText("artist")
    })

    expect(searchInput.props.value).toEqual("artist")

    const mostRecentOperation = getMockRelayEnvironment().mock.getMostRecentOperation()

    expect(mostRecentOperation.request.variables.query).toEqual("artist")
  })

  it("renders no results are available when no results are available", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    const mockProps = {
      SearchableConnection: () => ({
        edges: [],
      }),
    }

    resolveMostRecentRelayOperation(mockProps)

    const searchInput = tree.root.findByProps({ testID: "searchInput" })

    act(() => {
      searchInput.props.onChangeText("artist with no results")
    })

    resolveMostRecentRelayOperation(mockProps)

    const noResults = tree.root.findByProps({ testID: "noResults" })

    expect(extractText(noResults)).toContain(
      "We couldn't find anything for “artist with no results”"
    )
  })
})
