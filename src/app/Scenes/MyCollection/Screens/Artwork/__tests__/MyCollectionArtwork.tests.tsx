import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { MyCollectionArtworkScreen } from "app/Scenes/MyCollection/Screens/Artwork/MyCollectionArtwork"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Text } from "react-native"

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Popover: (props: any) => <MockedPopover {...props} />,
}))

describe("MyCollectionArtwork", () => {
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
    it("should be visible always", async () => {
      renderWithRelay({
        Artwork: () => ({
          ...artwork,
        }),
      })

      await waitForElementToBeRemoved(() =>
        screen.queryByTestId("my-collection-artwork-placeholder")
      )

      expect(screen.getByText("Edit")).toBeOnTheScreen()
      expect(screen.getByText("Edit").props.color).toEqual("mono100")

      fireEvent.press(screen.getByText("Edit"))
      expect(navigate).toHaveBeenCalledWith(
        'my-collection/artworks/<mock-value-for-field-"internalID">/edit',
        { passProps: { mode: "edit" } }
      )
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
