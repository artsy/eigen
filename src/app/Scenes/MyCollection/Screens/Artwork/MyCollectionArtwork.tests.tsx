import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Text } from "react-native"
import { MyCollectionArtworkScreen } from "./MyCollectionArtwork"

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Popover: (props: any) => <MockedPopover {...props} />,
}))

describe("My Collection Artwork", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: MyCollectionArtworkScreen })

  it("show new artwork screen ", async () => {
    renderWithRelay({
      Artwork: () => ({
        id: "random-id",
        artist: { internalID: "internal-id" },
        medium: "medium",
        category: "medium",
      }),
    })

    await waitForElementToBeRemoved(
      () => screen.queryByTestId("my-collection-artwork-placeholder"),
      {
        timeout: 10000,
      }
    )

    expect(() => screen.getByTestId("my-collection-artwork")).toBeTruthy()
  })

  describe("Edit button", () => {
    it("should be visible, greyed out and open a popover when submission process is not complete", async () => {
      renderWithRelay({
        Artwork: () => ({
          ...artwork,
          consignmentSubmission: { internalID: "submission-id", isEditable: false },
        }),
      })

      await waitForElementToBeRemoved(() =>
        screen.queryByTestId("my-collection-artwork-placeholder")
      )

      expect(screen.getByText("Edit")).toBeOnTheScreen()
      expect(screen.getByText("Edit").props.color).toEqual("black60")

      fireEvent.press(screen.getByText("Edit"))

      expect(screen.getByText("Popover")).toBeOnTheScreen()
    })

    it("should be visible when the artwork submission is complete", async () => {
      renderWithRelay({
        Artwork: () => ({
          ...artwork,
          consignmentSubmission: { internalID: "submission-id", isEditable: true },
        }),
      })

      await waitForElementToBeRemoved(() =>
        screen.queryByTestId("my-collection-artwork-placeholder")
      )

      expect(screen.getByText("Edit")).toBeOnTheScreen()
    })

    it("should be visible when the artwork does not have an associated submission", async () => {
      renderWithRelay({
        Artwork: () => ({ ...artwork, consignmentSubmission: null }),
      })

      await waitForElementToBeRemoved(() =>
        screen.queryByTestId("my-collection-artwork-placeholder")
      )

      expect(screen.getByText("Edit")).toBeOnTheScreen()
    })
  })
})

const artwork = {
  id: "random-id",
  artist: { internalID: "internal-id" },
  medium: "medium",
  category: "medium",
}

const MockedPopover: React.FC<any> = ({ children, onDismiss }) => {
  return (
    <>
      <Text onPress={onDismiss}>Popover</Text>
      {children}
    </>
  )
}
