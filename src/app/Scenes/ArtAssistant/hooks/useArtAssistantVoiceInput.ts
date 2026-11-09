import { captureException } from "@sentry/react-native"
import { useToast } from "app/Components/Toast/toastHook"
import {
  ExpoSpeechRecognitionErrorCode,
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition"
import { useCallback, useEffect, useRef, useState } from "react"
import { Alert, Linking } from "react-native"
import { getLocales, Locale } from "react-native-localize"
import { useSharedValue } from "react-native-reanimated"

export type ArtAssistantVoiceInputStatus = "idle" | "starting" | "listening"

const FALLBACK_LOCALE = "en-US"
export const ART_ASSISTANT_VOICE_INPUT_ERROR = "Voice input isn't available right now."

// The recognizer reports volume from -2 to 10, where anything below 0 is inaudible.
const MAX_VOLUME = 10
const VOLUME_EVENT_INTERVAL_MS = 100

// Nothing was said, or the session was stopped on purpose: not worth telling the user about.
const QUIET_ERRORS: ExpoSpeechRecognitionErrorCode[] = [
  "aborted",
  "interrupted",
  "no-speech",
  "speech-timeout",
]

/**
 * Dictation for the Art Assistant composer, backed by the platform speech recognizer
 * (SFSpeechRecognizer on iOS, SpeechRecognizer on Android).
 *
 * Recognition runs in the device language and falls back to English when the recognizer does not
 * support it. Every partial transcript is handed to `onTranscript`, so the text appears in the
 * composer while the user speaks; nothing is sent on its own.
 *
 * `volume` is the microphone level from 0 (silence) to 1. It is a shared value so the listening
 * animation follows the voice on the UI thread without re-rendering the screen on every event.
 */
export const useArtAssistantVoiceInput = (onTranscript: (transcript: string) => void) => {
  const toast = useToast()
  const [status, setStatus] = useState<ArtAssistantVoiceInputStatus>("idle")
  const [isAvailable] = useState(() => ExpoSpeechRecognitionModule.isRecognitionAvailable())
  const volume = useSharedValue(0)
  // Bumped on every start and cancel, so a permission prompt that resolves after a cancel can tell
  // it is stale and does not start listening.
  const attempt = useRef(0)
  // Only the session this hook started may write to the composer: results and errors that arrive
  // after a cancel are dropped.
  const isSessionActive = useRef(false)
  // A cancelled session still sends its own `end` a moment later. Until it arrives, an `end` belongs
  // to that session and must not end one started since.
  const isAwaitingCancelledSessionEnd = useRef(false)
  const locale = useRef(FALLBACK_LOCALE)
  const shouldRetryInFallbackLocale = useRef(false)

  const startRecognition = (lang: string) => {
    locale.current = lang
    ExpoSpeechRecognitionModule.start({
      addsPunctuation: true,
      interimResults: true,
      iosTaskHint: "dictation",
      lang,
      volumeChangeEventOptions: { enabled: true, intervalMillis: VOLUME_EVENT_INTERVAL_MS },
    })
  }

  const start = useCallback(async () => {
    if (!isAvailable || isSessionActive.current) {
      return
    }

    attempt.current += 1
    const currentAttempt = attempt.current

    setStatus("starting")

    const permission = await ExpoSpeechRecognitionModule.getPermissionsAsync()

    // Once denied, the system prompt never shows again, so Settings is the only way back.
    if (!permission.granted && !permission.canAskAgain) {
      setStatus("idle")
      showPermissionAlert()
      return
    }

    const { granted } = permission.granted
      ? permission
      : await ExpoSpeechRecognitionModule.requestPermissionsAsync()

    if (currentAttempt !== attempt.current) {
      return
    }

    if (!granted) {
      setStatus("idle")
      return
    }

    const lang = await getRecognitionLocale()

    if (currentAttempt !== attempt.current) {
      return
    }

    isSessionActive.current = true
    shouldRetryInFallbackLocale.current = false
    startRecognition(lang)
  }, [isAvailable])

  // Ends the session without waiting for the final result, e.g. because the prompt was just sent.
  const cancel = useCallback(() => {
    attempt.current += 1

    if (isSessionActive.current) {
      isSessionActive.current = false
      isAwaitingCancelledSessionEnd.current = true
      ExpoSpeechRecognitionModule.abort()
    }

    volume.set(0)
    setStatus("idle")
  }, [volume])

  // Ends the session and keeps whatever was recognized so far. Before the recognizer has started
  // (the permission prompt is still up) there is nothing to keep.
  const stop = useCallback(() => {
    if (!isSessionActive.current) {
      cancel()
      return
    }

    ExpoSpeechRecognitionModule.stop()
  }, [cancel])

  useSpeechRecognitionEvent("start", () => {
    if (isSessionActive.current) {
      setStatus("listening")
    }
  })

  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript

    if (isSessionActive.current && transcript) {
      onTranscript(transcript)
    }
  })

  useSpeechRecognitionEvent("volumechange", (event) => {
    if (isSessionActive.current) {
      volume.set(Math.min(Math.max(event.value / MAX_VOLUME, 0), 1))
    }
  })

  useSpeechRecognitionEvent("error", (event) => {
    if (!isSessionActive.current || QUIET_ERRORS.includes(event.error)) {
      return
    }

    // The recognizer emits `end` right after this, which restarts it in English.
    if (event.error === "language-not-supported" && locale.current !== FALLBACK_LOCALE) {
      shouldRetryInFallbackLocale.current = true
      return
    }

    if (event.error === "not-allowed") {
      showPermissionAlert()
      return
    }

    captureException(new Error(event.message), {
      tags: { source: "art_assistant_voice_input", speech_recognition_error: event.error },
    })
    toast.show(ART_ASSISTANT_VOICE_INPUT_ERROR, "bottom", { backgroundColor: "red100" })
  })

  useSpeechRecognitionEvent("end", () => {
    if (isAwaitingCancelledSessionEnd.current) {
      isAwaitingCancelledSessionEnd.current = false
      return
    }

    if (isSessionActive.current && shouldRetryInFallbackLocale.current) {
      shouldRetryInFallbackLocale.current = false
      startRecognition(FALLBACK_LOCALE)
      return
    }

    isSessionActive.current = false
    volume.set(0)
    setStatus("idle")
  })

  // Leaving the screen must not leave the microphone on, including when a permission prompt that
  // is still up resolves afterwards.
  useEffect(() => {
    return () => {
      attempt.current += 1

      if (isSessionActive.current) {
        isSessionActive.current = false
        ExpoSpeechRecognitionModule.abort()
      }
    }
  }, [])

  return { cancel, isAvailable, start, status, stop, volume }
}

