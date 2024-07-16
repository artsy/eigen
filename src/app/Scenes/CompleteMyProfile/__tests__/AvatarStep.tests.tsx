import { screen, fireEvent, waitFor } from "@testing-library/react-native"
import { AvatarStep } from "app/Scenes/CompleteMyProfile/AvatarStep"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import * as imageUtils from "app/utils/getConvertedImageUrlFromS3"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql } from "react-relay"

jest.mock("app/utils/requestPhotos", () => ({
  showPhotoActionSheet: jest.fn(() => Promise.resolve(photos)),
}))

describe("AvatarStep", () => {
  const setProgressState = jest.fn()
  ;(jest.spyOn(useCompleteProfile, "useCompleteProfile") as jest.SpyInstance<any>).mockReturnValue({
    goNext: jest.fn(),
  })
  jest
    .spyOn(CompleteMyProfileStore, "useStoreActions")
    .mockImplementation((callback) => callback({ setProgressState } as any))
  const stateSpy = jest
    .spyOn(CompleteMyProfileStore, "useStoreState")
    .mockImplementation((callback) => callback({ progressState: {} } as any))

  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <Suspense fallback={() => null}>
        <AvatarStep />
      </Suspense>
    ),
    query: graphql`
      query AvatarStepTestsQuery {
        me {
          ...ImageSelector_me
          ...IdentityVerificationStep_me
        }
      }
    `,
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders", async () => {
    const { mockResolveLastOperation } = renderWithRelay()
    mockResolveLastOperation({ Me: () => user })

    expect(await screen.findByText("Add a profile image")).toBeOnTheScreen()
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

    const { mockResolveLastOperation } = renderWithRelay()
    mockResolveLastOperation({ Me: () => user })

    const imageButton = await screen.findByText("Choose an Image")
    fireEvent.press(imageButton)

    await waitFor(() => expect(spy).toHaveBeenCalledWith(photos[0].path))

    expect(setProgressState).toHaveBeenCalledWith({
      type: "iconUrl",
      value: { localPath: "localPath", geminiUrl: "geminiUrl" },
    })
  })

  it("renders given an image already set", async () => {
    stateSpy.mockImplementation((callback) =>
      callback({
        progressState: { iconUrl: { localPath: "localPath", geminiUrl: "geminiUrl" } },
      } as any)
    )

    const { mockResolveLastOperation } = renderWithRelay()
    mockResolveLastOperation({ Me: () => user })

    expect(await screen.findByText("Change Image")).toBeOnTheScreen()
  })
})

const user = {
  initials: "TY",
}

const photos = [{ path: "localPath" }]
