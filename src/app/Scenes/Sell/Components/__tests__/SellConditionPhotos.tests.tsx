import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import {
  MAX_SELL_CONDITION_PHOTOS,
  SellConditionPhotos,
} from "app/Scenes/Sell/Components/SellConditionPhotos"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/requestPhotos", () => ({ showPhotoActionSheet: jest.fn() }))

type PickedPhotos = Awaited<ReturnType<typeof showPhotoActionSheet>>

describe("SellConditionPhotos", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("passes the picked photos' local paths on without uploading them", async () => {
    jest
      .mocked(showPhotoActionSheet)
      .mockResolvedValue([{ path: "file:///a.jpg" }, { path: "file:///b.jpg" }] as PickedPhotos)
    const onAdd = jest.fn()
    await renderWithWrappers(<SellConditionPhotos photos={[]} onAdd={onAdd} onRemove={jest.fn()} />)

    await fireEvent.press(screen.getByText("Upload photos"))

    await waitFor(() =>
      expect(onAdd).toHaveBeenCalledWith([{ path: "file:///a.jpg" }, { path: "file:///b.jpg" }])
    )
  })

  it("adds nothing when the user cancels the picker", async () => {
    jest.mocked(showPhotoActionSheet).mockRejectedValue(new Error("User cancelled"))
    const onAdd = jest.fn()
    await renderWithWrappers(<SellConditionPhotos photos={[]} onAdd={onAdd} onRemove={jest.fn()} />)

    await fireEvent.press(screen.getByText("Upload photos"))

    await waitFor(() => expect(showPhotoActionSheet).toHaveBeenCalled())
    expect(onAdd).not.toHaveBeenCalled()
  })

  it("previews each photo with a remove button", async () => {
    const onRemove = jest.fn()
    await renderWithWrappers(
      <SellConditionPhotos
        photos={[{ path: "file:///a.jpg" }, { path: "file:///b.jpg" }]}
        onAdd={jest.fn()}
        onRemove={onRemove}
      />
    )

    expect(screen.getAllByTestId("sell-condition-photo")).toHaveLength(2)
    expect(screen.getByText("Add more photos")).toBeOnTheScreen()

    await fireEvent.press(screen.getByLabelText("Remove photo 2"))
    expect(onRemove).toHaveBeenCalledWith("file:///b.jpg")
  })

  it("hides the upload button once the photo limit is reached", async () => {
    const photos = Array.from({ length: MAX_SELL_CONDITION_PHOTOS }, (_, index) => ({
      path: `file:///${index}.jpg`,
    }))
    await renderWithWrappers(
      <SellConditionPhotos photos={photos} onAdd={jest.fn()} onRemove={jest.fn()} />
    )

    expect(screen.getAllByTestId("sell-condition-photo")).toHaveLength(MAX_SELL_CONDITION_PHOTOS)
    expect(screen.queryByText("Add more photos")).not.toBeOnTheScreen()
  })
})
