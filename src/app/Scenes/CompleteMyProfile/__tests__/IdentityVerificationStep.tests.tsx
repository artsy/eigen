import { screen, fireEvent } from "@testing-library/react-native"
import { IdentityVerificationStep } from "app/Scenes/CompleteMyProfile/IdentityVerificationStep"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import * as useHandleVerification from "app/Scenes/MyProfile/useHandleVerification"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql } from "react-relay"

describe("IdentityVerificationStep", () => {
  const mockSetField = jest.fn()

  const useCompleteMyProfileSpy = (
    jest.spyOn(useCompleteProfile, "useCompleteProfile") as jest.SpyInstance<any>
  ).mockReturnValue({
    goNext: jest.fn(),
    isCurrentRouteDirty: false,
    field: undefined,
    setField: mockSetField,
  })

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

    expect(mockSetField).toHaveBeenCalledWith(true)
    expect(IDVerficationSpy).toHaveBeenCalledWith(user.internalID)
  })

  it("renders given email already sent", async () => {
    useCompleteMyProfileSpy.mockReturnValue({
      goNext: jest.fn(),
      isCurrentRouteDirty: false,
      field: true,
      setField: mockSetField,
    })

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
