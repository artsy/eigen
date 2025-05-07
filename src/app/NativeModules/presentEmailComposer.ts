import { Linking } from "react-native"

export function presentEmailComposer(toAddress: string, subject: string, body?: string) {
  if (body) {
    const url = `mailto:${toAddress}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
    Linking.openURL(url).catch((err) => console.error("Error opening email client:", err))
  } else {
    const url = `mailto:${toAddress}?subject=${encodeURIComponent(subject)}`
    Linking.openURL(url).catch((err) => console.error("Error opening email client:", err))
  }
}
