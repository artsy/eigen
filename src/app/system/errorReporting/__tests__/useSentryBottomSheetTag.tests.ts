import { setTag } from "@sentry/react-native"
import { renderHook } from "@testing-library/react-native"
import { useSentryBottomSheetTag } from "app/system/errorReporting/useSentryBottomSheetTag"

jest.mock("@sentry/react-native", () => ({
  setTag: jest.fn(),
}))

describe("useSentryBottomSheetTag", () => {
  const setTagMock = setTag as jest.Mock

  beforeEach(() => {
    setTagMock.mockClear()
  })

  it("tags the open sheet", async () => {
    await renderHook(() => useSentryBottomSheetTag("SortByModal", true))

    expect(setTagMock).toHaveBeenCalledWith("bottom_sheet", "SortByModal")
  })

  it("does not tag a closed sheet", async () => {
    await renderHook(() => useSentryBottomSheetTag("SortByModal", false))

    expect(setTagMock).not.toHaveBeenCalled()
  })

  it("does not tag when no name is given", async () => {
    await renderHook(() => useSentryBottomSheetTag(undefined, true))

    expect(setTagMock).not.toHaveBeenCalled()
  })

  it("clears the tag when the sheet closes, so it isn't attached to later events", async () => {
    const { rerender } = await renderHook<void, { isOpen: boolean }>(
      ({ isOpen }) => useSentryBottomSheetTag("SortByModal", isOpen),
      { initialProps: { isOpen: true } }
    )

    await rerender({ isOpen: false })

    expect(setTagMock).toHaveBeenLastCalledWith("bottom_sheet", "none")
  })

  it("clears the tag on unmount", async () => {
    const { unmount } = await renderHook(() => useSentryBottomSheetTag("SortByModal", true))

    await unmount()

    expect(setTagMock).toHaveBeenLastCalledWith("bottom_sheet", "none")
  })
})
