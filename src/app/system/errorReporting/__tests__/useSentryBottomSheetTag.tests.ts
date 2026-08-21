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

  it("tags the open sheet", () => {
    renderHook(() => useSentryBottomSheetTag("SortByModal", true))

    expect(setTagMock).toHaveBeenCalledWith("bottom_sheet", "SortByModal")
  })

  it("does not tag a closed sheet", () => {
    renderHook(() => useSentryBottomSheetTag("SortByModal", false))

    expect(setTagMock).not.toHaveBeenCalled()
  })

  it("does not tag when no name is given", () => {
    renderHook(() => useSentryBottomSheetTag(undefined, true))

    expect(setTagMock).not.toHaveBeenCalled()
  })

  it("clears the tag when the sheet closes, so it isn't attached to later events", () => {
    const { rerender } = renderHook<void, { isOpen: boolean }>(
      ({ isOpen }) => useSentryBottomSheetTag("SortByModal", isOpen),
      { initialProps: { isOpen: true } }
    )

    rerender({ isOpen: false })

    expect(setTagMock).toHaveBeenLastCalledWith("bottom_sheet", "none")
  })

  it("clears the tag on unmount", () => {
    const { unmount } = renderHook(() => useSentryBottomSheetTag("SortByModal", true))

    unmount()

    expect(setTagMock).toHaveBeenLastCalledWith("bottom_sheet", "none")
  })
})
