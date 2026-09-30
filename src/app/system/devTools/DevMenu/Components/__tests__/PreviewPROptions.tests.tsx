import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { PreviewPROptions } from "app/system/devTools/DevMenu/Components/PreviewPROptions"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import * as Updates from "expo-updates"
import { Alert } from "react-native"

const openLabeledPR = {
  state: "open",
  title: "feat: add thing",
  labels: [{ name: "preview" }],
  head: { sha: "abcdef1234567" },
}

const mockFetch = (status: number, body: object = {}) => {
  global.fetch = jest.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  }) as unknown as typeof global.fetch
}

const expand = () => fireEvent.press(screen.getByLabelText("Preview PR"))

const loadAndConfirm = async () => {
  renderWithWrappers(<PreviewPROptions />)
  expand()
  fireEvent.changeText(screen.getByLabelText("PR Number"), "123")
  fireEvent.press(screen.getByText("Load PR"))
  await waitFor(() => expect(Alert.alert).toHaveBeenCalledTimes(1))
  const buttons = (Alert.alert as jest.Mock).mock.calls[0][2]
  buttons.find((button: { text: string }) => button.text === "Switch").onPress()
}

const expectOverrideCalls = (...channels: string[]) => {
  expect((Updates.setUpdateRequestHeadersOverride as jest.Mock).mock.calls).toEqual(
    channels.map((channel) => [{ "expo-channel-name": channel }])
  )
}

