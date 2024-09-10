import { screen, fireEvent, waitFor } from "@testing-library/react-native"
import { AvatarStepTestsQuery } from "__generated__/AvatarStepTestsQuery.graphql"
import { AvatarStep } from "app/Scenes/CompleteMyProfile/AvatarStep"
import {
  CompleteMyProfileStore,
  ProgressState,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import * as imageUtils from "app/utils/getConvertedImageUrlFromS3"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
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
  let progressState: ProgressState

  const { renderWithRelay } = setupTestWrapper<AvatarStepTestsQuery>({
    Component: ({ me }) => (
      <CompleteMyProfileStore.Provider runtimeModel={{ progressState, meKey: me }}>
        <AvatarStep />
      </CompleteMyProfileStore.Provider>
    ),
    query: graphql`
      query AvatarStepTestsQuery {
        me {
          ...ImageSelector_me
          ...IdentityVerificationStep_me
          ...useCompleteMyProfileSteps_me
        }
      }
    `,
  })

  beforeEach(() => {
    progressState = {}
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders", async () => {
    renderWithRelay({ Me: () => user })

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

    renderWithRelay({ Me: () => user })

    const imageButton = await screen.findByText("Choose an Image")
    fireEvent.press(imageButton)

    await waitFor(() => expect(spy).toHaveBeenCalledWith(photos[0].path))

    expect(setProgressState).toHaveBeenCalledWith({
      type: "iconUrl",
      value: { localPath: "localPath", geminiUrl: "geminiUrl" },
    })
  })

  it("renders given an image already set", async () => {
    progressState = { iconUrl: { localPath: "localPath", geminiUrl: "geminiUrl" } }

    renderWithRelay({ Me: () => user })

    expect(await screen.findByText("Change Image")).toBeOnTheScreen()
  })
})

const user = {
  initials: "TY",
}

const photos = [{ path: "localPath" }]
