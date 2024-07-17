import { screen, fireEvent } from "@testing-library/react-native"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { IdentityVerificationStep } from "app/Scenes/CompleteMyProfile/IdentityVerificationStep"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import * as useHandleVerification from "app/Scenes/MyProfile/useHandleVerification"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql } from "react-relay"

describe("IdentityVerificationStep", () => {
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
      <Suspense fallback={() => "loading"}>
        <IdentityVerificationStep />
      </Suspense>
    ),
    query: graphql`
      query IdentityVerificationStepTestsQuery {
        me {
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
    const { mockResolveLastOperation } = renderWithRelay()
    mockResolveLastOperation({ Me: () => user })

    fireEvent.press(await screen.findByText("Send verification Email"))

    expect(setProgressState).toHaveBeenCalledWith({ type: "isIdentityVerified", value: true })
    expect(IDVerficationSpy).toHaveBeenCalledWith(user.internalID)
  })

  it("renders given email already sent", async () => {
    stateSpy.mockImplementation((callback) =>
      callback({ progressState: { isIdentityVerified: true } } as any)
    )

    const { mockResolveLastOperation } = renderWithRelay()
    mockResolveLastOperation({ Me: () => user })

    expect(await screen.findByText("Email sent")).toBeOnTheScreen()
    expect(screen.getByText(/test@mail.com/)).toBeOnTheScreen()
  })
})

const user = {
  internalID: "123",
  email: "test@mail.com",
}
