import { fireEvent, screen } from "@testing-library/react-native"
import { TagTestsQuery } from "__generated__/TagTestsQuery.graphql"
import { ArtworkFilterOptionsScreen } from "app/Components/ArtworkFilter"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { Tag } from "./Tag"

describe("Tag", () => {
  const tagID = "skull"
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<TagTestsQuery>
      query={query}
      environment={mockEnvironment}
      variables={{ tagID }}
      render={({ props }) => {
        if (!props?.tag) {
          return null
        }

        return <Tag tagID={tagID} tag={props.tag} />
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  it("returns all tabs", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Tag: () => tag,
    })

    await flushPromiseQueue()

    expect(screen.getByText("Artworks")).toBeTruthy()
    expect(screen.getByText("About")).toBeTruthy()
  })

  it("don't render tabs without description", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Tag: () => ({
        ...tag,
        description: null,
      }),
    })

    await flushPromiseQueue()

    expect(screen.queryByText("Artworks")).toBeNull()
    expect(screen.queryByText("About")).toBeNull()
  })

  it("renders filter modal", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Tag: () => tag,
    })

    await flushPromiseQueue()

    fireEvent.press(screen.getByText("Sort & Filter"))

    expect(screen.UNSAFE_getByType(ArtworkFilterOptionsScreen)).toBeTruthy()
  })
})

const query = graphql`
  query TagTestsQuery($tagID: String!, $input: FilterArtworksInput) @relay_test_operation {
    tag(id: $tagID) {
      slug
      description
      ...TagHeader_tag
      ...About_tag
      ...TagArtworks_tag @arguments(input: $input)
    }
  }
`

const artwork = {
  slug: "artwork-slug",
  id: "artwork-id",
  internalID: "artwork-internalID",
  title: "Artwork Title",
}

const tag = {
  description: "Tag Description",
  artworks: {
    edges: [{ node: artwork }],
    counts: {
      total: 1,
    },
  },
}
