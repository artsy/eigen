import { useEffect, useState } from "react"
import { Linking } from "react-native"

export const useCanOpenURL = (urlScheme: string): boolean | undefined => {
  const [canOpen, setCanOpen] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const doIt = async () => {
      setCanOpen(await Linking.canOpenURL(urlScheme))
    }
    doIt()
  }, [])

  return canOpen
}
