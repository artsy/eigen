import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { LensCamera } from "app/Scenes/Lens/Screens/LensCamera"
import { goBack } from "app/system/navigation/navigate"
import { requestPhotos } from "app/utils/requestPhotos"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useCameraPermission } from "react-native-vision-camera"

jest.mock("app/utils/requestPhotos", () => ({
  requestPhotos: jest.fn(),
}))

const mockNavigate = jest.fn()
const mockGoBack = jest.fn()

const navigationProps = {
  navigation: { navigate: mockNavigate, goBack: mockGoBack } as any,
  route: { key: "LensCamera", name: "LensCamera" } as any,
}

describe("LensCamera", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows the permission placeholder (with the library button still enabled) when camera access is undetermined", () => {
    jest.mocked(useCameraPermission).mockReturnValue({
      hasPermission: false,
      canRequestPermission: true,
      requestPermission: jest.fn(),
      status: "not-determined",
    } as any)

    renderWithWrappers(<LensCamera {...navigationProps} />)

    expect(screen.getByText("Search with your camera")).toBeOnTheScreen()
    expect(screen.getByText("Enable Access")).toBeOnTheScreen()
    expect(screen.getByTestId("lens-library-button")).toBeOnTheScreen()
    // No shutter — the live preview isn't available in this state.
    expect(screen.queryByTestId("lens-shutter-button")).not.toBeOnTheScreen()
  })

  it("returns to the previous screen when closed", () => {
    renderWithWrappers(<LensCamera {...navigationProps} />)

    fireEvent.press(screen.getByLabelText("Close"))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it("shows 'Go to Settings' (not another permission prompt) once camera access has been denied", () => {
    jest.mocked(useCameraPermission).mockReturnValue({
      hasPermission: false,
      canRequestPermission: false,
      requestPermission: jest.fn(),
      status: "denied",
    } as any)

    renderWithWrappers(<LensCamera {...navigationProps} />)

    expect(screen.getByText("Go to Settings")).toBeOnTheScreen()
    expect(screen.getByTestId("lens-library-button")).toBeOnTheScreen()
  })

  it("shows the error state and keeps the library button enabled when the camera device fails to load", () => {
    jest.mocked(useCameraPermission).mockReturnValue({
      hasPermission: true,
      canRequestPermission: false,
      requestPermission: jest.fn(),
      status: "authorized",
    } as any)
    // useCameraDevice defaults to `undefined` (see src/setupJest.tsx) — no usable back camera.

    renderWithWrappers(<LensCamera {...navigationProps} />)

    expect(screen.getByText("Failed to open the camera device")).toBeOnTheScreen()
    expect(screen.getByTestId("lens-library-button")).toBeOnTheScreen()
  })

  it("navigates to the stub with a file://-prefixed uri when a library photo is picked", async () => {
    jest
      .mocked(requestPhotos)
      .mockResolvedValue([{ path: "/tmp/picked-photo.jpg", width: 400, height: 300 } as any])

    renderWithWrappers(<LensCamera {...navigationProps} />)

    fireEvent.press(screen.getByTestId("lens-library-button"))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())

    expect(requestPhotos).toHaveBeenCalledWith(false)
    expect(mockNavigate).toHaveBeenCalledWith("LensAnalyzing", {
      photo: {
        uri: "file:///tmp/picked-photo.jpg",
        width: 400,
        height: 300,
        fromLibrary: true,
      },
    })
  })

  it("does not navigate when the library picker is cancelled", async () => {
    jest.mocked(requestPhotos).mockResolvedValue([])

    renderWithWrappers(<LensCamera {...navigationProps} />)

    fireEvent.press(screen.getByTestId("lens-library-button"))

    await waitFor(() => expect(requestPhotos).toHaveBeenCalled())

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
