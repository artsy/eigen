import { captureException } from "@sentry/react-native"
import { act, renderHook } from "@testing-library/react-native"
import {
  ART_ASSISTANT_VOICE_INPUT_ERROR,
  resolveRecognitionLocale,
  useArtAssistantVoiceInput,
} from "app/Scenes/ArtAssistant/hooks/useArtAssistantVoiceInput"
// Type-only: the `expo` runtime does not load in Jest.
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition"
import { Alert, Linking } from "react-native"
import { getLocales } from "react-native-localize"
import type { PermissionResponse } from "expo"

const mockShowToast = jest.fn()

jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => ({ show: mockShowToast }),
}))
jest.mock("react-native-localize", () => ({
  getLocales: jest.fn(),
}))

const { __emit: emit } = jest.requireMock<{
  __emit: (eventName: string, event?: unknown) => void
}>("expo-speech-recognition")

const permission = (granted: boolean, canAskAgain: boolean): PermissionResponse => ({
  canAskAgain,
  expires: "never",
  granted,
  status: (granted
    ? "granted"
    : canAskAgain
      ? "undetermined"
      : "denied") as PermissionResponse["status"],
})

const result = (transcript: string, isFinal = false) => ({
  isFinal,
  results: [{ confidence: 1, segments: [], transcript }],
})

const locale = (languageTag: string) => {
  const parts = languageTag.split("-")

  return { countryCode: parts[parts.length - 1], isRTL: false, languageCode: parts[0], languageTag }
}

const deviceLocale = (languageTag: string) =>
  jest.mocked(getLocales).mockReturnValue([locale(languageTag)])

const renderVoiceInput = () => {
  const onTranscript = jest.fn()
  const utils = renderHook(() => useArtAssistantVoiceInput(onTranscript))

  return { ...utils, onTranscript }
}

