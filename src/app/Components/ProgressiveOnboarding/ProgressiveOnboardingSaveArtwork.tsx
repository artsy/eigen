import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { FC, useEffect, useState } from "react"

export const ProgressiveOnboardingSaveArtwork: FC = ({ children }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false)
  const popover = usePopoverMessage()

  const handleDismiss = () => {
    setIsDismissed(true)
    popover.hide()
  }

  useEffect(() => {
    if (!isDismissed) {
      popover.show({
        title: "Like what you see?",
        message: "Hit the heart to save an artwork.",
        placement: "top",
        withPointer: "bottom",
        onPress: handleDismiss,
      })
    }
  })
  return <>{children}</>
}
