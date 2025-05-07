import { stringify } from "qs"
import { Linking, Platform } from "react-native"

export function presentEmailComposer(toAddress: string, subject: string, body?: string) {
  if (Platform.OS !== "ios") {
    Linking.openURL(`mailto:${toAddress}?${stringify({ subject, body })}`)
  } else if (body) {
    const url = `mailto:${toAddress}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
    Linking.openURL(url).catch((err) => console.error("Error opening email client:", err))
  } else {
    const url = `mailto:${toAddress}?subject=${encodeURIComponent(subject)}`
    Linking.openURL(url).catch((err) => console.error("Error opening email client:", err))
  }
}