describe("useArtAssistantVoiceInput", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, "alert").mockImplementation(() => {})
    jest.spyOn(Linking, "openSettings").mockResolvedValue()
    jest.mocked(ExpoSpeechRecognitionModule.isRecognitionAvailable).mockReturnValue(true)
    jest
      .mocked(ExpoSpeechRecognitionModule.getPermissionsAsync)
      .mockResolvedValue(permission(true, true))
    jest
      .mocked(ExpoSpeechRecognitionModule.getSupportedLocales)
      .mockResolvedValue({ installedLocales: [], locales: [] })
    deviceLocale("en-US")
  })

  it("listens in the closest locale the recognizer supports", async () => {
    deviceLocale("zh-Hans-CN")
    jest
      .mocked(ExpoSpeechRecognitionModule.getSupportedLocales)
      .mockResolvedValue({ installedLocales: [], locales: ["en-US", "zh-CN", "zh-TW"] })
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())

    expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
      expect.objectContaining({ lang: "zh-CN" })
    )
  })

  it("uses the device language when the supported locales can't be read", async () => {
    deviceLocale("fr-FR")
    jest
      .mocked(ExpoSpeechRecognitionModule.getSupportedLocales)
      .mockRejectedValue(new Error("package_not_found"))
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())

    expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
      expect.objectContaining({ lang: "fr-FR" })
    )
  })

  it("listens in the device language and passes every transcript on", async () => {
    deviceLocale("fr-FR")
    const { result: hook, onTranscript } = renderVoiceInput()

    await act(() => hook.current.start())

    expect(hook.current.status).toBe("starting")
    expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
      expect.objectContaining({ interimResults: true, lang: "fr-FR" })
    )

    act(() => emit("start"))

    expect(hook.current.status).toBe("listening")

    act(() => {
      emit("result", result("des paysages"))
      emit("result", result("des paysages marins", true))
    })

    expect(onTranscript).toHaveBeenNthCalledWith(1, "des paysages")
    expect(onTranscript).toHaveBeenNthCalledWith(2, "des paysages marins")

    act(() => emit("end"))

    expect(hook.current.status).toBe("idle")
  })

  it("follows the microphone level from 0 to 1 and resets it when listening ends", async () => {
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())

    expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
      expect.objectContaining({
        volumeChangeEventOptions: expect.objectContaining({ enabled: true }),
      })
    )

    act(() => emit("volumechange", { value: 5 }))
    expect(hook.current.volume.get()).toBe(0.5)

    act(() => emit("volumechange", { value: -2 }))
    expect(hook.current.volume.get()).toBe(0)

    act(() => emit("volumechange", { value: 12 }))
    expect(hook.current.volume.get()).toBe(1)

    act(() => emit("end"))
    expect(hook.current.volume.get()).toBe(0)
  })

  it("ignores empty transcripts", async () => {
    const { result: hook, onTranscript } = renderVoiceInput()

    await act(() => hook.current.start())
    act(() => emit("result", result("")))

    expect(onTranscript).not.toHaveBeenCalled()
  })

  it("stops the recognizer and keeps the transcript", async () => {
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())
    act(() => emit("start"))
    act(() => hook.current.stop())

    expect(ExpoSpeechRecognitionModule.stop).toHaveBeenCalled()
    expect(ExpoSpeechRecognitionModule.abort).not.toHaveBeenCalled()
  })

  it("asks for permission the first time and does not listen when it is refused", async () => {
    jest
      .mocked(ExpoSpeechRecognitionModule.getPermissionsAsync)
      .mockResolvedValue(permission(false, true))
    jest
      .mocked(ExpoSpeechRecognitionModule.requestPermissionsAsync)
      .mockResolvedValue(permission(false, false))
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())

    expect(ExpoSpeechRecognitionModule.requestPermissionsAsync).toHaveBeenCalled()
    expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled()
    expect(Alert.alert).not.toHaveBeenCalled()
    expect(hook.current.status).toBe("idle")
  })

  it("points to Settings once permission has been denied for good", async () => {
    jest
      .mocked(ExpoSpeechRecognitionModule.getPermissionsAsync)
      .mockResolvedValue(permission(false, false))
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())

    expect(ExpoSpeechRecognitionModule.requestPermissionsAsync).not.toHaveBeenCalled()
    expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled()
    expect(Alert.alert).toHaveBeenCalledWith(
      "Allow access to your microphone",
      expect.any(String),
      expect.any(Array)
    )
  })

  it("does not start listening when stopped while the permission prompt is up", async () => {
    let grant: (value: PermissionResponse) => void = () => {}
    jest
      .mocked(ExpoSpeechRecognitionModule.getPermissionsAsync)
      .mockResolvedValue(permission(false, true))
    jest.mocked(ExpoSpeechRecognitionModule.requestPermissionsAsync).mockReturnValue(
      new Promise((resolve) => {
        grant = resolve
      })
    )
    const { result: hook } = renderVoiceInput()

    let pending: Promise<void> = Promise.resolve()
    await act(async () => {
      pending = hook.current.start()
    })
    act(() => hook.current.stop())
    await act(async () => {
      grant(permission(true, true))
      await pending
    })

    expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled()
    expect(hook.current.status).toBe("idle")
  })

  it("falls back to English when the device language is not supported", async () => {
    deviceLocale("hy-AM")
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())
    act(() => {
      emit("error", { error: "language-not-supported", message: "Locale hy-AM is not supported" })
      emit("end")
    })

    expect(ExpoSpeechRecognitionModule.start).toHaveBeenLastCalledWith(
      expect.objectContaining({ lang: "en-US" })
    )
    expect(hook.current.status).toBe("starting")
    expect(mockShowToast).not.toHaveBeenCalled()
  })

  it("reports a failure when English is not supported either", async () => {
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())
    act(() => {
      emit("error", { error: "language-not-supported", message: "Locale en-US is not supported" })
      emit("end")
    })

    expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledTimes(1)
    expect(mockShowToast).toHaveBeenCalledWith(ART_ASSISTANT_VOICE_INPUT_ERROR, "bottom", {
      backgroundColor: "red100",
    })
    expect(hook.current.status).toBe("idle")
  })

  it("reports unexpected recognizer errors", async () => {
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())
    act(() => emit("error", { error: "network", message: "Network failed" }))

    expect(captureException).toHaveBeenCalledWith(expect.any(Error), {
      tags: { source: "art_assistant_voice_input", speech_recognition_error: "network" },
    })
    expect(mockShowToast).toHaveBeenCalledWith(ART_ASSISTANT_VOICE_INPUT_ERROR, "bottom", {
      backgroundColor: "red100",
    })
  })

  it("stays quiet when nothing was said", async () => {
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())
    act(() => {
      emit("error", { error: "no-speech", message: "No speech detected" })
      emit("end")
    })

    expect(captureException).not.toHaveBeenCalled()
    expect(mockShowToast).not.toHaveBeenCalled()
    expect(hook.current.status).toBe("idle")
  })

  it("drops results that arrive after a cancel", async () => {
    const { result: hook, onTranscript } = renderVoiceInput()

    await act(() => hook.current.start())
    act(() => emit("start"))
    act(() => hook.current.cancel())
    act(() => emit("result", result("too late", true)))

    expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalled()
    expect(onTranscript).not.toHaveBeenCalled()
    expect(hook.current.status).toBe("idle")
  })

  it("does not let a cancelled session's late end stop the next one", async () => {
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())
    act(() => emit("start"))
    act(() => hook.current.cancel())
    await act(() => hook.current.start())
    // The aborted session reports its end only now, after the new one has started.
    act(() => emit("end"))
    act(() => emit("start"))

    expect(hook.current.status).toBe("listening")
  })

  it("does not start listening when the screen goes away during the permission prompt", async () => {
    let grant: (value: PermissionResponse) => void = () => {}
    jest
      .mocked(ExpoSpeechRecognitionModule.getPermissionsAsync)
      .mockResolvedValue(permission(false, true))
    jest.mocked(ExpoSpeechRecognitionModule.requestPermissionsAsync).mockReturnValue(
      new Promise((resolve) => {
        grant = resolve
      })
    )
    const { result: hook, unmount } = renderVoiceInput()

    let pending: Promise<void> = Promise.resolve()
    await act(async () => {
      pending = hook.current.start()
    })
    unmount()
    grant(permission(true, true))
    await pending

    expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled()
  })

  it("turns the microphone off when the screen goes away", async () => {
    const { result: hook, unmount } = renderVoiceInput()

    await act(() => hook.current.start())
    unmount()

    expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalled()
  })

  it("does nothing when the device has no speech recognizer", async () => {
    jest.mocked(ExpoSpeechRecognitionModule.isRecognitionAvailable).mockReturnValue(false)
    const { result: hook } = renderVoiceInput()

    await act(() => hook.current.start())

    expect(hook.current.isAvailable).toBe(false)
    expect(ExpoSpeechRecognitionModule.getPermissionsAsync).not.toHaveBeenCalled()
    expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled()
  })
})

describe("resolveRecognitionLocale", () => {
  const supported = ["de-DE", "en-GB", "en-US", "fr-CA", "fr-FR", "zh-CN", "zh-TW"]

  it.each([
    ["an exact match", "en-GB", "en-GB"],
    ["the language and region without the script", "zh-Hans-CN", "zh-CN"],
    ["the language's home variant for an unsupported region", "fr-US", "fr-FR"],
    ["any variant of the language", "de-AT", "de-DE"],
    ["US English for an unsupported English region", "en-NL", "en-US"],
    ["English for an unsupported language", "hy-AM", "en-US"],
  ])("picks %s", (_, deviceTag, expected) => {
    expect(resolveRecognitionLocale(locale(deviceTag), supported)).toBe(expected)
  })

  it("matches regardless of case and separator", () => {
    expect(resolveRecognitionLocale(locale("en-GB"), ["en_gb"])).toBe("en_gb")
  })

  it("keeps the device tag when the recognizer can't list its locales", () => {
    expect(resolveRecognitionLocale(locale("fr-US"), [])).toBe("fr-US")
  })
})
