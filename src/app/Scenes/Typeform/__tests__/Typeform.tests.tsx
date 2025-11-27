import { act, screen } from "@testing-library/react-native"
import { Typeform } from "app/Scenes/Typeform/Typeform"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const mockTrackSurveyViewed = jest.fn()
const mockTrackSurveySubmitted = jest.fn()
const mockTrackSurveyAbandoned = jest.fn()

jest.mock("app/Scenes/Typeform/useSurveyTracking", () => ({
  useSurveyTracking: () => ({
    trackSurveyViewed: mockTrackSurveyViewed,
    trackSurveySubmitted: mockTrackSurveySubmitted,
    trackSurveyAbandoned: mockTrackSurveyAbandoned,
  }),
}))

let mockRouteParams: any = {
  id: "test-form-id",
}

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: () => ({
    params: mockRouteParams,
  }),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}))

describe("Typeform", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRouteParams = {
      id: "test-form-id",
    }
  })

  it("renders without crashing", () => {
    renderWithWrappers(<Typeform />)
    expect(screen.UNSAFE_getByType(require("react-native-webview").WebView)).toBeTruthy()
  })

  it("shows loading spinner initially", () => {
    renderWithWrappers(<Typeform />)
    expect(screen.UNSAFE_queryByType(require("@artsy/palette-mobile").Spinner)).toBeTruthy()
  })

  it("embeds Typeform using the SDK", () => {
    renderWithWrappers(<Typeform />)
    const webview = screen.UNSAFE_getByType(require("react-native-webview").WebView)
    expect(webview.props.source.html).toContain("embed.typeform.com/next/embed.js")
    expect(webview.props.source.html).toContain("test-form-id")
  })

  it("tracks survey viewed when form is ready", async () => {
    renderWithWrappers(<Typeform />)
    const webview = screen.UNSAFE_getByType(require("react-native-webview").WebView)

    // Simulate form ready event
    const mockEvent = {
      nativeEvent: {
        data: JSON.stringify({ type: "form-ready" }),
      },
    }

    await act(async () => {
      webview.props.onMessage(mockEvent)
    })

    expect(mockTrackSurveyViewed).toHaveBeenCalledWith("test-form-id")
  })

  it("shows thank you message after submission", async () => {
    renderWithWrappers(<Typeform />)
    const webview = screen.UNSAFE_getByType(require("react-native-webview").WebView)

    // Simulate form submission event from Typeform SDK
    const mockEvent = {
      nativeEvent: {
        data: JSON.stringify({ type: "form-submit" }),
      },
    }

    await act(async () => {
      webview.props.onMessage(mockEvent)
    })

    // Should show thank you message
    expect(screen.getByText("Thanks for your feedback!")).toBeTruthy()
    expect(screen.getByText("Your response has been recorded.")).toBeTruthy()

    // Should track submission
    expect(mockTrackSurveySubmitted).toHaveBeenCalledWith("test-form-id")
  })

  it("does not show WebView after submission", async () => {
    renderWithWrappers(<Typeform />)
    const webview = screen.UNSAFE_getByType(require("react-native-webview").WebView)

    // Simulate form submission
    const mockEvent = {
      nativeEvent: {
        data: JSON.stringify({ type: "form-submit" }),
      },
    }

    await act(async () => {
      webview.props.onMessage(mockEvent)
    })

    // WebView should not be present
    expect(screen.UNSAFE_queryByType(require("react-native-webview").WebView)).toBeNull()
  })

  it("tracks survey abandoned when form is closed", async () => {
    renderWithWrappers(<Typeform />)
    const webview = screen.UNSAFE_getByType(require("react-native-webview").WebView)

    // Simulate form close
    const mockEvent = {
      nativeEvent: {
        data: JSON.stringify({ type: "form-close" }),
      },
    }

    await act(async () => {
      webview.props.onMessage(mockEvent)
    })

    // Should track abandonment
    expect(mockTrackSurveyAbandoned).toHaveBeenCalledWith("test-form-id")
  })
})
