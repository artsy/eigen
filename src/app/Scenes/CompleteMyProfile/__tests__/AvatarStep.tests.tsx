import { screen, fireEvent, waitFor } from "@testing-library/react-native"
import { AvatarStep } from "app/Scenes/CompleteMyProfile/AvatarStep"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/useCompleteProfile"
import * as imageUtils from "app/utils/getConvertedImageUrlFromS3"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/Scenes/CompleteMyProfile/CompleteMyProfileProvider", () => ({
  useCompleteMyProfileContext: () => ({ user }),
}))

jest.mock("app/utils/requestPhotos", () => ({
  showPhotoActionSheet: jest.fn(() => Promise.resolve(photos)),
}))

describe("AvatarStep", () => {
  const mockSetField = jest.fn()

  const useCompleteMyProfileSpy = (
    jest.spyOn(useCompleteProfile, "useCompleteProfile") as jest.SpyInstance<any>
  ).mockReturnValue({
    goNext: jest.fn(),
    isCurrentRouteDirty: false,
    field: undefined,
    setField: mockSetField,
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders", () => {
    renderWithWrappers(<AvatarStep />)

    expect(screen.getByText("Add a profile image")).toBeOnTheScreen()
    expect(
      screen.getByText(
        "Make your profile more engaging and help foster trust with galleries on Artsy."
      )
    ).toBeOnTheScreen()
    expect(screen.getByText("Choose an Image")).toBeOnTheScreen()
    expect(screen.getByText("TY")).toBeOnTheScreen()
  })

  it("sets the image", async () => {
    const spy = jest.spyOn(imageUtils, "getConvertedImageUrlFromS3").mockResolvedValue("geminiUrl")

    renderWithWrappers(<AvatarStep />)

    fireEvent.press(screen.getByText("Choose an Image"))

    await waitFor(() => expect(spy).toHaveBeenCalledWith(photos[0].path))

    expect(mockSetField).toHaveBeenCalledWith({ localPath: "localPath", geminiUrl: "geminiUrl" })
  })

  it("renders given an image already set", () => {
    useCompleteMyProfileSpy.mockReturnValue({
      goNext: jest.fn(),
      isCurrentRouteDirty: false,
      field: { localPath: "localPath", geminiUrl: "geminiUrl" },
      setField: mockSetField,
    })

    renderWithWrappers(<AvatarStep />)

    expect(screen.getByText("Change Image")).toBeOnTheScreen()
  })
})

const user = {
  initials: "TY",
}

const photos = [{ path: "localPath" }]