const getRecognitionLocale = async () => {
  const deviceLocale = getLocales()[0]

  if (!deviceLocale) {
    return FALLBACK_LOCALE
  }

  try {
    const { locales } = await ExpoSpeechRecognitionModule.getSupportedLocales({})

    return resolveRecognitionLocale(deviceLocale, locales)
  } catch {
    // Android throws when the recognition service can't be queried. The recognizer itself still
    // reports an unsupported language, which falls back to English.
    return deviceLocale.languageTag
  }
}

/**
 * Picks the recognizer locale closest to the device language. The device tag rarely matches the
 * recognizer's list as is: iOS needs an exact `zh-CN`, not `zh-Hans-CN`, and a French speaker in
 * the US (`fr-US`) is better served by `fr-FR` than by English.
 */
export const resolveRecognitionLocale = (deviceLocale: Locale, supportedLocales: string[]) => {
  // Android 12 and below can't list locales, so let the recognizer judge the device tag.
  if (!supportedLocales.length) {
    return deviceLocale.languageTag
  }

  const { countryCode, languageCode, languageTag } = deviceLocale
  const supported = new Map(
    supportedLocales.map((locale) => [locale.replace("_", "-").toLowerCase(), locale])
  )
  const sameLanguage = supportedLocales.filter((locale) =>
    locale.toLowerCase().startsWith(`${languageCode.toLowerCase()}-`)
  )

  return (
    supported.get(languageTag.toLowerCase()) ??
    supported.get(`${languageCode}-${countryCode}`.toLowerCase()) ??
    // The language's home variant (`fr-FR`, `de-DE`) before any other. English has no `en-EN`, so
    // it gets the fallback rather than whichever variant sorts first (`en-AE`).
    supported.get(`${languageCode}-${languageCode}`.toLowerCase()) ??
    (FALLBACK_LOCALE.startsWith(`${languageCode}-`) ? FALLBACK_LOCALE : sameLanguage[0]) ??
    FALLBACK_LOCALE
  )
}

const showPermissionAlert = () =>
  Alert.alert(
    "Allow access to your microphone",
    "To dictate to Art Assistant, allow Artsy to access your microphone and speech recognition in Settings.",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Open Settings", onPress: () => Linking.openSettings() },
    ]
  )
