import { ArtworkListEmptyState_Test_Query } from "__generated__/ArtworkListEmptyState_Test_Query.graphql"
import { ArtworkListEmptyState } from "app/Scenes/ArtworkList/ArtworkListEmptyState"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("ArtworkListEmptyState", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<ArtworkListEmptyState_Test_Query>(
      graphql`
        query ArtworkListEmptyState_Test_Query {
          me {
            ...ArtworkListEmptyState_me @arguments(listID: "list-id")
          }
        }
      `,
      {}
    )

    if (data.me) {
      return <ArtworkListEmptyState me={data.me} title="Title" />
    }

    return null
  }

  it("should render correct texts for default artwork list", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => ({
        artworkList: {
          default: true,
        },

        savedArtworksArtworkList: {
          artworksCount: 0,
        },
      }),
    })
    await flushPromiseQueue()

    expect(getByText("Keep track of artworks you love")).toBeTruthy()
    expect(getByText("Select the heart on an artwork to save it or add it to a list.")).toBeTruthy()
  })

  it("should render correct texts for non-default artwork list when user has saved artworks", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => ({
        artworkList: {
          default: false,
        },

        savedArtworksArtworkList: {
          artworksCount: 2,
        },
      }),
    })
    await flushPromiseQueue()

    expect(getByText("Start curating your list of works")).toBeTruthy()
    expect(
      getByText("Add works from Saved Artworks or add new artworks as you browse.")
    ).toBeTruthy()
  })

  it("should render correct texts for non-default artwork list when user doesn't have any saved artworks", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => ({
        artworkList: {
          default: false,
          artworks: {
            edges: [],
          },
        },

        savedArtworksArtworkList: {
          artworksCount: 0,
        },
      }),
    })

    await flushPromiseQueue()

    expect(getByText("Keep track of artworks you love")).toBeTruthy()
    expect(getByText("Select the heart on an artwork to save it or add it to a list.")).toBeTruthy()
  })
})
