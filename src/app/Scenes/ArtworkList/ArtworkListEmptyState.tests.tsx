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
      return <ArtworkListEmptyState me={data.me} refreshControl={<></>} />
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
      }),
    })
    await flushPromiseQueue()

    const title = "Keep track of artworks you love"
    const description = "Select the heart on an artwork to save it or add it to a list."

    expect(getByText(title)).toBeTruthy()
    expect(getByText(description)).toBeTruthy()
  })

  it("should render correct texts for non-default artwork list", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => ({
        artworkList: {
          default: false,
        },
      }),
    })

    await flushPromiseQueue()

    const title = "Start curating your list of works"
    const description = "Add works from Saved Artworks or add new artworks as you browse."

    expect(getByText(title)).toBeTruthy()
    expect(getByText(description)).toBeTruthy()
  })
})