describe("PreviewPROptions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, "alert").mockImplementation(() => {})
    ;(Updates.checkForUpdateAsync as jest.Mock).mockResolvedValue({ isAvailable: true })
  })

  it("asks for confirmation, then switches the channel", async () => {
    mockFetch(200, openLabeledPR)
    renderWithWrappers(<PreviewPROptions />)
    expand()

    fireEvent.changeText(screen.getByLabelText("PR Number"), "123")
    fireEvent.press(screen.getByText("Load PR"))

    await waitFor(() => expect(Alert.alert).toHaveBeenCalledTimes(1))
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/artsy/eigen/pulls/123",
      expect.anything()
    )
    const [title, message, buttons] = (Alert.alert as jest.Mock).mock.calls[0]
    expect(title).toBe("Switch to preview?")
    expect(message).toContain("PR #123: feat: add thing")
    expect(message).toContain("abcdef1")
    expect(Updates.setUpdateRequestHeadersOverride).not.toHaveBeenCalled()

    buttons.find((button: { text: string }) => button.text === "Switch").onPress()

    await waitFor(() => expect(Updates.reloadAsync).toHaveBeenCalledTimes(1))
    expect(Updates.setUpdateRequestHeadersOverride).toHaveBeenCalledWith({
      "expo-channel-name": "review-app-123",
    })
    expect(Updates.fetchUpdateAsync).toHaveBeenCalledTimes(1)
    expect(__globalStoreTestUtils__?.getCurrentState().artsyPrefs.previewPR.value).toEqual({
      channel: "review-app-123",
      prNumber: 123,
      title: "feat: add thing",
      sha: "abcdef1234567",
    })
    // No crash alert: only the confirmation was shown
    expect(Alert.alert).toHaveBeenCalledTimes(1)
  })

  it("restores the previous channel when nothing is published to the channel", async () => {
    mockFetch(200, openLabeledPR)
    ;(Updates.checkForUpdateAsync as jest.Mock).mockResolvedValueOnce({ isAvailable: false })

    await loadAndConfirm()

    expect(
      await screen.findByText(/No update has been published to review-app-123/)
    ).toBeOnTheScreen()
    expect(Updates.fetchUpdateAsync).not.toHaveBeenCalled()
    expect(Updates.reloadAsync).not.toHaveBeenCalled()
    expectOverrideCalls("review-app-123", Updates.channel as string)
    expect(__globalStoreTestUtils__?.getCurrentState().artsyPrefs.previewPR.value).toBeNull()
  })

  it("restores the previous channel when the download fails", async () => {
    mockFetch(200, openLabeledPR)
    ;(Updates.fetchUpdateAsync as jest.Mock).mockRejectedValueOnce(new Error("network down"))

    await loadAndConfirm()

    expect(await screen.findByText(/Error downloading update: network down/)).toBeOnTheScreen()
    expect(Updates.reloadAsync).not.toHaveBeenCalled()
    expectOverrideCalls("review-app-123", Updates.channel as string)
    expect(__globalStoreTestUtils__?.getCurrentState().artsyPrefs.previewPR.value).toBeNull()
  })

  it("keeps the new channel and saves the payload when the app cannot reload itself", async () => {
    mockFetch(200, openLabeledPR)
    ;(Updates.reloadAsync as jest.Mock).mockRejectedValueOnce(
      Object.assign(new Error("reload failed"), { code: "ERR_UPDATES_RELOAD" })
    )

    await loadAndConfirm()

    expect(await screen.findByText(/Force-quit and reopen the app/)).toBeOnTheScreen()
    expectOverrideCalls("review-app-123")
    expect(__globalStoreTestUtils__?.getCurrentState().artsyPrefs.previewPR.value).toMatchObject({
      channel: "review-app-123",
    })
  })

  it("shows the error and does not switch when the PR is not eligible", async () => {
    mockFetch(200, { ...openLabeledPR, state: "closed" })
    renderWithWrappers(<PreviewPROptions />)
    expand()

    fireEvent.changeText(screen.getByLabelText("PR Number"), "123")
    fireEvent.press(screen.getByText("Load PR"))

    expect(await screen.findByText("PR #123 is not open")).toBeOnTheScreen()
    expect(Alert.alert).not.toHaveBeenCalled()
    expect(Updates.setUpdateRequestHeadersOverride).not.toHaveBeenCalled()
  })

  it("says why switching is unavailable on production builds", () => {
    const original = ArtsyNativeModule.isBetaOrDev
    Object.defineProperty(ArtsyNativeModule, "isBetaOrDev", { value: false, configurable: true })

    renderWithWrappers(<PreviewPROptions />)
    expand()

    expect(screen.getByText(/Production builds can't switch channels/)).toBeOnTheScreen()
    expect(screen.getByText("Load PR")).toBeDisabled()

    Object.defineProperty(ArtsyNativeModule, "isBetaOrDev", { value: original, configurable: true })
  })

  describe("on a review app channel", () => {
    const originalChannel = Updates.channel

    beforeEach(() => {
      Object.defineProperty(Updates, "channel", { value: "review-app-123", configurable: true })
    })

    afterEach(() => {
      Object.defineProperty(Updates, "channel", { value: originalChannel, configurable: true })
    })

    it("shows the stored bundle details without calling GitHub", () => {
      __globalStoreTestUtils__?.injectState({
        artsyPrefs: {
          previewPR: {
            value: {
              channel: "review-app-123",
              prNumber: 123,
              title: "feat: add thing",
              sha: "abcdef1234567",
            },
          },
        },
      })
      global.fetch = jest.fn() as unknown as typeof global.fetch

      renderWithWrappers(<PreviewPROptions />)
      expand()

      expect(screen.getByText(/Channel: review-app-123/)).toBeOnTheScreen()
      expect(screen.getByText(/PR: #123/)).toBeOnTheScreen()
      expect(screen.getByText(/Title: feat: add thing/)).toBeOnTheScreen()
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it("ignores stored details that belong to a different channel", () => {
      __globalStoreTestUtils__?.injectState({
        artsyPrefs: {
          previewPR: {
            value: { channel: "review-app-999", prNumber: 999, title: "old", sha: "1234567890" },
          },
        },
      })

      renderWithWrappers(<PreviewPROptions />)
      expand()

      expect(screen.getByText(/PR: #123/)).toBeOnTheScreen()
      expect(screen.queryByText(/Title:/)).not.toBeOnTheScreen()
    })
  })
})
