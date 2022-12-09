import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkScreenHeaderTestQuery } from "__generated__/ArtworkScreenHeaderTestQuery.graphql"
import { goBack } from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkStoreModel, ArtworkStoreProvider } from "../ArtworkStore"
import { ArtworkScreenHeaderFragmentContainer } from "./ArtworkScreenHeader"

jest.unmock("react-relay")

interface TestRendererProps {
  initialData?: Partial<ArtworkStoreModel>
}

describe("ArtworkScreenHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = (testProps: TestRendererProps) => {
    return (
      <ArtworkStoreProvider initialData={testProps?.initialData}>
        <QueryRenderer<ArtworkScreenHeaderTestQuery>
          environment={mockEnvironment}
          query={graphql`
            query ArtworkScreenHeaderTestQuery @relay_test_operation @raw_response_type {
              artwork(id: "some-artwork") {
                ...ArtworkScreenHeader_artwork
              }
            }
          `}
          variables={{}}
          render={({ props, error }) => {
            if (props?.artwork) {
              return <ArtworkScreenHeaderFragmentContainer artwork={props.artwork} />
            } else if (error) {
              console.log(error)
            }
          }}
        />
      </ArtworkStoreProvider>
    )
  }

  it("renders the header", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        isSaved: false,
        artists: [{ name: "test" }],
      }),
    })

    await flushPromiseQueue()

    expect(screen.queryByLabelText("Artwork page header")).toBeTruthy()
    expect(screen.queryByLabelText("Go back")).toBeTruthy()
    expect(screen.queryByLabelText("Save button")).toBeTruthy()
    expect(screen.queryByText("Create Alert")).toBeTruthy()
  })

  it("calls go back when the back button is pressed", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {})

    await flushPromiseQueue()

    expect(screen.queryByLabelText("Go back")).toBeTruthy()

    fireEvent.press(screen.getByLabelText("Go back"))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  describe("Create alert button", () => {
    it("renders the header but not the create alert button if the artwork doesn't have an associated artist", async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          isSaved: false,
          artists: [],
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByLabelText("Go back")).toBeTruthy()
      expect(screen.queryByLabelText("Save button")).toBeTruthy()
      expect(screen.queryByText("Create Alert")).toBeFalsy()
    })

    it("should correctly track event when `Create Alert` button is pressed", () => {
      const { getByText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          artists: [{ name: "some-artist-name" }],
        }),
      })

      fireEvent.press(getByText("Create Alert"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "tappedCreateAlert",
          "context_module": "ArtworkScreenHeader",
          "context_screen_owner_id": "internalID-1",
          "context_screen_owner_slug": "slug-1",
          "context_screen_owner_type": "artwork",
        },
      ]
    `)
    })
  })

  describe("Save button", () => {
    it("should trigger save mutation when user presses save button", async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          isSaved: false,
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByLabelText("Save button")).toBeTruthy()

      fireEvent.press(screen.getByLabelText("Save button"))

      expect(mockEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "ArtworkScreenHeaderSaveMutation"
      )
    })

    it("should track save event when user saves and artwork successfully", async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          isSaved: false,
        }),
      })

      await flushPromiseQueue()

      fireEvent.press(screen.getByLabelText("Save button"))

      resolveMostRecentRelayOperation(mockEnvironment, {})

      await flushPromiseQueue()

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "action_name": "artworkSave",
            "action_type": "success",
            "context_module": "ArtworkActions",
          },
        ]
      `)
    })
  })
})
