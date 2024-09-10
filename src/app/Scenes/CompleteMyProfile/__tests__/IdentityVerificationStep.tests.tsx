import { screen, fireEvent } from "@testing-library/react-native"
import { IdentityVerificationStepTestsQuery } from "__generated__/IdentityVerificationStepTestsQuery.graphql"
import {
  CompleteMyProfileStore,
  ProgressState,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { IdentityVerificationStep } from "app/Scenes/CompleteMyProfile/IdentityVerificationStep"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import * as useHandleVerification from "app/Scenes/MyProfile/useHandleVerification"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("IdentityVerificationStep", () => {
  const setProgressState = jest.fn()
  ;(jest.spyOn(useCompleteProfile, "useCompleteProfile") as jest.SpyInstance<any>).mockReturnValue({
    goNext: jest.fn(),
  })
  jest
    .spyOn(CompleteMyProfileStore, "useStoreActions")
    .mockImplementation((callback) => callback({ setProgressState } as any))
  let progressState: ProgressState

  const { renderWithRelay } = setupTestWrapper<IdentityVerificationStepTestsQuery>({
    Component: ({ me }) => (
      <CompleteMyProfileStore.Provider runtimeModel={{ meKey: me, progressState }}>
        <IdentityVerificationStep />
      </CompleteMyProfileStore.Provider>
    ),
    query: graphql`
      query IdentityVerificationStepTestsQuery {
        me {
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

    expect(await screen.findByText("Verify your ID")).toBeOnTheScreen()
    expect(
      screen.getByText(
        "Send an ID verification email and follow the link and instructions to verify your account."
      )
    ).toBeOnTheScreen()
    expect(screen.getByText("Send verification Email")).toBeOnTheScreen()
  })

  it("calls handleSendVerification on Send verification button press", async () => {
    const IDVerficationSpy = jest.spyOn(useHandleVerification, "useHandleIDVerification")
    renderWithRelay({ Me: () => user })

    fireEvent.press(await screen.findByText("Send verification Email"))

    expect(setProgressState).toHaveBeenCalledWith({ type: "isIdentityVerified", value: true })
    expect(IDVerficationSpy).toHaveBeenCalledWith(user.internalID)
  })

  it("renders given email already sent", async () => {
    progressState = { isIdentityVerified: true }
    renderWithRelay({ Me: () => user })

    expect(await screen.findByText("Email sent")).toBeOnTheScreen()
    expect(screen.getByText(/test@mail.com/)).toBeOnTheScreen()
  })
})

const user = {
  internalID: "123",
  email: "test@mail.com",
}
