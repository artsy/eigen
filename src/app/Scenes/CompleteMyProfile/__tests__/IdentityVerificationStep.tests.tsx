import { screen, fireEvent } from "@testing-library/react-native"
import { IdentityVerificationStep } from "app/Scenes/CompleteMyProfile/IdentityVerificationStep"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/useCompleteProfile"
import * as useHandleVerification from "app/Scenes/MyProfile/useHandleVerification"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/Scenes/CompleteMyProfile/CompleteMyProfileProvider", () => ({
  useCompleteMyProfileContext: () => ({ user }),
}))

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

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders", () => {
    renderWithWrappers(<IdentityVerificationStep />)

    expect(screen.getByText("Verify your ID")).toBeOnTheScreen()
    expect(
      screen.getByText(
        "Send an ID verification email and follow the link and instructions to verify your account."
      )
    ).toBeOnTheScreen()
    expect(screen.getByText("Send verification Email")).toBeOnTheScreen()
  })

  it("calls handleSendVerification on Send verification button press", () => {
    const IDVerficationSpy = jest.spyOn(useHandleVerification, "useHandleIDVerification")
    renderWithWrappers(<IdentityVerificationStep />)

    fireEvent.press(screen.getByText("Send verification Email"))

    expect(mockSetField).toHaveBeenCalledWith(true)
    expect(IDVerficationSpy).toHaveBeenCalledWith(user.internalID)
  })

  it("renders given email already sent", () => {
    useCompleteMyProfileSpy.mockReturnValue({
      goNext: jest.fn(),
      isCurrentRouteDirty: false,
      field: true,
      setField: mockSetField,
    })

    renderWithWrappers(<IdentityVerificationStep />)

    expect(screen.getByText("Email sent")).toBeOnTheScreen()
    expect(screen.getByText(/test@mail.com/)).toBeOnTheScreen()
  })
})

const user = {
  internalID: "123",
  email: "test@mail.com",
}
