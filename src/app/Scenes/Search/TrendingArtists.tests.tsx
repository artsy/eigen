import { fireEvent } from "@testing-library/react-native"
import { TrendingArtists_Test_Query } from "__generated__/TrendingArtists_Test_Query.graphql"
import { navigate } from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { TrendingArtists } from "./TrendingArtists"

jest.unmock("react-relay")

describe("TrendingArtists", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<TrendingArtists_Test_Query>(
      graphql`
        query TrendingArtists_Test_Query {
          ...TrendingArtists_query
        }
      `,
      {}
    )

    return <TrendingArtists data={data} />
  }

  it("should render all artists", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        curatedTrendingArtists,
      }),
    })
    await flushPromiseQueue()

    expect(getByText("Artist One")).toBeTruthy()
    expect(getByText("Artist Two")).toBeTruthy()
  })

  it("should navigate to the artist screen", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        curatedTrendingArtists,
      }),
    })

    await flushPromiseQueue()
    await fireEvent.press(getByText("Artist One"))

    expect(navigate).toHaveBeenCalledWith("/artist/artist-one")
  })
})

const curatedTrendingArtists = {
  edges: [
    {
      node: {
        href: "/artist/artist-one",
        name: "Artist One",
      },
    },
    {
      node: {
        href: "/artist/artist-two",
        name: "Artist Two",
      },
    },
  ],
}
