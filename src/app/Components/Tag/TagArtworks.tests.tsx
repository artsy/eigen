import { fireEvent, waitFor } from "@testing-library/react-native"
import { TagArtworksTestsQuery } from "__generated__/TagArtworksTestsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { TagArtworksPaginationContainer } from "./TagArtworks"

describe("TagArtworks", () => {
  const tagID = "tag-id"

  const TestRenderer = () => {
    return (
      <QueryRenderer<TagArtworksTestsQuery>
        environment={getMockRelayEnvironment()}
        query={graphql`
          query TagArtworksTestsQuery($tagID: String!, $input: FilterArtworksInput)
          @relay_test_operation {
            tag(id: $tagID) {
              ...TagArtworks_tag @arguments(input: $input)
            }
          }
        `}
        render={({ props }) => {
          if (!props?.tag) {
            return null
          }
          return (
            <StickyTabPage
              tabs={[
                {
                  title: "test",
                  content: <TagArtworksPaginationContainer tag={props.tag} />,
                },
              ]}
            />
          )
        }}
        variables={{
          tagID,
        }}
      />
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation()
  })

  it("renders filter header", async () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation()

    await waitFor(() => expect(getByText("Sort & Filter")).toBeTruthy())
  })

  it("renders artworks grid", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      FilterArtworksConnection() {
        return {
          counts: {
            total: 10,
          },
        }
      },
    })

    // Find by artwork title
    expect(getByText("title-1")).toBeTruthy()
  })

  it("renders empty artworks grid view", async () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      FilterArtworksConnection() {
        return {
          counts: {
            total: 10,
          },
        }
      },
    })

    // Change sort filter
    await waitFor(() => expect(getByText("Sort & Filter")).toBeTruthy())
    fireEvent.press(getByText("Sort & Filter"))
    fireEvent.press(getByText("Sort By"))
    fireEvent.press(getByText("Recently Added"))
    fireEvent.press(getByText("Show Results"))

    resolveMostRecentRelayOperation({
      FilterArtworksConnection() {
        return {
          counts: {
            total: 0,
          },
        }
      },
    })

    expect(getByText(/No results found/)).toBeTruthy()
  })

  it("renders empty message when artworks is empty", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Tag() {
        return {
          artworks: {
            counts: {
              total: 0,
            },
          },
        }
      },
    })
    const emptyMessage = "There aren’t any works available in the tag at this time."

    expect(getByText(emptyMessage)).toBeTruthy()
  })
})
