import { fireEvent } from "@testing-library/react-native"
import { ArtworkConsignments_artwork_TestQuery } from "__generated__/ArtworkConsignments_artwork_TestQuery.graphql"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { ModalStack } from "app/navigation/ModalStack"
import { navigate } from "app/navigation/navigate"
import { useSelectedTab } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkConsignments } from "./ArtworkConsignments"

jest.unmock("react-relay")
jest.mock("app/store/GlobalStore", () => ({
  GlobalStoreProvider: jest.requireActual("app/store/GlobalStore").GlobalStoreProvider,
  useSelectedTab: jest.fn(() => "home"),
  GlobalStore: jest.requireActual("app/store/GlobalStore").GlobalStore,
}))

describe("ArtworkConsignments", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<ArtworkConsignments_artwork_TestQuery>(
      graphql`
        query ArtworkConsignments_artwork_TestQuery @relay_test_operation {
          artwork(id: "artworkID") {
            ...ArtworkConsignments_artwork
          }
        }
      `,
      {}
    )

    if (data.artwork) {
      return (
        <ModalStack>
          <ArtworkConsignments artwork={data.artwork} />
        </ModalStack>
      )
    }

    return null
  }

  it("redirects to /sales when consignments link is clicked from outside of sell tab", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    fireEvent.press(getByText(/Consign with Artsy/))

    expect(navigate).toHaveBeenCalledWith("/sales")
  })

  it("redirects to /collections/my-collection/marketing-landing when consignments link is clicked from within sell tab", async () => {
    ;(useSelectedTab as any).mockImplementation(() => "sell")
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    fireEvent.press(getByText(/Consign with Artsy/))

    expect(navigate).toHaveBeenCalledWith("/collections/my-collection/marketing-landing")
  })

  describe("link text", () => {
    it("shows plural form for an artwork with more than 1 consignable artist", async () => {
      const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          artists: [firstArtist, secondArtist],
        }),
      })
      await flushPromiseQueue()

      expect(queryByText(/Want to sell a work by these artists?/)).toBeTruthy()
    })

    it("shows single form for an artwork with one artist", async () => {
      const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })
      await flushPromiseQueue()

      expect(queryByText(/Want to sell a work by Santa?/)).toBeTruthy()
    })

    it("shows artist's name placeholder when artist doesn't have name", async () => {
      const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          artists: [
            {
              ...firstArtist,
              name: null,
            },
          ],
        }),
      })
      await flushPromiseQueue()

      expect(queryByText(/Want to sell a work by this artist?/)).toBeTruthy()
    })
  })
})

const firstArtist = {
  name: "Santa",
  isConsignable: true,
}

const secondArtist = {
  name: "Easter Bunny",
  isConsignable: true,
}

const artwork = {
  ...ArtworkFixture,
  isForSale: true,
  artists: [firstArtist],
}
