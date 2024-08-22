import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionArtistsPromptFooter } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsPromptFooter"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import * as updateCollectorProfile from "app/utils/mutations/useUpdateCollectorProfile"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock(
  "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore",
  () => ({
    MyCollectionAddCollectedArtistsStore: {
      useStoreState: jest.fn(),
    },
  })
)

const mockShow = jest.fn()
jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => ({ show: mockShow }),
}))

const mockClose = jest.fn()
jest.mock("@gorhom/bottom-sheet", () => ({
  ...jest.requireActual("@gorhom/bottom-sheet"),
  useBottomSheet: () => ({ close: mockClose }),
}))

describe("MyCollectionArtistsPromptFooter", () => {
  const onPress = jest.fn()

  const render = () => {
    renderWithWrappers(<MyCollectionArtistsPromptFooter onPress={onPress} isLoading={false} />)
  }

  beforeEach(() => {
    ;(MyCollectionAddCollectedArtistsStore.useStoreState as jest.Mock).mockImplementation(() => 1)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders", () => {
    render()

    expect(screen.getByText("Add Selected Artist • 1")).toBeOnTheScreen()
  })

  it("calls onPress when button is pressed", () => {
    render()

    fireEvent.press(screen.getByText("Add Selected Artist • 1"))

    expect(onPress).toHaveBeenCalled()
  })

  it("disables button when count is 0", () => {
    ;(MyCollectionAddCollectedArtistsStore.useStoreState as jest.Mock).mockImplementation(() => 0)

    render()

    fireEvent.press(screen.getByText("Add Selected Artists • 0"))

    expect(onPress).not.toHaveBeenCalled()
  })

  it("does not call close when text is pressed given an error", () => {
    jest
      .spyOn(updateCollectorProfile as any, "useUpdateCollectorProfile")
      .mockImplementation(() => [
        jest.fn(({ onCompleted }) => {
          onCompleted({
            updateCollectorProfile: {
              collectorProfileOrError: { mutationError: { message: "Error " } },
            },
          })
        }),
      ])
    render()

    fireEvent.press(screen.getByText("I haven’t started a collection yet"))

    expect(mockClose).toHaveBeenCalledTimes(0)
    expect(mockShow).toHaveBeenCalledTimes(1)
  })

  it("does call close when text is pressed given an error", () => {
    jest
      .spyOn(updateCollectorProfile as any, "useUpdateCollectorProfile")
      .mockImplementation(() => [
        jest.fn(({ onCompleted }) => onCompleted({ updateCollectorProfile: null })),
      ])
    render()

    fireEvent.press(screen.getByText("I haven’t started a collection yet"))

    expect(mockClose).toHaveBeenCalledTimes(1)
  })
})
